import { useLoaderData } from "@remix-run/react";
import { Task } from "~/lib/types";
import TaskCard from "./TaskCard";

export const TaskList = () => {
  const data = useLoaderData<{ allTask: Task[] }>();

  return (
    <>
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
        <h2 className="font-lexend text-3xl font-bold text-gray-400 xl:text-6xl">
          No tasks yet...
        </h2>
      )}
    </>
  );
};
