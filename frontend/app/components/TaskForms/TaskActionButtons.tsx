import React, { useEffect } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useTaskEditContext } from "./TaskEditContext";
import { Task, TaskOperations } from "~/lib/types";
import { IoIosSave } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { LoadingIcon } from "../LoadingIcon";
import { APP_ROUTES } from "~/lib/constants";

const TaskActionButtons: React.FC = () => {
  const { task }: { task: Task } = useLoaderData();
  const {
    titleValue,
    descValue,
    shouldUpdate,
    setShouldUpdate,
    originalTitleRef,
    originalDescriptionRef,
  } = useTaskEditContext();

  const taskUpdateFetcher = useFetcher();
  const taskDeleteFetcher = useFetcher();

  useEffect(() => {
    if (taskUpdateFetcher.state === "idle" && shouldUpdate) {
      originalTitleRef.current = titleValue;
      originalDescriptionRef.current = descValue;
      setShouldUpdate(false);
    }
  }, [taskUpdateFetcher.state]);

  return (
    <div className="flex gap-4 font-lexend text-[0.8rem] text-[#5e5e5e]">
      <taskDeleteFetcher.Form
        method="post"
        action={APP_ROUTES.TASK}
        preventScrollReset
      >
        <input
          type="hidden"
          name="operation"
          value={TaskOperations.DELETE_TASK}
        />
        <input type="hidden" name="id" value={task.id} />
        <button
          type="submit"
          className="flex items-center gap-1 text-red-600 hover:text-red-700 active:text-[#aaa]"
        >
          <LoadingIcon
            fetcher={taskDeleteFetcher}
            icon={<MdDeleteForever />}
            className="text-[0.9rem]"
          />
          Delete Task
        </button>
      </taskDeleteFetcher.Form>

      {shouldUpdate && (
        <taskUpdateFetcher.Form
          method="post"
          action={APP_ROUTES.TASK}
          preventScrollReset
        >
          <input
            type="hidden"
            name="operation"
            value={TaskOperations.UPDATE_TASK}
          />
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="taskTitle" value={titleValue} />
          <input type="hidden" name="taskDescription" value={descValue} />
          <button type="submit" className="flex items-center gap-1">
            <LoadingIcon
              fetcher={taskUpdateFetcher}
              icon={<IoIosSave />}
              className="text-[0.9rem]"
            />
            {taskUpdateFetcher.state === "idle" && !shouldUpdate
              ? "Changes saved!"
              : "Save changes"}
          </button>
        </taskUpdateFetcher.Form>
      )}
    </div>
  );
};

export default TaskActionButtons;
