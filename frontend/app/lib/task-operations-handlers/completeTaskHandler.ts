import { UpdateTaskMutation } from "~/lib/graphql";
import { GraphQLClient } from "graphql-request";
import { FORM_NAME } from "../constants";

export async function completeTaskHandler(
  formData: FormData,
  gqlClient: GraphQLClient,
) {
  const completed = Boolean(Number(formData.get(FORM_NAME.COMPLETED)));
  const id = formData.get(FORM_NAME.ID);

  if (typeof id !== "string") {
    return new Response("Invalid input", { status: 400 });
  }

  await gqlClient.request(UpdateTaskMutation, {
    data: { id, completed },
  });

  return new Response("Operation Success", { status: 200 });
}
