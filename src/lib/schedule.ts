export type ScheduleTime = [number, number]; // [2, 4] => Wednesday 5th class

export interface Schedule {
  title: string;
  location: string;
  time: ScheduleTime;
}

export type Schedules = Schedule[];

export function saveSchedules(schedules: Schedules) {
  localStorage.setItem("schedules", JSON.stringify(schedules));
}

export function loadSchedules(): Schedules {
  return JSON.parse(localStorage.getItem("schedules") ?? "[]") as Schedules;
}

export function deleteSchedule(schedules: Schedules, schedule: Schedule): Schedules {
  return schedules.filter((s) => s.time[0] != schedule.time[0] || s.time[1] != schedule.time[1]);
}

export function updateSchedule(schedules: Schedules, schedule: Schedule): Schedules {
  return deleteSchedule(schedules, schedule).concat(schedule);
}
