import { DeleteTaskMutation } from "~/lib/graphql";
import { GraphQLClient } from "graphql-request";

export async function deleteTaskHandler(
  formData: FormData,
  gqlClient: GraphQLClient
) {
  const id = formData.get("id");

  if (typeof id !== "string") {
    return new Response("Invalid ID", { status: 400 });
  }

  await gqlClient.request(DeleteTaskMutation, {
    deleteTaskId: Number(id),
  });

  return new Response("Operation Success", { status: 200 });
}
