import { CreateTaskMutation } from "~/lib/graphql";
import { GraphQLClient } from "graphql-request";

export async function createTaskHandler(
  formData: FormData,
  gqlClient: GraphQLClient
) {
  const title = formData.get("taskTitle");
  if (typeof title !== "string" || !title.trim()) {
    return new Response("Invalid task title", { status: 400 });
  }
  await gqlClient.request(CreateTaskMutation, {
    data: { taskTitle: title },
  });
  return new Response("Operation Success", { status: 200 });
}
