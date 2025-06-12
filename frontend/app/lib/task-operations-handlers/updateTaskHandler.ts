import { UpdateTaskMutation } from "~/lib/graphql";
import { GraphQLClient } from "graphql-request";
import { FORM_NAME } from "../constants";

export async function updateTaskHandler(
  formData: FormData,
  gqlClient: GraphQLClient,
) {
  const title = formData.get(FORM_NAME.TASK_TITLE);
  const description = formData.get(FORM_NAME.TASK_DESCRIPTION);
  const id = formData.get(FORM_NAME.ID);

  if (
    typeof title !== "string" ||
    title.trim() === "" ||
    typeof description !== "string" ||
    typeof id !== "string"
  ) {
    return new Response("Invalid input", { status: 400 });
  }

  await gqlClient.request(
    UpdateTaskMutation,
    {
      data: {
        id,
        taskTitle: title,
        taskDescription: description,
      },
    },
    {
      "x-api-key": process.env.API_KEY || "",
    },
  );

  return new Response("Operation Success", { status: 200 });
}
