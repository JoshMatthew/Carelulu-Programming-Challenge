export enum TaskOperations {
  CREATE_TASK = "create-task",
  UPDATE_TASK_COMPLETION = "task-completion-update",
  UPDATE_TASK = "task-update",
  DELETE_TASK = "delete-task",
  DELETE_ALL_COMPLETED = "delete-all-completed",

  SIGN_IN = "sign-in",
  SIGN_UP = "sign-up",
}

export interface User {
  token: string;
  username: string;
  id: string;
}

export interface Task {
  id: string;
  task_title: string;
  task_description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
