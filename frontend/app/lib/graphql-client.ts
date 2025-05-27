import { GraphQLClient } from "graphql-request";

const apiUrl =
  "http://ec2-3-27-214-243.ap-southeast-2.compute.amazonaws.com:3000";

export const gqlClient = new GraphQLClient(apiUrl);

export function createAuthenticatedGqlClient(token: string): GraphQLClient {
  return new GraphQLClient(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
