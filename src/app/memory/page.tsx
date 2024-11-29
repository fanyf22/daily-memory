import DateInput from "@components/date-input.tsx";
import MemoList from "@components/memo-list.tsx";
import { currentDay } from "@lib/datetime.ts";
import { createMemory, loadMemories, type Memory, saveMemories } from "@lib/memory.ts";
import { Button, Divider, Flex, Space } from "antd";
import { type FC, useCallback, useEffect, useState } from "react";

const MemoryPage: FC = () => {
  const [memories, setMemories] = useState<Memory[]>(loadMemories);
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(currentDay());

  const handleNewMemory = useCallback(() => {
    setMemories(createMemory(memories, "", date));
  }, [date, memories]);

  useEffect(() => {
    if (!editing) {
      const listener = (e: KeyboardEvent) => {
        if (e.key == "Enter" && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
          e.preventDefault();
          handleNewMemory();
        }
      };

      window.addEventListener("keydown", listener);
      return () => window.removeEventListener("keydown", listener);
    }
  }, [editing, handleNewMemory]);

  return (
    <div className="flex flex-col h-full items-center p-16">
      <Space size="small" direction="vertical" className="min-w-96">
        <Flex gap="large" justify="space-between">
          <DateInput date={date} onChange={setDate} />
          <Button onClick={handleNewMemory}>New Memory</Button>
        </Flex>
        <Divider />
        <MemoList
          memories={memories}
          setEditing={setEditing}
          onChange={(memories) => {
            setMemories(memories);
            saveMemories(memories);
          }}
        />
      </Space>
    </div>
  );
};

export default MemoryPage;
