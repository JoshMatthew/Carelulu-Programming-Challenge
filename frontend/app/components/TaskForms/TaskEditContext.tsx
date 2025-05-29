import { useLoaderData } from "@remix-run/react";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { Task } from "~/lib/types";

interface TaskEditContextProps {
  titleValue: string;
  setTitleValue: React.Dispatch<React.SetStateAction<string>>;
  descValue: string;
  setDescValue: React.Dispatch<React.SetStateAction<string>>;
  shouldUpdate: boolean;
  setShouldUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  originalTitleRef: React.MutableRefObject<string>;
  originalDescriptionRef: React.MutableRefObject<string>;
}

const TaskEditContext = createContext<TaskEditContextProps | undefined>(
  undefined,
);

export const TaskEditProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { task }: { task: Task } = useLoaderData();
  const [titleValue, setTitleValue] = useState("");
  const [descValue, setDescValue] = useState("");
  const [shouldUpdate, setShouldUpdate] = useState(false);

  const originalTitleRef = useRef("");
  const originalDescriptionRef = useRef("");

  useEffect(() => {
    if (task) {
      setTitleValue(task.task_title);
      setDescValue(task.task_description || "");
      originalTitleRef.current = task.task_title;
      originalDescriptionRef.current = task.task_description || "";
    }
  }, [task]);

  return (
    <TaskEditContext.Provider
      value={{
        titleValue,
        setTitleValue,
        descValue,
        setDescValue,
        shouldUpdate,
        setShouldUpdate,
        originalTitleRef,
        originalDescriptionRef,
      }}
    >
      {children}
    </TaskEditContext.Provider>
  );
};

export const useTaskEditContext = () => {
  const context = useContext(TaskEditContext);
  if (!context) {
    throw new Error(
      "useTaskEditContext must be used within a TaskEditProvider",
    );
  }
  return context;
};
