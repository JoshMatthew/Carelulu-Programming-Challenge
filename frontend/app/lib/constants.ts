export const LOCAL_API = "localhost:3000";

export enum APP_ROUTES {
  HOME = "/",
  TASK = "/task",
}

export enum API_OPERATIONS {
  CREATE_TASK = "create-task",
  UPDATE_TASK_COMPLETION = "task-completion-update",
  UPDATE_TASK = "task-update",
  DELETE_TASK = "delete-task",
  DELETE_ALL_COMPLETED = "delete-all-completed",

  SIGN_IN = "sign-in",
  SIGN_UP = "sign-up",
}

export enum FORM_FIELD {
  USER_NAME = "email",
  PASSWORD = "password",
  COMPLETED = "completed",
  OPERATION = "operation",
}

export enum AUTHENTICATOR {
  SIGN_IN = "signin",
  SIGN_UP = "signup",
}

export enum SESSION {
  USER = "user",
  RETURN_TO = "returnTo",
}

export enum HTTP_HEADER {
  SET_COOKIE = "Set-Cookie",
}

export const SESSION_COOKIE = "cookie";
