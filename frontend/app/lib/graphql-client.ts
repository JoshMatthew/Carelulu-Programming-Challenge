import { GraphQLClient } from "graphql-request";
import { LOCAL_API } from "./constants";

export const gqlClient = new GraphQLClient(process.env.API_URL || LOCAL_API);

function createAuthenticatedGqlClient(token: string): GraphQLClient {
  return new GraphQLClient(process.env.API_URL || LOCAL_API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getAuthenticatedGqlClient(token: string): GraphQLClient {
  return createAuthenticatedGqlClient(token);
}
