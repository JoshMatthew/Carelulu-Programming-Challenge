import React, { useEffect, useRef, useState } from "react";
import { useTaskEditContext } from "./TaskEditContext";
import { FORM_NAME, TASK_VALIDATION } from "~/lib/constants";

const TaskTitleInput: React.FC = () => {
  const {
    titleValue,
    setTitleValue,
    descValue,
    setShouldUpdate,
    originalTitleRef,
    originalDescriptionRef,
  } = useTaskEditContext();

  const [titleError, setTitleError] = useState("");
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "3.5rem";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [titleValue]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length > TASK_VALIDATION.TITLE_MAX_LENGTH) {
      setTitleError(
        `Title cannot exceed ${TASK_VALIDATION.TITLE_MAX_LENGTH} characters.`,
      );
    } else {
      setTitleError("");
      setTitleValue(newValue);
      setShouldUpdate(
        newValue !== originalTitleRef.current ||
          descValue !== originalDescriptionRef.current,
      );
    }
  };

  const handleBlur = () => {
    if (titleValue.trim() === "") {
      setTitleError("Title cannot be empty.");
    }
  };

  return (
    <div className="py-2">
      <textarea
        ref={titleRef}
        value={titleValue}
        onChange={handleTitleChange}
        onBlur={handleBlur}
        className="resize-none overflow-hidden bg-[#fdfdfd] pb-4 font-lexend text-[2.2rem] leading-tight tracking-tight text-[#008088] outline-none md:text-[3.5rem]"
        placeholder="Enter task title"
        name={FORM_NAME.TASK_TITLE}
        maxLength={TASK_VALIDATION.TITLE_MAX_LENGTH}
      />
      {titleError && (
        <p className="-mt-[1rem] mb-[1rem] font-lexend text-sm text-red-500">
          {titleError}
        </p>
      )}
    </div>
  );
};

export default TaskTitleInput;
