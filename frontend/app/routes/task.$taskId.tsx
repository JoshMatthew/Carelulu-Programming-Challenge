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

  useEffect(() => {
    if (titleTxtAreaRef.current) {
      titleTxtAreaRef.current.style.height = "3.5rem";
      titleTxtAreaRef.current.style.height = `${titleTxtAreaRef.current.scrollHeight}px`;
    }
  }, [titleTxtAreaValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length > 60) {
      setTitleTxtAreaError("Title cannot exceed 60 characters.");
    } else {
      setTitleTxtAreaError("");
      setTitleAreaValue(newValue);
    }
  };

  const handleBlur = () => {
    if (titleTxtAreaValue.trim() === "") {
      setTitleTxtAreaError("Title cannot be empty.");
    }
    setTitleTxtAreaIsFocused(false);
  };

  const fetcher = useFetcher();

  useEffect(() => {
    if (task) {
      setTextAreaValue(task.task_description);
      setTitleAreaValue(task.task_title);
    }
  }, [task]);

  return (
    <>
      <div className={`bg-[#fdfdfd] shadow-md rounded-md py-12 px-8 relative`}>
        <button
          className="active:text-[#aaa] hover:text-[#111] absolute top-4 right-4"
          onClick={close}
        >
          <IoMdClose className="text-[#F15786] text-[1.5rem]" />
        </button>
        {task ? (
          <>
            <div>
              <textarea
                ref={titleTxtAreaRef}
                value={titleTxtAreaValue}
                onChange={handleChange}
                onFocus={() => setTitleTxtAreaIsFocused(true)}
                spellCheck={titleTxtAreaisFocused}
                onBlur={handleBlur}
                className="outline-none overflow-hidden text-[3.5rem] leading-tight tracking-tight text-[#008088] pb-4 font-lexend resize-none bg-[#fdfdfd]"
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
              onChange={(e) => {
                setTextAreaValue(e.target.value);
              }}
              onFocus={() => setDescTxtAreaIsFocused(true)}
              onBlur={() => setDescTxtAreaIsFocused(false)}
              spellCheck={descTxtAreaisFocused}
              placeholder="Task description"
              name="description"
            />
            <div className="flex gap-2 font-lexend text-[#5e5e5e] text-[0.8rem]">
              <fetcher.Form method="post" action="/task" preventScrollReset>
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
                  <IoIosSave className="text-[0.9rem]" />
                  Save changes
                </button>
              </fetcher.Form>
              -
              <fetcher.Form method="post" action="/task" preventScrollReset>
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
                  className="active:text-[#aaa] hover:text-[#111] flex items-center gap-1"
                >
                  {task.completed ? (
                    <>
                      <IoMdClose className="text-[0.9rem]" /> Mark as undone
                    </>
                  ) : (
                    <>
                      <MdOutlineDone className="text-[0.9rem]" /> Mark as done
                    </>
                  )}
                </button>
              </fetcher.Form>
              -
              <fetcher.Form method="post" action="/task" preventScrollReset>
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
                  <MdDeleteForever className="text-[0.9rem]" />
                  Delete Task
                </button>
              </fetcher.Form>
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
