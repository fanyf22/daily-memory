import { type Day, dayInWeek } from "@lib/datetime.ts";
import {
  deleteSchedule,
  type Schedule,
  type Schedules,
  type ScheduleTime,
  updateSchedule,
} from "@lib/schedule.ts";
import { AutoComplete, Button, Col, message, Modal, Row, Tooltip } from "antd";
import { type FC, useState } from "react";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const tableCells = "w-40 h-16 text-center border";

interface ScheduleTableItemProps {
  schedule: Schedule | undefined;
  time: ScheduleTime;
  isToday: boolean;
  schedules?: Schedules;
  onChange?: (schedule: Schedule | undefined) => void;
}

const ScheduleTableItem: FC<ScheduleTableItemProps> = ({
  schedule,
  time,
  isToday,
  schedules = [],
  onChange = () => {},
}) => {
  const color = isToday ? "bg-amber-50" : "";
  const hoverHint = schedule
    ? schedule.location
      ? schedule.location
      : "No location is specified"
    : "";

  const handleSelect = (value: string) => {
    const schedule = schedules.find((schedule) => schedule.title === value);
    if (schedule) {
      setLocation(schedule.location);
    }
  };

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const titleOptions = Array.from(new Set(schedules.map((schedule) => schedule.title)))
    .sort()
    .map((value) => ({ value }));

  const locationOptions = Array.from(
    new Set(
      schedules
        .filter((schedule) => schedule.title == title)
        .map((schedule) => schedule.location)
        .sort()
    )
  ).map((value) => ({ value }));

  const [messageApi, contextHolder] = message.useMessage();

  const startEditing = () => {
    setEditing(true);
    setTitle(schedule?.title ?? "");
    setLocation(schedule?.location ?? "");
    console.log(schedule);
  };

  const save = () => {
    if (title) {
      setEditing(false);
      onChange?.({ time, title, location });
    } else {
      messageApi.error("Title is required").then();
    }
  };

  const cancel = () => {
    setEditing(false);
  };

  const remove = () => {
    onChange?.(undefined);
    setEditing(false);
  };

  return (
    <>
      {contextHolder}
      <Tooltip title={hoverHint}>
        <td
          className={`${tableCells} ${color} hover:cursor-pointer hover:bg-sky-50`}
          onClick={startEditing}
        >
          {schedule?.title}
        </td>
      </Tooltip>
      <Modal
        className="max-w-[24rem]"
        title="Edit Schedule"
        open={editing}
        onOk={save}
        onCancel={cancel}
        footer={[
          <Button key="cancel" onClick={cancel} type="default">
            Cancel
          </Button>,
          <Button key="delete" onClick={remove} color="danger" variant="outlined">
            Delete
          </Button>,
          <Button key="save" onClick={save} type="primary">
            Save
          </Button>,
        ]}
      >
        <Row className="mt-8 mb-4">
          <Col span={6} className="flex flex-col justify-around">
            <p className="text-right pr-2">
              <span className="text-red-500">*</span> Title:
            </p>
          </Col>
          <Col span={16}>
            <AutoComplete
              value={title}
              placeholder="Enter the title"
              options={titleOptions}
              onSelect={handleSelect}
              onChange={setTitle}
              className="w-full"
            />
          </Col>
        </Row>
        <Row className="mt-4 mb-8">
          <Col span={6} className="flex flex-col justify-around">
            <p className="text-right pr-2">Location:</p>
          </Col>
          <Col span={16}>
            <AutoComplete
              value={location}
              placeholder="Enter the location"
              options={locationOptions}
              onChange={setLocation}
              className="w-full"
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export interface ScheduleTableProps {
  schedules: Schedules;
  date: Day;
  autoComplete?: string[];
  onChange?: (schedules: Schedules) => void;
}

const ScheduleTable: FC<ScheduleTableProps> = ({ schedules, date, onChange = () => {} }) => {
  const tabledSchedules: (Schedule | undefined)[][] = new Array(6)
    .fill(undefined)
    .map(() => new Array(7).fill(undefined));
  schedules.forEach((schedule) => {
    const [day, period] = schedule.time;
    tabledSchedules[period][day] = schedule;
  });

  return (
    <table>
      <thead>
        <tr>
          {dayNames.map((dayName, index) => (
            <td className={`${tableCells} font-semibold bg-gray-50`} key={index}>
              {dayName}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {tabledSchedules.map((row, period) => (
          <tr key={period}>
            {row.map((schedule, day) => (
              <ScheduleTableItem
                key={day}
                time={[day, period]}
                schedule={schedule}
                isToday={dayInWeek(date) == day}
                schedules={schedules}
                onChange={(newSchedule) => {
                  if (newSchedule) {
                    onChange(updateSchedule(schedules, newSchedule));
                  } else if (schedule) {
                    onChange(deleteSchedule(schedules, schedule));
                  }
                }}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ScheduleTable;
