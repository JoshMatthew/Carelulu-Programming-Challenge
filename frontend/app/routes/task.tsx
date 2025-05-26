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
import { client } from "~/lib/graphql-client";

import { TaskOperations } from "~/lib/types";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async () => {
  const { allTask }: any = await client.request(GetAllTasksQuery);

  return {
    allTask,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const operation = formData.get("operation");
  const id = formData.get("id");

  try {
    switch (operation) {
      case TaskOperations.CREATE_TASK:
        const ct_taskTitle = formData.get("taskTitle");
        if (typeof ct_taskTitle !== "string" || !ct_taskTitle.trim()) {
          return new Response("Invalid task title", { status: 400 });
        }
        await client.request(CreateTaskMutation, {
          data: { taskTitle: ct_taskTitle },
        });
        return new Response("Operation Success", { status: 200 });

      case TaskOperations.UPDATE_TASK_COMPLETION:
        const utc_completed = formData.get("completed");
        const completedInBoolean = Boolean(Number(utc_completed));

        if (typeof id !== "string" || typeof completedInBoolean !== "boolean") {
          return new Response("Invalid input", { status: 400 });
        }

        await client.request(UpdateTaskMutation, {
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

        await client.request(UpdateTaskMutation, {
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

        await client.request(DeleteTaskMutation, {
          deleteTaskId: Number(id),
        });

        return new Response("Operation Success", { status: 200 });

      case TaskOperations.DELETE_ALL_COMPLETED:
        await client.request(DeleteAllCompletedMutation);

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
  const { isOn } = useToggle();

  return (
    <main
      className={`py-16 mx-auto items-start gap-4 flex relative ${
        isOn
          ? "items-start 2xl:max-w-[980px]"
          : "items-center 2xl:max-w-[1920px]"
      }`}
    >
      <MainArea />

      <div
        className={`sticky top-6 right-6 transition-all duration-500 ease-in-out ${
          isOn ? "w-[65vw]" : "w-0"
        }`}
      >
        <Outlet />
      </div>
    </main>
  );
}

function MainArea() {
  const data: any = useLoaderData();
  const { isOn } = useToggle();

  return (
    <div
      className={`flex flex-col items-center gap-8 @container transition-all duration-500 ease-in-out ${
        isOn ? "w-[35vw]" : "w-[100vw]"
      }`}
    >
      {data.allTask.length > 0 ? (
        <div className="flex flex-wrap gap-2 justify-center @md:px-6">
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
    </div>
  );
}
