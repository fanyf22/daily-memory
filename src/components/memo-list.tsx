import { compareDay, type Day, formatDay } from "@lib/datetime.ts";
import type { Memory } from "@lib/memory.ts";
import { Empty, Input } from "antd";
import type { TextAreaRef } from "antd/es/input/TextArea";
import {
  type FC,
  type KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const { TextArea } = Input;

export interface MemoListProps {
  memories: Memory[];
  setEditing?: (editing: boolean) => void;
  onChange?: (memories: Memory[]) => void;
}

const MemoList: FC<MemoListProps> = ({ memories, setEditing = () => {}, onChange = () => {} }) => {
  const [realEditing, setRealEditing] = useState<string>();
  const editing = useMemo(() => {
    for (const memory of memories) {
      if (!memory.content) {
        return memory.key;
      }
    }
    return realEditing;
  }, [memories, realEditing]);

  const editor = useRef<TextAreaRef | null>(null);
  const [edited, setEdited] = useState<string>("");

  useEffect(() => setEditing(!!editing), [editing, setEditing]);
  useEffect(
    () => setEdited(memories.find((memory) => memory.key == editing)?.content ?? ""),
    [editing, memories]
  );
  useEffect(() => editor.current?.focus({ cursor: "all" }), [editor, editing]);

  const updateEditing = useCallback(
    (content: string = "", newEditing?: string) => {
      if (editing) {
        let newMemories: Memory[];
        if (!content) {
          newMemories = memories.filter(({ key }) => key != editing);
        } else {
          newMemories = memories.map((memory) => {
            if (memory.key == editing) {
              return { ...memory, content };
            } else {
              return memory;
            }
          });
        }
        onChange(newMemories);
      }
      setRealEditing(newEditing);
      setEdited(memories.find((memory) => memory.key == newEditing)?.content ?? "");
    },
    [editing, memories, onChange]
  );

  const onKeyDown = useCallback<KeyboardEventHandler>(
    (e) => {
      if (e.key == "Escape" && !e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey) {
        updateEditing(memories.find((memory) => memory.key == editing)?.content ?? "");
      } else if (e.key == "Enter" && (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey)) {
        e.preventDefault();
        updateEditing(edited);
      }
    },
    [edited, editing, memories, updateEditing]
  );

  const sortedMemories = useMemo(
    () => memories.sort((a, b) => -compareDay(a.date, b.date)),
    [memories]
  );

  const dateMemories = useMemo(() => {
    let current: Day | undefined;
    const dateMemories: string[] = [];
    for (const { key, date } of sortedMemories) {
      if (!current || compareDay(current, date) != 0) {
        current = date;
        dateMemories.push(key);
      }
    }
    return dateMemories;
  }, [sortedMemories]);

  if (memories.length) {
    return (
      <table>
        <tbody>
          {sortedMemories.map(({ key, content, date }) => (
            <tr key={key}>
              <td className="border-r pr-8 pt-2 h-20 align-top">
                {dateMemories.includes(key) && (
                  <p className="text-stone-500 text-3xl font-serif text-right">{formatDay(date)}</p>
                )}
              </td>
              <td className="pl-8 pt-4 w-96 align-top">
                {editing == key ? (
                  <TextArea
                    ref={editor}
                    placeholder="Write anything you like"
                    allowClear={true}
                    autoSize={true}
                    value={edited}
                    onChange={(e) => setEdited(e.target.value)}
                    onClear={updateEditing}
                    onKeyDown={onKeyDown}
                    onBlur={() => updateEditing(edited)}
                  />
                ) : (
                  <TextArea
                    value={content}
                    variant="borderless"
                    autoSize={true}
                    onClick={() => updateEditing(content, key)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else {
    return <Empty description="No Memory" className="w-[33rem]" />;
  }
};

export default MemoList;
