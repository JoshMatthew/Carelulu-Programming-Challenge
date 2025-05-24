import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { TaskResolver } from './resolvers/TaskResolver';

export const createSchema = async () => {
  return await buildSchema({
    resolvers: [TaskResolver],
    validate: false,
  });
};
