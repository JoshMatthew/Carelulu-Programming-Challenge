import { useLoaderData } from "@remix-run/react";
import Tag from "./Tag";
import { Task } from "~/lib/types";
import { formatDateToCustomString } from "~/lib/helpers";

export const TaskTags = () => {
  const { task }: { task: Task } = useLoaderData();
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Tag className="uppercase">#{task.id}</Tag>
      <Tag className="uppercase">
        Created {formatDateToCustomString(task.createdAt, false)}
      </Tag>
      <Tag className="uppercase">
        Updated {formatDateToCustomString(task.updatedAt)}
      </Tag>
      <Tag
        className={`uppercase ${
          task.completed ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {task.completed ? "done" : "not done"}
      </Tag>
    </div>
  );
};
