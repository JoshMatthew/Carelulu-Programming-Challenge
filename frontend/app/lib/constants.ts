export const LOCAL_API = "localhost:3000";

export enum APP_ROUTES {
  HOME = "/",
  TASK = "/task",
  LOGOUT = "/logout",
}

export enum TASK_VALIDATION {
  TITLE_MAX_LENGTH = 45,
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

export enum FORM_NAME {
  USER_NAME = "email",
  PASSWORD = "password",
  COMPLETED = "completed",
  OPERATION = "operation",
  ID = "id",
  TASK_TITLE = "taskTitle",
  TASK_DESCRIPTION = "taskDescription",
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

export enum FETCHER_STATE {
  IDLE = "idle",
  LOADING = "loading",
  SUBMITTING = "submitting",
}

export enum FORM_METHOD {
  POST = "post",
  GET = "get",
}

export const SESSION_COOKIE = "cookie";
