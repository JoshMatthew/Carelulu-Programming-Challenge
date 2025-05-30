import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { LoadingIcon } from "./LoadingIcon";
import {
  API_OPERATIONS,
  FETCHER_STATE,
  FORM_NAME,
  FORM_METHOD,
  TASK_VALIDATION,
} from "~/lib/constants";

export default function NewTaskInputArea() {
  const newTaskFetcher = useFetcher();
  const deleteTaskFetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (newTaskFetcher.state === FETCHER_STATE.IDLE) {
      formRef.current?.reset();
    }
  }, [newTaskFetcher.state]);

  return (
    <div className="sticky bottom-0 flex w-full flex-col items-center justify-center bg-white p-4 md:w-auto">
      <newTaskFetcher.Form
        method={FORM_METHOD.POST}
        ref={formRef}
        preventScrollReset
        className="mx-auto flex w-full justify-center overflow-hidden border-2 border-[#4FBBBB] md:w-auto md:rounded-md"
      >
        <input
          type="hidden"
          name={FORM_NAME.OPERATION}
          value={API_OPERATIONS.CREATE_TASK}
        />
        <input
          name={FORM_NAME.TASK_TITLE}
          type="text"
          className="w-full border-none bg-[#ffffff] px-4 py-2 font-lexend text-black outline-none focus:border-none"
          placeholder="Add new task"
          maxLength={TASK_VALIDATION.TITLE_MAX_LENGTH}
        />
        <button
          type="submit"
          disabled={
            newTaskFetcher.state === FETCHER_STATE.SUBMITTING ||
            newTaskFetcher.state === FETCHER_STATE.LOADING
          }
          className="bg-white px-4 py-[0.1rem] text-[#4FBBBB] hover:bg-[#4FBBBB] hover:text-white"
        >
          <span className="text-[2rem] font-bold">
            <LoadingIcon
              fetcher={newTaskFetcher}
              icon={<MdFormatListBulletedAdd />}
            />
          </span>
        </button>
      </newTaskFetcher.Form>
      <deleteTaskFetcher.Form
        method={FORM_METHOD.POST}
        preventScrollReset
        className="bg-none font-lexend"
      >
        <input
          type="hidden"
          name={FORM_NAME.OPERATION}
          value={API_OPERATIONS.DELETE_ALL_COMPLETED}
        />
        <button
          type="submit"
          className="mt-4 flex items-center gap-4 rounded-md bg-red-300 px-4 py-2 text-[0.96rem] text-red-700 hover:bg-red-400"
        >
          Delete all completed task <LoadingIcon fetcher={deleteTaskFetcher} />
        </button>
      </deleteTaskFetcher.Form>
    </div>
  );
}
