import DateInput from "@components/date-input.tsx";
import ScheduleTable from "@components/schedule-table.tsx";
import { currentDay, dayInWeek } from "@lib/datetime.ts";
import { loadSchedules, saveSchedules, type Schedules } from "@lib/schedule.ts";
import { Button, Flex, Popconfirm } from "antd";
import { type FC, useState } from "react";

const SchedulePage: FC = () => {
  const [schedules, setSchedules] = useState(loadSchedules());
  const [date, setDate] = useState(currentDay);

  const updateSchedules = (schedules: Schedules) => {
    setSchedules(schedules);
    saveSchedules(schedules);
  };

  const count = schedules.filter((schedule) => schedule.time[0] == dayInWeek(date)).length;

  return (
    <div className="flex flex-col items-center p-10">
      <div className="flex flex-col w-fit items-center gap-6">
        <Flex className="w-full pl-4 pr-4" gap="large" justify="space-between">
          <DateInput date={date} onChange={setDate} />
          <Popconfirm
            title="Are you sure to clear all schedules?"
            onConfirm={() => updateSchedules([])}
          >
            <Button danger>Clear All</Button>
          </Popconfirm>
        </Flex>
        <ScheduleTable schedules={schedules} date={date} onChange={updateSchedules} />
        <p className={count ? "text-red-700" : "text-green-700"}>
          You have {count ? count : "no"} class schedules today.{" "}
          {count ? "Cheer up!" : "Have a rest!"}
        </p>
      </div>
    </div>
  );
};

export default SchedulePage;
