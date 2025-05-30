import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import NewTaskInputArea from "~/components/NewTaskInputArea";
import { GetAllTasksQuery } from "~/lib/graphql";
import { getAuthenticatedGqlClient } from "~/lib/graphql-client";

import { Task, User } from "~/lib/types";
import { authenticateUser } from "~/services/auth.server";
import {
  completeTaskHandler,
  createTaskHandler,
  deleteTaskHandler,
  updateTaskHandler,
  deleteAllCompletedTaskHandler,
} from "~/lib/task-operations-handlers";
import { GraphQLClient } from "graphql-request";
import { TaskList } from "~/components/TaskList";
import { TaskDetail } from "~/components/TaskDetail";
import { API_OPERATIONS } from "~/lib/constants";

export const meta: MetaFunction<
  typeof loader,
  { "routes/task": TaskLoader }
> = ({ data }: { data: { user: User } }) => {
  return [
    {
      title: `${data.user.username || "User"} | CareLuLu Programming Challenge`,
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
    [API_OPERATIONS.CREATE_TASK]: createTaskHandler,
    [API_OPERATIONS.UPDATE_TASK_COMPLETION]: completeTaskHandler,
    [API_OPERATIONS.UPDATE_TASK]: updateTaskHandler,
    [API_OPERATIONS.DELETE_TASK]: deleteTaskHandler,
    [API_OPERATIONS.DELETE_ALL_COMPLETED]: deleteAllCompletedTaskHandler,
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
  return (
    <main
      className={`mx-auto flex w-full max-w-[1920px] flex-grow flex-col items-center justify-center gap-4 px-8 py-16`}
    >
      <TaskDetail />

      <TaskList />

      <NewTaskInputArea />
    </main>
  );
}
