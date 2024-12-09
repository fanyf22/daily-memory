import BackupPage from "@app/backup/page.tsx";
import MemoryPage from "@app/memory/page.tsx";
import SchedulePage from "@app/schedule/page.tsx";
import TasksPage from "@app/tasks/page.tsx";
import type { JSX } from "react";

const pages: { [P in string]: { label: string; title: string; element: JSX.Element } } = {
  "/tasks": {
    label: "Tasks",
    title: "Write down your daily tasks and supervise yourself.",
    element: <TasksPage />,
  },
  "/memory": {
    label: "Memory",
    title: "Record your everyday feelings, experience and perception.",
    element: <MemoryPage />,
  },
  "/schedule": {
    label: "Schedule",
    title: "Arrange your class schedules and stick to it.",
    element: <SchedulePage />,
  },
  "/backup": {
    label: "Backup",
    title: "Backup or recover your data.",
    element: <BackupPage />,
  },
};

export default pages;
