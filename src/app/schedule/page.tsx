import DateInput from "@components/date-input.tsx";
import ScheduleTable from "@components/schedule-table.tsx";
import { currentDay, dayInWeek } from "@lib/datetime.ts";
import { loadSchedules, saveSchedules, type Schedules } from "@lib/schedule.ts";
import { screenshotAndCopy, screenshotAndDownload } from "@lib/screenshot.ts";
import { Button, Flex, message, Popconfirm, Space } from "antd";
import { type FC, useRef, useState } from "react";

const SchedulePage: FC = () => {
  const [schedules, setSchedules] = useState(loadSchedules());
  const [date, setDate] = useState(currentDay);

  const updateSchedules = (schedules: Schedules) => {
    setSchedules(schedules);
    saveSchedules(schedules);
  };

  const count = schedules.filter((schedule) => schedule.time[0] == dayInWeek(date)).length;

  const [messageApi, contextHolder] = message.useMessage();

  const scheduleRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (scheduleRef.current) {
      screenshotAndCopy(scheduleRef.current)
        .then(() => messageApi.success("Copied to clipboard!"))
        .catch(() => messageApi.error("Failed to copy to clipboard."));
    }
  };

  const handleDownload = () => {
    if (scheduleRef.current) {
      screenshotAndDownload(scheduleRef.current)
        .then(() => messageApi.success("Downloaded!"))
        .catch(() => messageApi.error("Failed to download."));
    }
  };

  return (
    <div className="flex flex-col items-center p-16">
      {contextHolder}
      <div className="flex flex-col w-fit items-center gap-4">
        <Flex className="w-full pl-4 pr-4" gap="large" align="center">
          <DateInput date={date} onChange={setDate} />
          <div className="flex-1 text-center">
            <p className={count ? "text-yellow-700" : "text-green-700"}>
              You have {count ? count : "no"} class schedules today.{" "}
              {count ? "Cheer up!" : "Have a rest!"}
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
