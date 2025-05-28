import { UpdateTaskMutation } from "~/lib/graphql";
import { GraphQLClient } from "graphql-request";

export async function completeTaskHandler(
  formData: FormData,
  gqlClient: GraphQLClient
) {
  const completed = Boolean(Number(formData.get("completed")));
  const id = formData.get("id");

  if (typeof id !== "string") {
    return new Response("Invalid input", { status: 400 });
  }

  await gqlClient.request(UpdateTaskMutation, {
    data: { id, completed },
  });

  return new Response("Operation Success", { status: 200 });
}
