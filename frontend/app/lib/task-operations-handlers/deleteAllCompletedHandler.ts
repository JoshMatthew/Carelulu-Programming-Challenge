import { GraphQLClient } from "graphql-request";
import { DeleteAllCompletedMutation } from "~/lib/graphql";

export async function deleteAllCompletedTaskHandler(
  formData: FormData,
  gqlClient: GraphQLClient,
) {
  await gqlClient.request(
    DeleteAllCompletedMutation,
    {},
    {
      "x-api-key": process.env.API_KEY || "",
    },
  );

  return new Response("Operation Success", { status: 200 });
}
