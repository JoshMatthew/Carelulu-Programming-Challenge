import { useFetcher, useLoaderData } from "@remix-run/react";
import { CgSpinner } from "react-icons/cg";
import { MdOutlineDone } from "react-icons/md";
import { Task, TaskOperations } from "~/lib/types";

export const UpdateTaskCompletionForm = () => {
  const { task }: { task: Task } = useLoaderData();
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      method="post"
      action="/task"
      preventScrollReset
      className="lef-4 absolute top-4"
    >
      <input
        type="hidden"
        name="operation"
        value={TaskOperations.UPDATE_TASK_COMPLETION}
      />
      <input type="hidden" name="completed" value={Number(!task.completed)} />
      <input type="hidden" name="id" value={task.id} />
      <button
        type="submit"
        className={`border-color-[#555] hover:border-color-green-800 flex items-center gap-1 rounded-sm border-[1px] px-2 py-1 text-[#555] hover:bg-green-200 hover:text-green-500 active:text-green-400 ${
          task.completed && "bg-green-300 text-green-600"
        }`}
      >
        {fetcher.state === "submitting" ? (
          <CgSpinner className="animate-spin text-[0.9rem]" />
        ) : (
          <MdOutlineDone className="text-[0.9rem]" />
        )}

        {task.completed ? "Completed" : "Mark complete"}
      </button>
    </fetcher.Form>
  );
};
