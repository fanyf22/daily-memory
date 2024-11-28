import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import TaskTable from "@components/task-table.tsx";
import { type Day, nextDay, previousDay } from "@lib/date.ts";
import {
  createTask,
  getTasks,
  loadTasks,
  saveTasks,
  type Task,
  type Tasks,
  updateTasks,
} from "@lib/task.ts";
import { Button, DatePicker, Flex, message, Space, Tooltip } from "antd";
import dayjs from "dayjs";
import { FC, useCallback, useEffect, useState } from "react";

const HomePage: FC = () => {
  const [tasks, setTasks] = useState<Tasks>({});
  const [editing, setEditing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 3 });

  const [date, setDate] = useState<Day>(() => {
    const date = dayjs();
    return { year: date.year(), month: date.month(), day: date.date() };
  });

  const updateTask = (date: Day) => {
    const loaded = loadTasks(tasks, date);
    if (loaded !== undefined) {
      setTasks(loaded);
    }
  };

  const updateDate = (date: Day) => {
    setDate(date);
    updateTask(date);
  };

  updateTask(date);

  const handleCreate = useCallback(() => {
    if (editing) {
      messageApi.error("Please finish editing before creating a new one.").then();
      return;
    }
    setTasks(
      createTask(tasks, {
        title: "",
        estimated: "",
        finished: false,
        date,
      })
    );
  }, [date, editing, messageApi, tasks]);

  const handleChange = useCallback(
    (task: Task[]) => {
      const updated = updateTasks(
        tasks,
        task.filter((task) => task.title),
        date
      );
      setTasks(updated);
      saveTasks(updated);
    },
    [date, tasks]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!editing && e.key == "Enter") {
        handleCreate();
      }
    };

    window.addEventListener("keypress", handler);
    return () => window.removeEventListener("keypress", handler);
  });

  return (
    <div className="h-full flex flex-col items-center p-16">
      {contextHolder}
      <Space direction="vertical" size="middle">
        <Flex gap="large" justify="space-between" className="pl-2 pr-2">
          <Space size="small">
            <Tooltip title="Previous day">
              <Button icon={<DoubleLeftOutlined />} onClick={() => updateDate(previousDay(date))} />
            </Tooltip>
            <DatePicker
              value={dayjs().year(date.year).month(date.month).date(date.day)}
              onChange={(date) => {
                updateDate({ year: date.year(), month: date.month(), day: date.date() });
              }}
            />
            <Tooltip title="Next day">
              <Button icon={<DoubleRightOutlined />} onClick={() => updateDate(nextDay(date))} />
            </Tooltip>
          </Space>
          <Button onClick={handleCreate}>New Task</Button>
        </Flex>
        <TaskTable tasks={getTasks(tasks, date)} setEditing={setEditing} onChange={handleChange} />
        {getTasks(tasks, date).some((task) => !task.finished) ? null : (
          <p className="text-red-700 text-center">
            Congratulations! You have finished all tasks for today!
            <br />
            Remember to take a break and have a good rest!
          </p>
        )}
      </Space>
    </div>
  );
};

export default HomePage;
