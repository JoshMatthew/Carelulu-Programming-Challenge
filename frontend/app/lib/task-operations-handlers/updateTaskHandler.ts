import { UpdateTaskMutation } from "~/lib/graphql";
import { GraphQLClient } from "graphql-request";

export async function updateTaskHandler(
  formData: FormData,
  gqlClient: GraphQLClient
) {
  const title = formData.get("taskTitle");
  const description = formData.get("taskDescription");
  const id = formData.get("id");

  if (
    typeof title !== "string" ||
    title.trim() === "" ||
    typeof description !== "string" ||
    typeof id !== "string"
  ) {
    return new Response("Invalid input", { status: 400 });
  }

  await gqlClient.request(UpdateTaskMutation, {
    data: {
      id,
      taskTitle: title,
      taskDescription: description,
    },
  });

  return new Response("Operation Success", { status: 200 });
}
