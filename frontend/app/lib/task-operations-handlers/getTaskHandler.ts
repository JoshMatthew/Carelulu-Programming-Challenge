import { GraphQLClient } from "graphql-request";
import { GetTaskQuery } from "../graphql";
import { Task } from "../types";

export async function getTaskHandler(id: string, gqlClient: GraphQLClient) {
  const { task }: { task: Task } = await gqlClient.request(
    GetTaskQuery,
    {
      taskId: Number(id),
    },
    {
      "x-api-key": process.env.API_KEY || "",
    },
  );

  return task;
}
