import dayjs from "dayjs";

export interface Day {
  year: number;
  month: number; // Start from 0
  day: number;
}

export interface Time {
  hour: number;
  minute: number;
}

function isLeapYear(year: number): boolean {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

function getDays(year: number): number[] {
  return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
}

export const nextDay: (date: Day) => Day = ({ year, month, day }) => {
  const days = getDays(year);
  if (day == days[month]) {
    if (month == 11) {
      return { year: year + 1, month: 1, day: 1 };
    } else {
      return { year, month: month + 1, day: 1 };
    }
  } else {
    return { year, month, day: day + 1 };
  }
};

export const previousDay: (date: Day) => Day = ({ year, month, day }) => {
  if (day == 1) {
    if (month == 1) {
      return { year: year - 1, month: 12, day: 31 };
    } else {
      return { year, month: month - 1, day: getDays(year)[month - 2] };
    }
  } else {
    return { year, month, day: day - 1 };
  }
};

export function dayToIndex(date: Day): number {
  return (date.year - 2024) * 366 + date.month * 31 + date.day;
}

export function dayToDayjs({ year, month, day }: Day): dayjs.Dayjs {
  return dayjs().year(year).month(month).date(day);
}

export function dayjsToDay(date: dayjs.Dayjs): Day {
  return { year: date.year(), month: date.month(), day: date.date() };
}

export function timeToDayjs({ hour, minute }: Time): dayjs.Dayjs {
  return dayjs().hour(hour).minute(minute);
}

export function dayjsToTime(time: dayjs.Dayjs | null): Time | null {
  return time ? { hour: time.hour(), minute: time.minute() } : null;
}

export function formatTime({ hour, minute }: Time): string {
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}
