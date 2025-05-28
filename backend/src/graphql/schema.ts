import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { TaskResolver } from './resolvers/TaskResolver';
import { UserResolver } from './resolvers/UserResolver';
import { customAuthChecker } from './authChecker';

export const createSchema = async () => {
  return await buildSchema({
    resolvers: [TaskResolver, UserResolver],
    authChecker: customAuthChecker,
  });
};
