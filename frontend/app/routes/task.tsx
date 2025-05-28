import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import NewTaskInputArea from "~/components/NewTaskInputArea";
import TaskCard from "~/components/TaskCard";
import { useToggle } from "~/components/ToggleContentContext";
import {
  CreateTaskMutation,
  DeleteAllCompletedMutation,
  DeleteTaskMutation,
  GetAllTasksQuery,
  UpdateTaskMutation,
} from "~/lib/graphql";
import { createAuthenticatedGqlClient, gqlClient } from "~/lib/graphql-client";

import { TaskOperations } from "~/lib/types";
import { authenticateUser, logoutUser } from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async (args) => {
  let user = await authenticateUser(args.request);

  const { allTask }: any = await createAuthenticatedGqlClient(
    user.token
  ).request(GetAllTasksQuery);

  return {
    allTask,
  };
};

export const action: ActionFunction = async ({ request }) => {
  let user = await authenticateUser(request);
  const formData = await request.formData();
  const operation = formData.get("operation");
  const id = formData.get("id");
  const authenticatedGqlClient = createAuthenticatedGqlClient(user.token);

  try {
    switch (operation) {
      case TaskOperations.CREATE_TASK:
        const ct_taskTitle = formData.get("taskTitle");
        if (typeof ct_taskTitle !== "string" || !ct_taskTitle.trim()) {
          return new Response("Invalid task title", { status: 400 });
        }
        await authenticatedGqlClient.request(CreateTaskMutation, {
          data: { taskTitle: ct_taskTitle },
        });
        return new Response("Operation Success", { status: 200 });

      case TaskOperations.UPDATE_TASK_COMPLETION:
        const utc_completed = formData.get("completed");
        const completedInBoolean = Boolean(Number(utc_completed));

        if (typeof id !== "string" || typeof completedInBoolean !== "boolean") {
          return new Response("Invalid input", { status: 400 });
        }

        await authenticatedGqlClient.request(UpdateTaskMutation, {
          data: { id, completed: completedInBoolean },
        });

        return new Response("Operation Success", { status: 200 });

      case TaskOperations.UPDATE_TASK:
        const ut_taskTitle = formData.get("taskTitle");
        const ut_taskDescription = formData.get("taskDescription");

        if (
          typeof ut_taskTitle !== "string" ||
          ut_taskTitle.trim() === "" ||
          typeof ut_taskDescription !== "string" ||
          typeof id !== "string"
        ) {
          return new Response("Invalid input", { status: 400 });
        }

        await authenticatedGqlClient.request(UpdateTaskMutation, {
          data: {
            id,
            taskTitle: ut_taskTitle,
            taskDescription: ut_taskDescription,
          },
        });

        return new Response("Operation Success", { status: 200 });

      case TaskOperations.DELETE_TASK:
        if (typeof id !== "string") {
          return new Response("Invalid ID", { status: 400 });
        }

        await authenticatedGqlClient.request(DeleteTaskMutation, {
          deleteTaskId: Number(id),
        });

        return new Response("Operation Success", { status: 200 });

      case TaskOperations.DELETE_ALL_COMPLETED:
        await authenticatedGqlClient.request(DeleteAllCompletedMutation);

        return new Response("Operation Success", { status: 200 });

      default:
        return new Response("Invalid operation", { status: 400 });
    }
  } catch (error) {
    console.error("GraphQL mutation error:", error);
    return new Response("Failed to perform operation", { status: 500 });
  }
};

export default function Tasks() {
  const data: any = useLoaderData();
  const { isOn } = useToggle();

  return (
    <main
      className={`py-16 mx-auto gap-4 flex flex-col items-center justify-center w-full max-w-[1920px] px-8`}
    >
      {isOn && (
        <div className="fixed top-0 left-0 bg-[#11111160] w-full h-full z-[9999] flex justify-center items-center fade-in">
          <div
            className={`transition-all duration-500 ease-in-out max-w-full mt-auto md:mt-0`}
          >
            <Outlet />
          </div>
        </div>
      )}

      {data.allTask.length > 0 ? (
        <div className={`flex flex-wrap gap-2 justify-center w-auto`}>
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
        <h2 className="text-[2rem] font-lexend font-bold text-gray-400">
          No tasks yet...
        </h2>
      )}
      <NewTaskInputArea />
    </main>
  );
}
