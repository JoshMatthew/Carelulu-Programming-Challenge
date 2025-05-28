import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import NewTaskInputArea from "~/components/NewTaskInputArea";
import TaskCard from "~/components/TaskCard";
import { useToggle } from "~/components/ToggleContentContext";
import { GetAllTasksQuery } from "~/lib/graphql";
import { getAuthenticatedGqlClient } from "~/lib/graphql-client";

import { Task, TaskOperations, User } from "~/lib/types";
import { authenticateUser } from "~/services/auth.server";
import {
  completeTaskHandler,
  createTaskHandler,
  deleteTaskHandler,
  updateTaskHandler,
  deleteAllCompletedTaskHandler,
} from "~/lib/task-operations-handlers";
import { GraphQLClient } from "graphql-request";

export const meta: MetaFunction<
  typeof loader,
  { "routes/task": TaskLoader }
> = ({ data }: { data: { user: User } }) => {
  return [
    {
      title: `${
        data.user.username || "User"
      }'s Tasks | CareLuLu Programming Challenge`,
    },
    {
      property: "og:title",
      content: "Task creator challenge",
    },
    {
      name: "description",
      content:
        "This is an authorized route that showcases the tasks for a specific user.",
    },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const user: User = await authenticateUser(args.request);

  const { allTask }: { allTask: Task[] } = await getAuthenticatedGqlClient(
    user.token,
  ).request(GetAllTasksQuery);

  return {
    user,
    allTask,
  };
};

type TaskLoader = typeof loader;

export const action: ActionFunction = async ({ request }) => {
  const user: User = await authenticateUser(request);

  const formData = await request.formData();
  const operation = formData.get("operation");
  const authenticatedGqlClient = getAuthenticatedGqlClient(user.token);

  const handlers: Record<
    string,
    (formData: FormData, gqlClient: GraphQLClient) => Promise<Response>
  > = {
    [TaskOperations.CREATE_TASK]: createTaskHandler,
    [TaskOperations.UPDATE_TASK_COMPLETION]: completeTaskHandler,
    [TaskOperations.UPDATE_TASK]: updateTaskHandler,
    [TaskOperations.DELETE_TASK]: deleteTaskHandler,
    [TaskOperations.DELETE_ALL_COMPLETED]: deleteAllCompletedTaskHandler,
  };

  const handler = handlers[operation as string];
  if (!handler) {
    return new Response("Invalid operation", { status: 400 });
  }

  try {
    return await handler(formData, authenticatedGqlClient);
  } catch (error) {
    console.error("Operation error:", error);
    return new Response("Failed to perform operation", { status: 500 });
  }
};

export default function Tasks() {
  const data = useLoaderData<{ allTask: Task[] }>();
  const { isOn } = useToggle();

  return (
    <main
      className={`mx-auto flex w-full max-w-[1920px] flex-col items-center justify-center gap-4 px-8 py-16`}
    >
      {isOn && (
        <div className="fade-in fixed left-0 top-0 z-[9999] flex h-full w-full items-center justify-center bg-[#11111160]">
          <div
            className={`mt-auto max-w-full transition-all duration-500 ease-in-out md:mt-0`}
          >
            <Outlet />
          </div>
        </div>
      )}

      {data.allTask.length > 0 ? (
        <div className={`flex w-auto flex-wrap justify-center gap-2`}>
          {data.allTask.map((task: any) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.task_title}
              completed={task.completed}
              createdAt={task.createdAt}
            />
          ))}
        </div>
      ) : (
        <h2 className="font-lexend text-[4rem] font-bold text-gray-400">
          No tasks yet...
        </h2>
      )}
      <NewTaskInputArea />
    </main>
  );
}
