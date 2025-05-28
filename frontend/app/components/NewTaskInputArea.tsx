import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { TaskOperations } from "~/lib/types";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";

export default function NewTaskInputArea() {
  const newTaskFetcher = useFetcher();
  const deleteTaskFetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (newTaskFetcher.state === "idle") {
      formRef.current?.reset();
    }
  }, [newTaskFetcher.state]);

  return (
    <div className="sticky bottom-0 flex justify-center flex-col items-center p-4 bg-white w-full md:w-auto">
      <newTaskFetcher.Form
        method="post"
        ref={formRef}
        preventScrollReset
        className="@md:rounded-md mx-auto border-2 border-[#4FBBBB] flex justify-center overflow-hidden w-full @md:w-auto"
      >
        <input
          type="hidden"
          name="operation"
          value={TaskOperations.CREATE_TASK}
        />
        <input
          name="taskTitle"
          type="text"
          className="bg-[#ffffff] text-black px-4 py-2 w-full outline-none focus:border-none border-none font-lexend"
          placeholder="Add new task"
        />
        <button
          type="submit"
          className="py-[0.1rem] px-4 hover:bg-[#4FBBBB] bg-white text-[#4FBBBB] hover:text-white"
        >
          <span className="text-[2rem] font-bold">
            {newTaskFetcher.state === "submitting" ? (
              <CgSpinner className="animate-spin" />
            ) : (
              <MdFormatListBulletedAdd />
            )}
          </span>
        </button>
      </newTaskFetcher.Form>
      <deleteTaskFetcher.Form
        method="post"
        preventScrollReset
        className="bg-none font-lexend"
      >
        <input
          type="hidden"
          name="operation"
          value={TaskOperations.DELETE_ALL_COMPLETED}
        />
        <button
          type="submit"
          className="py-2 text-[0.96rem] px-4 mt-4 text-red-700 hover:bg-red-400 bg-red-300 rounded-md flex items-center gap-4"
        >
          Delete all completed task{" "}
          {deleteTaskFetcher.state === "submitting" && (
            <CgSpinner className="animate-spin" />
          )}
        </button>
      </deleteTaskFetcher.Form>
    </div>
  );
}
