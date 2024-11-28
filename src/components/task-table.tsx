import type { Task } from "@lib/task.ts";
import { Checkbox, Input, InputRef, message, Space, Table, type TableProps } from "antd";
import { type FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

function modify<T>(array: T[], modifier: (array: T[]) => T[] | undefined | void = () => {}): T[] {
  const cloned = [...array];
  return modifier(cloned) ?? cloned;
}

export interface TaskTableProps {
  tasks: Task[];
  setEditing?: (editing: boolean) => void;
  onChange?: (tasks: Task[]) => void;
}

const TaskTable: FC<TaskTableProps> = ({ tasks, setEditing = () => {}, onChange = () => {} }) => {
  tasks = tasks.sort((a, b) => (a.finished ? 1 : 0) - (b.finished ? 1 : 0));

  const [innerEditing, setInnerEditing] = useState<Task["key"]>();
  const [editTitle, setEditTitle] = useState("");
  const [editEstimated, setEditEsimated] = useState("");

  const editing: Task["key"] | undefined = useMemo(() => {
    for (const task of tasks) {
      if (task.title == "") {
        setEditTitle("");
        return task.key;
      }
    }
    return innerEditing;
  }, [tasks, innerEditing]);

  useEffect(() => setEditing(!!editing), [editing, setEditing]);

  const titleEditor = useRef<InputRef>(null);
  const estimatedEditor = useRef<InputRef>(null);

  useEffect(() => {
    titleEditor.current?.focus();
  }, [editing]);

  const [messageApi, contextHolder] = message.useMessage({ maxCount: 3 });

  const handleOk = useCallback(() => {
    setInnerEditing(undefined);
    setEditTitle("");
    setEditEsimated("");
    onChange(
      modify(tasks, (tasks) => {
        for (const task of tasks) {
          if (task.key == editing) {
            task.title = editTitle;
            task.estimated = editEstimated;
          }
        }
      })
    );
  }, [editEstimated, editTitle, editing, onChange, tasks]);

  const handleCancel = useCallback(() => {
    setInnerEditing(undefined);
    setEditing(false);
    setEditTitle("");
    setEditEsimated("");
    onChange(modify(tasks));
  }, [onChange, setEditing, tasks]);

  const handleEdit = useCallback(
    ({ key, title, estimated }: Pick<Task, "key" | "title" | "estimated">) => {
      if (editing) {
        messageApi.error("Please finish editing before starting a new one.").then();
        return;
      }
      setInnerEditing(key);
      setEditTitle(title);
      setEditEsimated(estimated);
    },
    [editing, messageApi]
  );

  const handleDelete = useCallback(
    ({ key }: Pick<Task, "key">) => {
      if (editing) {
        messageApi.error("Please finish editing before deleting.").then();
      } else {
        onChange(tasks.filter((task) => task.key != key));
      }
    },
    [editing, messageApi, onChange, tasks]
  );

  const columns: TableProps<Task>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      minWidth: 200,
      align: "center",
      render: (title, { key }) => {
        if (editing == key) {
          return (
            <Input
              ref={titleEditor}
              defaultValue={title}
              placeholder="Task Title"
              className="w-36"
              onChange={(e) => setEditTitle(e.target.value)}
              onPressEnter={() => estimatedEditor.current?.focus()}
            />
          );
        } else {
          return title;
        }
      },
    },
    {
      title: "Estimated Time",
      dataIndex: "estimated",
      key: "estimated",
      align: "center",
      render: (esimated, { key }) => {
        if (editing == key) {
          return (
            <Input
              ref={estimatedEditor}
              defaultValue={esimated}
              placeholder="Estimated Time"
              className="w-36"
              onChange={(e) => setEditEsimated(e.target.value)}
              onPressEnter={handleOk}
            />
          );
        } else {
          return esimated;
        }
      },
    },
    {
      title: "Finished",
      dataIndex: "finished",
      key: "finished",
      align: "center",
      render: (finished, { key }) => (
        <Checkbox
          defaultChecked={finished}
          disabled={!!editing}
          onChange={(e) => {
            onChange(
              modify(tasks, (tasks) => {
                for (const task of tasks) {
                  if (task.key == key) {
                    task.finished = e.target.checked;
                  }
                }
              })
            );
          }}
        />
      ),
    },
    {
      title: "Operation",
      key: "operation",
      align: "center",
      render: (_, { key, title, estimated }) => (
        <Space direction="horizontal" size="middle">
          {editing == key ? (
            <>
              <a onClick={handleOk}>Ok</a>
              <a onClick={handleCancel}>Cancel</a>
            </>
          ) : (
            <>
              <a
                aria-disabled={!!editing}
                className={editing ? "text-neutral-400 hover:cursor-not-allowed" : ""}
                onClick={() => handleEdit({ key, title, estimated })}
              >
                Edit
              </a>
              <a
                aria-disabled={!!editing}
                className={editing ? "text-neutral-400 hover:cursor-not-allowed" : ""}
                onClick={() => handleDelete({ key })}
              >
                Delete
              </a>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Table columns={columns} dataSource={tasks} pagination={false} />
    </>
  );
};

export default TaskTable;
