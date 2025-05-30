import { formatDateToCustomString } from "~/lib/helpers";
import CompleterButton from "./CompleterButton";
import { NavLink } from "@remix-run/react";
import Tag from "./Tag";
import { APP_ROUTES } from "~/lib/constants";

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
  return (
    <NavLink
      to={`${APP_ROUTES.TASK}/${id}`}
      id={id}
      className={({ isActive }) =>
        (isActive
          ? `border-2 border-[#0e4747]`
          : `border-2 border-transparent hover:bg-[#35bbbb]`) +
        ` ${completed ? "completed hover:bg-[#858585]" : "hover:bg-[#35bbbb]"} flex w-full flex-col items-start overflow-hidden rounded-md bg-[#23aaaa] p-4 px-6 text-white transition-all duration-500 ease-in-out hover:cursor-pointer md:w-auto md:max-w-[400px]`
      }
    >
      <div className="flex items-start gap-2">
        <CompleterButton completed={completed} id={id} />
        <h2
          className={`${
            completed ? "completed-main-title" : ""
          } font-lexend text-[0.89rem] font-bold uppercase @lg:text-[1rem] @xl:text-[1.4rem]`}
        >
          {title}
        </h2>
      </div>
      <div className="mt-[1rem] flex flex-wrap gap-2 uppercase">
        <Tag>created {formatDateToCustomString(createdAt, false)}</Tag>
        <Tag>#{id}</Tag>
        <Tag className={`${completed ? "bg-green-500" : "bg-red-500"}`}>
          {completed ? "done" : "not done"}
        </Tag>
      </div>
    </NavLink>
  );
}
