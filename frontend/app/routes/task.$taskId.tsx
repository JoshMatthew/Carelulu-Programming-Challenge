import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { useToggle } from "~/components/ToggleContentContext";
import { getAuthenticatedGqlClient } from "~/lib/graphql-client";
import { User } from "~/lib/types";
import { IoMdClose } from "react-icons/io";
import { authenticateUser } from "~/services/auth.server";
import { getTaskHandler } from "~/lib/task-operations-handlers";
import { UpdateTaskCompletionForm } from "~/components/TaskForms/UpdateTaskCompletionForm";
import { TaskEditProvider } from "~/components/TaskForms/TaskEditContext";
import TaskTitleInput from "~/components/TaskForms/TaskTitleInput";
import TaskDescriptionInput from "~/components/TaskForms/TaskDescriptionInput";
import TaskActionButtons from "~/components/TaskForms/TaskActionButtons";
import { TaskTags } from "~/components/TaskTags";

export const meta: MetaFunction = ({ data }: any) => {
  return [
    { title: `Task #${data.task?.id || 0} | CareLuLu Programming Challenge` },
    {
      property: "og:title",
      content: "Task creator challenge",
    },
    {
      name: "description",
      content:
        "This is an authorized route that shows details about a specific task.",
    },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { params, request } = args;
  let user: User = await authenticateUser(request);
  let _task = null;

  try {
    _task = await getTaskHandler(
      params.taskId || "-1",
      await getAuthenticatedGqlClient(user.token),
    );
  } catch (e) {
    console.log(`Error fetching task: ${params.taskId}: ` + e);
  }

  return {
    task: _task,
  };
};

export default function ContentArea() {
  const { task }: any = useLoaderData();
  const { taskId }: any = useParams();
  const { close } = useToggle();

  return (
    <TaskEditProvider>
      <div className={`relative rounded-md bg-[#fdfdfd] px-8 py-12 shadow-md`}>
        <button
          className="absolute right-4 top-4 hover:text-[#111] active:text-[#aaa]"
          onClick={close}
        >
          <IoMdClose className="text-[1.5rem] text-[#F15786] hover:text-[#F26897]" />
        </button>
        {task ? (
          <>
            <UpdateTaskCompletionForm />
            <TaskTitleInput />
            <TaskTags />
            <TaskDescriptionInput />
            <TaskActionButtons />
          </>
        ) : (
          <>
            <h2 className="text-center font-lexend text-[1.5rem] text-[#333]">
              Task #{taskId} deleted successfully
            </h2>
          </>
        )}
      </div>
    </TaskEditProvider>
  );
}
