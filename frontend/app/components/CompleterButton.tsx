import { redirect, useFetcher, useNavigate } from "@remix-run/react";
import { LoadingIcon } from "./LoadingIcon";
import { API_OPERATIONS } from "~/lib/constants";

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
        value={API_OPERATIONS.UPDATE_TASK_COMPLETION}
      />
      <input type="hidden" name="completed" value={Number(!completed)} />
      <input type="hidden" name="id" value={id} />

      <LoadingIcon
        fetcher={fetcher}
        icon={
          <button
            onClick={(event) => {
              event.stopPropagation();
            }}
            type="submit"
            className={`${
              completed
                ? "border-[#303030] bg-[#303030] hover:border-white active:bg-white"
                : "bg-white active:bg-[#303030]"
            } block aspect-square h-[1rem] rounded-full border-2 border-white hover:border-[#303030] lg:h-[1.2rem] xl:h-[1.6rem]`}
          />
        }
      />
    </fetcher.Form>
  );
}
