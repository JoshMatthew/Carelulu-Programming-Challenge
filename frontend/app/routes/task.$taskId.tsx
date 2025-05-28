import { LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData, useParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import Tag from "~/components/Tag";
import { useToggle } from "~/components/ToggleContentContext";
import { GetTaskQuery } from "~/lib/graphql";
import { createAuthenticatedGqlClient } from "~/lib/graphql-client";
import { formatDateToCustomString } from "~/lib/helpers";
import { TaskOperations } from "~/lib/types";
import { IoMdClose } from "react-icons/io";
import { IoIosSave } from "react-icons/io";
import { MdOutlineDone } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { authenticateUser } from "~/services/auth.server";
import { CgSpinner } from "react-icons/cg";

export const loader: LoaderFunction = async (args) => {
  const { params, request } = args;
  let user = await authenticateUser(request);
  let _task = null;

  try {
    const { task }: any = await createAuthenticatedGqlClient(
      user.token
    ).request(GetTaskQuery, {
      taskId: Number(params.taskId),
    });

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
          descTxtAreaValue !== originalDescriptionRef.current
      );
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    setTextAreaValue(newValue);
    setShouldUpdate(
      newValue !== originalDescriptionRef.current ||
        titleTxtAreaValue !== originalTitleRef.current
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
      <div className={`bg-[#fdfdfd] shadow-md rounded-md py-12 px-8 relative`}>
        <button
          className="active:text-[#aaa] hover:text-[#111] absolute top-4 right-4"
          onClick={close}
        >
          <IoMdClose className="text-[#F15786] hover:text-[#F26897] text-[1.5rem]" />
        </button>
        {task ? (
          <>
            <taskCompleteFetcher.Form
              method="post"
              action="/task"
              preventScrollReset
              className="absolute top-4 lef-4"
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
                className={`active:text-green-400 hover:text-green-500 hover:bg-green-200 flex items-center gap-1 border-[1px] border-color-[#555] hover:border-color-green-800 px-2 py-1 rounded-sm text-[#555] ${
                  task.completed && "bg-green-300 text-green-600"
                }`}
              >
                {taskCompleteFetcher.state === "submitting" ? (
                  <CgSpinner className="text-[0.9rem] animate-spin" />
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
                className="outline-none overflow-hidden text-[2.2rem] md:text-[3.5rem] leading-tight tracking-tight text-[#008088] pb-4 font-lexend resize-none bg-[#fdfdfd]"
                placeholder="Enter task title"
                name="description"
                maxLength={60}
              />
              {titleTxtAreaError && (
                <p className="text-red-500 text-sm font-lexend -mt-[1rem] mb-[1rem]">
                  {titleTxtAreaError}
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap mb-4">
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
              className="decription-textarea w-full bg-[#fefefe] rounded-md border-2 border-s-stone-50 py-2 px-4 text-[#111] font-lexend outline-none min-h-[150px] resize-none text-[0.89rem]"
              value={descTxtAreaValue}
              onChange={handleDescriptionChange}
              onFocus={() => setDescTxtAreaIsFocused(true)}
              onBlur={() => setDescTxtAreaIsFocused(false)}
              spellCheck={descTxtAreaisFocused}
              placeholder="Task description"
              name="description"
            />
            <div className="flex gap-4 font-lexend text-[#5e5e5e] text-[0.8rem]">
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
                  className="active:text-[#aaa] text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  {taskDeleteFetcher.state === "submitting" ? (
                    <CgSpinner className="text-[0.9rem] animate-spin" />
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
                      <CgSpinner className="text-[0.9rem] animate-spin" />
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
            <h2 className="font-lexend text-center text-[1.5rem] text-[#333]">
              Task #{taskId} deleted successfully
            </h2>
          </>
        )}
      </div>
    </>
  );
}
