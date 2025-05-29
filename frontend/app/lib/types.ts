export interface User {
  token: string;
  username: string;
  id: string;
  error?: string;
}

export interface Task {
  id: string;
  task_title: string;
  task_description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
