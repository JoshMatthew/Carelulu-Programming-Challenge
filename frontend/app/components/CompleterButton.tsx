import { redirect, useFetcher, useNavigate } from "@remix-run/react";
import { TaskOperations } from "~/lib/types";

export default function CompleterButton({
  completed,
  id,
}: {
  completed: boolean;
  id: string;
}) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" preventScrollReset className="mt-1">
      <input
        type="hidden"
        name="operation"
        value={TaskOperations.UPDATE_TASK_COMPLETION}
      />
      <input type="hidden" name="completed" value={Number(!completed)} />
      <input type="hidden" name="id" value={id} />
      <button
        onClick={(event) => {
          event.stopPropagation();
        }}
        type="submit"
        className={`${
          completed
            ? "bg-[#303030] border-[#303030] hover:border-white active:bg-white"
            : "bg-white active:bg-[#303030]"
        } border-2 border-white h-[1rem] @lg:h-[1.2rem] @xl:h-[1.6rem] aspect-square rounded-full block hover:border-[#303030]`}
      />
    </fetcher.Form>
  );
}
