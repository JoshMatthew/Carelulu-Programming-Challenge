export type TaskInput = {
  taskTitle: string;
  taskDescription?: string;
};

export type UpdateTaskArgs = {
  id: number;
  taskTitle?: string;
  taskDescription?: string;
  completed?: boolean;
};

export type TaskUpdateInput = {
  task_title?: string;
  task_description?: string;
  completed?: boolean;
};
