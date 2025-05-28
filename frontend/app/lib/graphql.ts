import { gql } from "graphql-request";

export const GetAllTasksQuery = gql`
  {
    allTask {
      id
      task_title
      task_description
      completed
      createdAt
      updatedAt
    }
  }
`;

export const GetTaskQuery = gql`
  query Task($taskId: Int!) {
    task(id: $taskId) {
      id
      task_title
      task_description
      completed
      createdAt
      updatedAt
    }
  }
`;

export const CreateTaskMutation = gql`
  mutation CreateTask($data: CreateTaskInput!) {
    createTask(data: $data) {
      task_title
    }
  }
`;

export const UpdateTaskMutation = gql`
  mutation UpdateTask($data: UpdateTaskInput!) {
    updateTask(data: $data) {
      id
    }
  }
`;

export const DeleteTaskMutation = gql`
  mutation DeleteTask($deleteTaskId: Int!) {
    deleteTask(id: $deleteTaskId) {
      id
    }
  }
`;

export const DeleteAllCompletedMutation = gql`
  mutation DeleteAllCompleted {
    deleteAllCompleted
  }
`;

export const SigninUserMutation = gql`
  mutation Signin($data: SigninUserInput!) {
    signIn(data: $data) {
      token
      user {
        user_name
        id
      }
    }
  }
`;

export const SignupUserMutation = gql`
  mutation Signup($data: SignupUserInput!) {
    signUp(data: $data) {
      token
      user {
        user_name
        id
      }
    }
  }
`;
