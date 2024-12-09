import {
  deleteSchedule,
  type Schedule,
  type Schedules,
  type ScheduleTime,
  updateSchedule,
} from "@lib/schedule.ts";
import { App, AutoComplete, Button, Col, Modal, Row, Tooltip } from "antd";
import { type FC, useState } from "react";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface ScheduleTableItemProps {
  schedule: Schedule | undefined;
  time: ScheduleTime;
  schedules?: Schedules;
  onChange?: (schedule: Schedule | undefined) => void;
}

const ScheduleTableItem: FC<ScheduleTableItemProps> = ({
  schedule,
  time,
  schedules = [],
  onChange = () => {},
}) => {
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

  const { message } = App.useApp();

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
      message.error("Title is required").then();
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
      <td
        className={`${
          time[0] == 0 || time[0] == 6 ? "bg-amber-50" : ""
        } w-40 h-16 border text-center hover:cursor-pointer hover:bg-sky-50`}
        onClick={startEditing}
      >
        <Tooltip title={hoverHint} placement="right">
          {schedule?.title}
        </Tooltip>
      </td>
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
  schedules: Scheduleks;
  dayInWeek: number;
  onChange?: (schedules: Schedules) => void;
}

const ScheduleTable: FC<ScheduleTableProps> = ({ schedules, dayInWeek, onChange = () => {} }) => {
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
            <td className={`w-40 h-16 text-center border font-semibold bg-gray-50`} key={index}>
              <p className={dayInWeek == index ? "text-amber-900 text-lg" : ""}>{dayName}</p>
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
