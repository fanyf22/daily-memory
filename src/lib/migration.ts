import type { Task } from "@lib/task.ts";

function migrateFrom0To1(task: Task) {
  return { ...task, time: null, version: 1 };
}

const migrations = [migrateFrom0To1];

function migrateTask(task: Task): Task {
  const version = task.version ?? 0;
  return migrations.slice(version).reduce((task, migration) => migration(task), task);
}

export function migrate(tasks: Task[]): Task[] {
  return tasks.map(migrateTask);
}
