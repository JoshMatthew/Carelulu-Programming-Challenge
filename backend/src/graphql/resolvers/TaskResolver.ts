import {
  Resolver,
  Mutation,
  Arg,
  Authorized,
  Ctx,
  Query,
  Int,
} from 'type-graphql';
import { Task } from '../models/Task';
import { CreateTaskInput, UpdateTaskInput } from '../models/TaskInput';
import { AppContext } from '../../lib/types';

@Resolver(() => Task)
export class TaskResolver {
  @Authorized()
  @Query(() => Task)
  async task(
    @Arg('id', () => Int) id: number,
    @Ctx() ctx: AppContext,
  ): Promise<Task | null> {
    const { prisma, userId } = ctx;

    const task = await prisma.task.findFirst({
      where: {
        id: Number(id),
        createdBy: {
          id: userId,
        },
      },
      include: {
        createdBy: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!task) {
      throw new Error(`Cannot find task id:${id}`);
    } else {
      return task;
    }
  }

  @Authorized()
  @Query(() => [Task])
  async allTask(@Ctx() ctx: AppContext): Promise<Task[]> {
    const { prisma, userId } = ctx;

    const userWithTasks = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        tasks: true,
      },
    });

    if (!userWithTasks) {
      throw new Error('User not found');
    }

    return userWithTasks.tasks.map((task: Task) => ({
      ...task,
      task_description: task.task_description ?? undefined,
    }));
  }

  @Authorized()
  @Mutation(() => Task)
  async createTask(
    @Arg('data', () => CreateTaskInput) data: CreateTaskInput,
    @Ctx() ctx: AppContext,
  ): Promise<Task> {
    const { userId, prisma } = ctx;

    return await prisma.task.create({
      data: {
        task_title: data.taskTitle,
        task_description: data.taskDescription,
        createdBy: {
          connect: { id: userId },
        },
      },
    });
  }

  @Authorized()
  @Mutation(() => Task)
  async updateTask(
    @Arg('data', () => UpdateTaskInput) data: UpdateTaskInput,
    @Ctx() ctx: AppContext,
  ): Promise<Task> {
    const { userId, prisma } = ctx;
    const { taskTitle, taskDescription, completed, id } = data;

    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
      select: { createdBy: true },
    });

    if (!existingTask) {
      throw new Error('Task not found');
    }

    if (existingTask.createdBy.id !== userId) {
      throw new Error('Not authorized to update this task');
    }

    const toUpdate: any = {};

    if (taskTitle !== undefined) toUpdate.task_title = taskTitle;
    if (taskDescription !== undefined)
      toUpdate.task_description = taskDescription;
    if (completed !== undefined) toUpdate.completed = completed;

    return await prisma.task.update({
      where: {
        id: Number(id),
      },
      data: toUpdate,
      include: {
        createdBy: {
          include: {
            tasks: true,
          },
        },
      },
    });
  }

  @Authorized()
  @Mutation(() => Task)
  async deleteTask(
    @Arg('id', () => Int) id: number,
    @Ctx() ctx: AppContext,
  ): Promise<Task> {
    const { userId, prisma } = ctx;

    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
      select: { createdBy: true },
    });

    if (!existingTask) {
      throw new Error('Task not found');
    }

    if (existingTask.createdBy.id !== userId) {
      throw new Error('Not authorized to delete this task');
    }

    return await prisma.task.delete({
      where: { id },
      include: {
        createdBy: true,
      },
    });
  }

  @Authorized()
  @Mutation(() => Int)
  async deleteAllCompleted(@Ctx() ctx: AppContext): Promise<number> {
    const { userId, prisma } = ctx;

    const result = await prisma.task.deleteMany({
      where: {
        AND: [{ completed: true }, { taskCreatorId: userId }],
      },
    });

    return result.count;
  }
}
