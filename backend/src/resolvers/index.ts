import { PrismaClient } from '../../generated/prisma';
import { TaskInput, TaskUpdateInput, UpdateTaskArgs } from '../lib/types';

const prisma = new PrismaClient();

export default {
  Query: {
    allTask: async () => {
      return await prisma.task.findMany();
    },
  },
  Mutation: {
    createTask: async (_: any, args: TaskInput) => {
      return await prisma.task.create({
        data: {
          task_title: args.taskTitle,
          task_description: args.taskDescription,
        },
      });
    },
    updateTask: async (_: any, args: UpdateTaskArgs) => {
      const { id, taskTitle, taskDescription, completed } = args;
      const data: TaskUpdateInput = {};

      if (taskTitle !== undefined) data.task_title = taskTitle;
      if (taskDescription !== undefined)
        data.task_description = taskDescription;
      if (completed !== undefined) data.completed = completed;

      return prisma.task.update({
        where: { id: Number(id) },
        data,
      });
    },
    deleteTask: async (_: any, { id }: { id: number }) => {
      return await prisma.task.delete({
        where: {
          id: Number(id),
        },
      });
    },
    deleteAllCompleted: async () => {
      const result = await prisma.task.deleteMany({
        where: {
          completed: true,
        },
      });
      return result.count;
    },
  },
};
