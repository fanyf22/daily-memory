import { type Day, dayToIndex } from "@lib/date.ts";
import type { Key } from "react";

export interface Task {
  key: Key;
  title: string;
  estimated: string;
  finished: boolean;
  date: Day;
}

export type Tasks = { [P in number]: Task[] };

export function saveTasks(tasks: Tasks) {
  for (const date in tasks) {
    localStorage.setItem(date, JSON.stringify(tasks[date]));
  }
}

export function loadTasks(tasks: Tasks, date: Day): Tasks | undefined {
  const day = dayToIndex(date);
  if (day in tasks) {
    return undefined;
  }
  const task = JSON.parse(localStorage.getItem(day.toString()) ?? "[]") as Task[];
  return { ...tasks, [day]: task };
}

export function createTask(tasks: Tasks, task: Omit<Task, "key">): Tasks {
  const day = dayToIndex(task.date);
  const taskWithKey = { ...task, key: crypto.randomUUID() };
  return { ...tasks, [day]: [...(tasks[day] ?? []), taskWithKey] };
}

export function deleteTask(tasks: Tasks, task: Task): Tasks {
  const day = dayToIndex(task.date);
  return { ...tasks, [day]: tasks[day].filter((t) => t.key !== task.key) };
}

export function updateTasks(tasks: Tasks, task: Task[], date: Day): Tasks {
  return { ...tasks, [dayToIndex(date)]: task.filter((task) => task.title) };
}

export function getTasks(tasks: Tasks, date: Day): Task[] {
  return tasks[dayToIndex(date)] ?? [];
}
