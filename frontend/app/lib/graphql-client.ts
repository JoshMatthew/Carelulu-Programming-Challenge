import { GraphQLClient } from "graphql-request";

const apiUrl =
  "http://ec2-3-27-214-243.ap-southeast-2.compute.amazonaws.com:3000";

export const gqlClient = new GraphQLClient(apiUrl);

function createAuthenticatedGqlClient(token: string): GraphQLClient {
  return new GraphQLClient(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getAuthenticatedGqlClient(token: string): GraphQLClient {
  return createAuthenticatedGqlClient(token);
}
