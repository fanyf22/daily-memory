import { currentDay, type Day } from "@lib/datetime.ts";

export interface Memory {
  key: string;
  content: string;
  date: Day;
}

export function saveMemories(memories: Memory[]) {
  localStorage.setItem("memories", JSON.stringify(memories));
}

export function loadMemories(): Memory[] {
  return JSON.parse(localStorage.getItem("memories") ?? "[]") as Memory[];
}

export function createMemory(memories: Memory[], content: string, date: Day = currentDay()) {
  const key = crypto.randomUUID();
  return [...memories, { key, content, date }];
}
