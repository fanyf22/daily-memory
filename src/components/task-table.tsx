import { dayjsToTime, formatTime, type Time, timeToDayjs } from "@lib/datetime.ts";
import type { Task } from "@lib/task.ts";
import {
  Checkbox,
  Input,
  type InputRef,
  message,
  Space,
  Table,
  type TableProps,
  TimePicker,
} from "antd";
import type { PickerRef } from "rc-picker";
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
  const [title, setTitle] = useState("");
  const [estimated, setEstimated] = useState("");
  const [time, setTime] = useState<Time | null>(null);

  const editing: Task["key"] | undefined = useMemo(() => {
    for (const task of tasks) {
      if (task.title == "") {
        setTitle("");
        return task.key;
      }
    }
    return innerEditing;
  }, [tasks, innerEditing]);

  useEffect(() => setEditing(!!editing), [editing, setEditing]);

  const titleEditor = useRef<InputRef>(null);
  const estimatedEditor = useRef<InputRef>(null);
  const timeEditor = useRef<PickerRef>(null);

  useEffect(() => {
    titleEditor.current?.focus();
  }, [editing]);

  const [messageApi, contextHolder] = message.useMessage({ maxCount: 3 });

  const handleOk = useCallback(() => {
    setInnerEditing(undefined);
    setTitle("");
    setEstimated("");
    onChange(
      modify(tasks, (tasks) => {
        for (const task of tasks) {
          if (task.key == editing) {
            task.title = title;
            task.estimated = estimated;
            task.time = time;
          }
        }
      })
    );
  }, [onChange, tasks, editing, title, estimated, time]);

  const handleCancel = useCallback(() => {
    setInnerEditing(undefined);
    setEditing(false);
    setTitle("");
    setEstimated("");
    onChange(modify(tasks));
  }, [onChange, setEditing, tasks]);

  const handleEdit = useCallback(
    ({ key, title, estimated }: Pick<Task, "key" | "title" | "estimated">) => {
      if (editing) {
        messageApi.error("Please finish editing before starting a new one.").then();
        return;
      }
      setInnerEditing(key);
      setTitle(title);
      setEstimated(estimated);
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
              onChange={(e) => setTitle(e.target.value)}
              onPressEnter={() => estimatedEditor.current?.focus()}
            />
          );
        } else {
          return title;
        }
      },
    },
    {
      title: "Estimated Duration",
      dataIndex: "estimated",
      key: "estimated",
      align: "center",
      render: (esimated, { key }) => {
        if (editing == key) {
          return (
            <Input
              ref={estimatedEditor}
              defaultValue={esimated}
              placeholder="Estimated Duration"
              className="w-36"
              onChange={(e) => setEstimated(e.target.value)}
              onPressEnter={() => timeEditor.current?.focus()}
            />
          );
        } else {
          return esimated;
        }
      },
    },
    {
      title: "Executed Time",
      dataIndex: "time",
      key: "time",
      align: "center",
      render: (time, { key }) => {
        if (editing == key) {
          return (
            <TimePicker
              ref={timeEditor}
              format="HH:mm"
              defaultValue={time ? timeToDayjs(time) : null}
              onChange={(time) => setTime(dayjsToTime(time))}
            />
          );
        } else {
          return time ? formatTime(time) : "";
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
                className={editing ? "text-neutral-400 hover:cursor-not-allowed" : ""}
                onClick={() => handleEdit({ key, title, estimated })}
              >
                Edit
              </a>
              <a
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
