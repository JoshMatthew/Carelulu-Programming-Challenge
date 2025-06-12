import { DeleteTaskMutation } from "~/lib/graphql";
import { GraphQLClient } from "graphql-request";
import { FORM_NAME } from "../constants";

export async function deleteTaskHandler(
  formData: FormData,
  gqlClient: GraphQLClient,
) {
  const id = formData.get(FORM_NAME.ID);

  if (typeof id !== "string") {
    return new Response("Invalid ID", { status: 400 });
  }

  await gqlClient.request(
    DeleteTaskMutation,
    {
      deleteTaskId: Number(id),
    },
    {
      "x-api-key": process.env.API_KEY || "",
    },
  );

  return new Response("Operation Success", { status: 200 });
}
