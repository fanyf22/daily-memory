import DateInput from "@components/date-input.tsx";
import ScheduleTable from "@components/schedule-table.tsx";
import { currentDay, dayInWeek } from "@lib/datetime.ts";
import { loadSchedules, saveSchedules, type Schedules } from "@lib/schedule.ts";
import { screenshotAndCopy, screenshotAndDownload } from "@lib/screenshot.ts";
import { App, Button, Flex, Popconfirm, Space } from "antd";
import { type FC, useRef, useState } from "react";

const SchedulePage: FC = () => {
  const [schedules, setSchedules] = useState(loadSchedules());
  const [date, setDate] = useState(currentDay);

  const updateSchedules = (schedules: Schedules) => {
    setSchedules(schedules);
    saveSchedules(schedules);
  };

  const count = schedules.filter((schedule) => schedule.time[0] == dayInWeek(date)).length;

  const { message } = App.useApp();

  const scheduleRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (scheduleRef.current) {
      screenshotAndCopy(scheduleRef.current)
        .then(() => message.success("Copied to clipboard!"))
        .catch(() => message.error("Failed to copy to clipboard."));
    }
  };

  const handleDownload = () => {
    if (scheduleRef.current) {
      screenshotAndDownload(scheduleRef.current)
        .then(() => message.success("Downloaded!"))
        .catch(() => message.error("Failed to download."));
    }
  };

  return (
    <div className="flex flex-col items-center p-16">
      <div className="flex flex-col w-fit items-center gap-4">
        <Flex className="w-full pl-4 pr-4" gap="large" align="center">
          <DateInput date={date} onChange={setDate} />
          <div className="flex-1 text-center">
            <p className={count ? "text-yellow-700" : "text-green-700"}>
              You have {count ? count : "no"} class schedules today.{" "}
              <span className="text-red-700 font-semibold">
                {count ? "Cheer up!" : "Do your homework!"}
              </span>
            </p>
          </div>
          <Space direction="horizontal" size="middle">
            <Button onClick={handleCopy}>Copy</Button>
            <Button onClick={handleDownload}>Download</Button>
            <Popconfirm
              title="Are you sure to clear all schedules?"
              onConfirm={() => updateSchedules([])}
            >
              <Button danger>Clear All</Button>
            </Popconfirm>
          </Space>
        </Flex>
        <div ref={scheduleRef}>
          <ScheduleTable
            schedules={schedules}
            dayInWeek={dayInWeek(date)}
            onChange={updateSchedules}
          />
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
