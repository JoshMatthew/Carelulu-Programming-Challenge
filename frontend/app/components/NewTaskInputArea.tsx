import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { TaskOperations } from "~/lib/types";
import { MdFormatListBulletedAdd } from "react-icons/md";

export default function NewTaskInputArea() {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fetcher.state === "idle") {
      formRef.current?.reset();
    }
  }, [fetcher.state]);

  return (
    <div className="sticky bottom-0 flex justify-center flex-col items-center bg-white py-4">
      <fetcher.Form
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
            <MdFormatListBulletedAdd />
          </span>
        </button>
      </fetcher.Form>
      <fetcher.Form
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
          className="py-2 text-[0.96rem] px-4 mt-4 text-red-700 hover:bg-red-400 bg-red-300 rounded-md"
        >
          Delete all completed task
        </button>
      </fetcher.Form>
    </div>
  );
}
