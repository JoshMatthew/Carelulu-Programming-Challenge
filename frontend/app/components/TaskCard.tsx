import { formatDateToCustomString } from "~/lib/helpers";
import CompleterButton from "./CompleterButton";
import { NavLink } from "@remix-run/react";
import { ReactNode } from "react";
import Tag from "./Tag";
import { useToggle } from "./ToggleContentContext";

export default function TaskCard({
  title,
  createdAt,
  completed,
  id,
}: {
  title: string;
  completed: boolean;
  createdAt: string;
  id: string;
}) {
  const { isOn } = useToggle();

  return (
    <NavLink
      to={`/task/${id}#${id}`}
      id={id}
      className={({ isActive }) =>
        (isActive
          ? `border-2 border-[#0e4747]`
          : `hover:bg-[#35bbbb] border-2 border-transparent`) +
        ` ${completed ? "completed hover:bg-[#858585]" : "hover:bg-[#35bbbb]"} 
      bg-[#23aaaa] w-full hover:cursor-pointer rounded-md text-white p-4 px-6 flex flex-col items-start transition-all duration-500 ease-in-out md:max-w-[400px] w-full md:w-auto`
      }
    >
      <div className="flex gap-2 items-start">
        <CompleterButton completed={completed} id={id} />
        <h2
          className={`${
            completed ? "completed-main-title" : ""
          } font-lexend text-[0.89rem] @lg:text-[1rem] @xl:text-[1.4rem] uppercase font-bold`}
        >
          {title}
        </h2>
      </div>
      <div className="uppercase flex flex-wrap gap-2 mt-[1rem]">
        <Tag>created {formatDateToCustomString(createdAt, false)}</Tag>
        <Tag>#{id}</Tag>
        <Tag className={`${completed ? "bg-green-500" : "bg-red-500"}`}>
          {completed ? "done" : "not done"}
        </Tag>
      </div>
    </NavLink>
  );
}
