import React, { useState } from "react";
import { useTaskEditContext } from "./TaskEditContext";

const TaskDescriptionInput: React.FC = () => {
  const {
    descValue,
    setDescValue,
    titleValue,
    setShouldUpdate,
    originalTitleRef,
    originalDescriptionRef,
  } = useTaskEditContext();

  const [isDescFocused, setIsDescFocused] = useState(false);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newValue = e.target.value;
    setDescValue(newValue);
    setShouldUpdate(
      newValue !== originalDescriptionRef.current ||
        titleValue !== originalTitleRef.current,
    );
  };

  return (
    <textarea
      className="decription-textarea min-h-[150px] w-full resize-none rounded-md border-2 border-s-stone-50 bg-[#fefefe] px-4 py-2 font-lexend text-[0.89rem] text-[#111] outline-none"
      value={descValue}
      onChange={handleDescriptionChange}
      onFocus={() => setIsDescFocused(true)}
      onBlur={() => setIsDescFocused(false)}
      spellCheck={isDescFocused}
      placeholder="Task description"
      name="taskDescription"
    />
  );
};

export default TaskDescriptionInput;
