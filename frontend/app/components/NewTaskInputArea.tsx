import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { TaskOperations } from "~/lib/types";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";
import { LoadingIcon } from "./LoadingIcon";

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
    <div className="sticky bottom-0 flex w-full flex-col items-center justify-center bg-white p-4 md:w-auto">
      <newTaskFetcher.Form
        method="post"
        ref={formRef}
        preventScrollReset
        className="mx-auto flex w-full justify-center overflow-hidden border-2 border-[#4FBBBB] @md:w-auto @md:rounded-md"
      >
        <input
          type="hidden"
          name="operation"
          value={TaskOperations.CREATE_TASK}
        />
        <input
          name="taskTitle"
          type="text"
          className="w-full border-none bg-[#ffffff] px-4 py-2 font-lexend text-black outline-none focus:border-none"
          placeholder="Add new task"
        />
        <button
          type="submit"
          disabled={
            newTaskFetcher.state === "submitting" ||
            newTaskFetcher.state === "loading"
          }
          className="bg-white px-4 py-[0.1rem] text-[#4FBBBB] hover:bg-[#4FBBBB] hover:text-white"
        >
          <span className="text-[2rem] font-bold">
            <LoadingIcon
              fetcher={newTaskFetcher}
              icon={<MdFormatListBulletedAdd />}
            />
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
          className="mt-4 flex items-center gap-4 rounded-md bg-red-300 px-4 py-2 text-[0.96rem] text-red-700 hover:bg-red-400"
        >
          Delete all completed task <LoadingIcon fetcher={deleteTaskFetcher} />
        </button>
      </deleteTaskFetcher.Form>
    </div>
  );
}
