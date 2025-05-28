import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData, useParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import Tag from "~/components/Tag";
import { useToggle } from "~/components/ToggleContentContext";
import { GetTaskQuery } from "~/lib/graphql";
import { getAuthenticatedGqlClient } from "~/lib/graphql-client";
import { formatDateToCustomString } from "~/lib/helpers";
import { TaskOperations } from "~/lib/types";
import { IoMdClose } from "react-icons/io";
import { IoIosSave } from "react-icons/io";
import { MdOutlineDone } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { authenticateUser } from "~/services/auth.server";
import { CgSpinner } from "react-icons/cg";

export const meta: MetaFunction = ({ data }: any) => {
  return [
    { title: `Task #${data.task.id || 0} | CareLuLu Programming Challenge` },
    {
      property: "og:title",
      content: "Task creator challenge",
    },
    {
      name: "description",
      content:
        "This is an authorized route that shows details about a specific task.",
    },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { params, request } = args;
  let user = await authenticateUser(request);
  let _task = null;

  try {
    const { task }: any = await getAuthenticatedGqlClient(user.token).request(
      GetTaskQuery,
      {
        taskId: Number(params.taskId),
      },
    );

    _task = task;
  } catch (e) {
    console.log(`Error fetching task: ${params.taskId}: ` + e);
  }

  return {
    task: _task,
  };
};

export default function ContentArea() {
  const { task }: any = useLoaderData();
  const { taskId }: any = useParams();
  const { close } = useToggle();

  const [descTxtAreaisFocused, setDescTxtAreaIsFocused] = useState(false);
  const descTxtAreaRef = useRef<HTMLTextAreaElement>(null);
  const [descTxtAreaValue, setTextAreaValue] = useState("");

  const [titleTxtAreaisFocused, setTitleTxtAreaIsFocused] = useState(false);
  const titleTxtAreaRef = useRef<HTMLTextAreaElement>(null);
  const [titleTxtAreaValue, setTitleAreaValue] = useState("");
  const [titleTxtAreaError, setTitleTxtAreaError] = useState("");

  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [shouldShowUpdateButton, setShouldShowUpdateButton] = useState(false);

  const originalTitleRef = useRef("");
  const originalDescriptionRef = useRef("");

  useEffect(() => {
    if (titleTxtAreaRef.current) {
      titleTxtAreaRef.current.style.height = "3.5rem";
      titleTxtAreaRef.current.style.height = `${titleTxtAreaRef.current.scrollHeight}px`;
    }
  }, [titleTxtAreaValue]);

  useEffect(() => {
    if (shouldUpdate) {
      setShouldShowUpdateButton(true);
    }
  }, [shouldUpdate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length > 60) {
      setTitleTxtAreaError("Title cannot exceed 60 characters.");
    } else {
      setTitleTxtAreaError("");
      setTitleAreaValue(newValue);
      setShouldUpdate(
        newValue !== originalTitleRef.current ||
          descTxtAreaValue !== originalDescriptionRef.current,
      );
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newValue = e.target.value;
    setTextAreaValue(newValue);
    setShouldUpdate(
      newValue !== originalDescriptionRef.current ||
        titleTxtAreaValue !== originalTitleRef.current,
    );
  };

  const handleBlur = () => {
    if (titleTxtAreaValue.trim() === "") {
      setTitleTxtAreaError("Title cannot be empty.");
    }
    setTitleTxtAreaIsFocused(false);
  };

  const taskCompleteFetcher = useFetcher();
  const taskDeleteFetcher = useFetcher();
  const taskUpdateFetcher = useFetcher();

  useEffect(() => {
    if (task) {
      setTextAreaValue(task.task_description);
      setTitleAreaValue(task.task_title);
      originalTitleRef.current = task.task_title;
      originalDescriptionRef.current = task.task_description;
    }
  }, [task]);

  useEffect(() => {
    if (taskUpdateFetcher.state === "idle" && shouldUpdate) {
      originalTitleRef.current = titleTxtAreaValue;
      originalDescriptionRef.current = descTxtAreaValue;
      setShouldUpdate(false);
    }
  }, [taskUpdateFetcher.state]);

  return (
    <>
      <div className={`relative rounded-md bg-[#fdfdfd] px-8 py-12 shadow-md`}>
        <button
          className="absolute right-4 top-4 hover:text-[#111] active:text-[#aaa]"
          onClick={close}
        >
          <IoMdClose className="text-[1.5rem] text-[#F15786] hover:text-[#F26897]" />
        </button>
        {task ? (
          <>
            <taskCompleteFetcher.Form
              method="post"
              action="/task"
              preventScrollReset
              className="lef-4 absolute top-4"
            >
              <input
                type="hidden"
                name="operation"
                value={TaskOperations.UPDATE_TASK_COMPLETION}
              />
              <input
                type="hidden"
                name="completed"
                value={Number(!task.completed)}
              />
              <input type="hidden" name="id" value={task.id} />
              <button
                type="submit"
                className={`border-color-[#555] hover:border-color-green-800 flex items-center gap-1 rounded-sm border-[1px] px-2 py-1 text-[#555] hover:bg-green-200 hover:text-green-500 active:text-green-400 ${
                  task.completed && "bg-green-300 text-green-600"
                }`}
              >
                {taskCompleteFetcher.state === "submitting" ? (
                  <CgSpinner className="animate-spin text-[0.9rem]" />
                ) : (
                  <MdOutlineDone className="text-[0.9rem]" />
                )}

                {task.completed ? "Completed" : "Mark complete"}
              </button>
            </taskCompleteFetcher.Form>
            <div className="py-2">
              <textarea
                ref={titleTxtAreaRef}
                value={titleTxtAreaValue}
                onChange={handleTitleChange}
                onFocus={() => setTitleTxtAreaIsFocused(true)}
                spellCheck={titleTxtAreaisFocused}
                onBlur={handleBlur}
                className="resize-none overflow-hidden bg-[#fdfdfd] pb-4 font-lexend text-[2.2rem] leading-tight tracking-tight text-[#008088] outline-none md:text-[3.5rem]"
                placeholder="Enter task title"
                name="description"
                maxLength={60}
              />
              {titleTxtAreaError && (
                <p className="-mt-[1rem] mb-[1rem] font-lexend text-sm text-red-500">
                  {titleTxtAreaError}
                </p>
              )}
            </div>
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
            <textarea
              ref={descTxtAreaRef}
              className="decription-textarea min-h-[150px] w-full resize-none rounded-md border-2 border-s-stone-50 bg-[#fefefe] px-4 py-2 font-lexend text-[0.89rem] text-[#111] outline-none"
              value={descTxtAreaValue}
              onChange={handleDescriptionChange}
              onFocus={() => setDescTxtAreaIsFocused(true)}
              onBlur={() => setDescTxtAreaIsFocused(false)}
              spellCheck={descTxtAreaisFocused}
              placeholder="Task description"
              name="description"
            />
            <div className="flex gap-4 font-lexend text-[0.8rem] text-[#5e5e5e]">
              <taskDeleteFetcher.Form
                method="post"
                action="/task"
                preventScrollReset
              >
                <input
                  type="hidden"
                  name="operation"
                  value={TaskOperations.DELETE_TASK}
                />
                <input type="hidden" name="id" value={task.id} />
                <button
                  type="submit"
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 active:text-[#aaa]"
                >
                  {taskDeleteFetcher.state === "submitting" ? (
                    <CgSpinner className="animate-spin text-[0.9rem]" />
                  ) : (
                    <MdDeleteForever className="text-[0.9rem]" />
                  )}
                  Delete Task
                </button>
              </taskDeleteFetcher.Form>

              {shouldShowUpdateButton && (
                <taskUpdateFetcher.Form
                  method="post"
                  action="/task"
                  preventScrollReset
                >
                  <input
                    type="hidden"
                    name="operation"
                    value={TaskOperations.UPDATE_TASK}
                  />
                  <input type="hidden" name="id" value={task.id} />
                  <input
                    type="hidden"
                    name="taskTitle"
                    value={titleTxtAreaValue}
                  />
                  <input
                    type="hidden"
                    name="taskDescription"
                    value={descTxtAreaValue}
                  />
                  <button type="submit" className="flex items-center gap-1">
                    {taskUpdateFetcher.state === "submitting" ? (
                      <CgSpinner className="animate-spin text-[0.9rem]" />
                    ) : (
                      <IoIosSave className="text-[0.9rem]" />
                    )}
                    {(taskUpdateFetcher.state === "idle" &&
                      !shouldUpdate &&
                      "Changes saved!") ||
                      "Save changes"}
                  </button>
                </taskUpdateFetcher.Form>
              )}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-center font-lexend text-[1.5rem] text-[#333]">
              Task #{taskId} deleted successfully
            </h2>
          </>
        )}
      </div>
    </>
  );
}
