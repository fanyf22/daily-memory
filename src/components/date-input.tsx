import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { type Day, dayjsToDay, dayToDayjs, nextDay, previousDay } from "@lib/datetime.ts";
import { Button, DatePicker, Space, Tooltip } from "antd";
import type { FC } from "react";

export interface DatePickerProps {
  date: Day;
  onChange: (date: Day) => void;
}

const DateInput: FC<DatePickerProps> = ({ date, onChange }) => {
  return (
    <Space size="small">
      <Tooltip title="Previous day">
        <Button icon={<DoubleLeftOutlined />} onClick={() => onChange(previousDay(date))} />
      </Tooltip>
      <DatePicker
        value={dayToDayjs(date)}
        onChange={(date) => date && onChange(dayjsToDay(date))}
      />
      <Tooltip title="Next day">
        <Button icon={<DoubleRightOutlined />} onClick={() => onChange(nextDay(date))} />
      </Tooltip>
    </Space>
  );
};

export default DateInput;
