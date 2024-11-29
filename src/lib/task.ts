import { type Day, dayToIndex, type Time } from "@lib/datetime.ts";
import { migrate } from "@lib/migration.ts";
import type { Key } from "react";

const TASK_VERSION = 1;

export interface Task {
  key: Key;
  title: string;
  estimated: string;
  time: Time | null;
  finished: boolean;
  date: Day;

  /**
   * This is used to migrate the task data when the schema changes.
   *
   * Version lists:
   * - undefined: title, estimated, finished, date
   * - 1: title, estimated, time, finished, date
   */
  version: number;
}

export type Tasks = { [P in number]: Task[] };

export function saveTasks(tasks: Tasks) {
  for (const date in tasks) {
    localStorage.setItem(date, JSON.stringify(tasks[date]));
  }
}

export function loadTasks(tasks: Tasks, date: Day): Tasks {
  const day = dayToIndex(date);
  if (day in tasks) {
    return tasks;
  }
  const task = JSON.parse(localStorage.getItem(day.toString()) ?? "[]") as Task[];
  const migrated = migrate(task);

  saveTasks({ [day]: migrated });
  return { ...tasks, [day]: migrated };
}

export function createTask(tasks: Tasks, task: Omit<Task, "key" | "version">): Tasks {
  const day = dayToIndex(task.date);
  const fullTask = { ...task, key: crypto.randomUUID(), version: TASK_VERSION };
  return { ...tasks, [day]: [...(tasks[day] ?? []), fullTask] };
}

export function updateTasks(tasks: Tasks, task: Task[], date: Day): Tasks {
  return { ...tasks, [dayToIndex(date)]: task.filter((task) => task.title) };
}

export function getTasks(tasks: Tasks, date: Day): Task[] | undefined {
  return tasks[dayToIndex(date)];
}
