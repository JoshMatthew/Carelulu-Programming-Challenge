import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql';
import { PrismaClient } from '../../../generated/prisma';
import { Task } from '../models/Task';
import { CreateTaskInput, UpdateTaskInput } from '../models/TaskInput';

const prisma = new PrismaClient();

@Resolver(() => Task)
export class TaskResolver {
  @Query(() => [Task])
  async allTask(): Promise<Task[]> {
    const tasks = await prisma.task.findMany();
    return tasks.map((task) => ({
      ...task,
      task_description: task.task_description ?? undefined,
    }));
  }

  @Mutation(() => Task)
  async createTask(
    @Arg('data', () => CreateTaskInput) data: CreateTaskInput
  ): Promise<Task> {
    return await prisma.task.create({
      data: {
        task_title: data.taskTitle,
        task_description: data.taskDescription,
      },
    });
  }

  @Mutation(() => Task)
  async updateTask(
    @Arg('data', () => UpdateTaskInput) data: UpdateTaskInput
  ): Promise<Task> {
    const {taskTitle, taskDescription, completed, id} = data;
    const toUpdate: any = {};

    if (taskTitle !== undefined) toUpdate.task_title = taskTitle;
    if (taskDescription !== undefined) toUpdate.task_description = taskDescription;
    if (completed !== undefined) toUpdate.completed = completed;

    return await prisma.task.update({
      where: { id },
      data: toUpdate,
    });
  }

  @Mutation(() => Task)
  async deleteTask(@Arg('id', () => Int) id: number): Promise<Task> {
    return await prisma.task.delete({
      where: { id },
    });
  }

  @Mutation(() => Int)
  async deleteAllCompleted(): Promise<number> {
    const result = await prisma.task.deleteMany({
      where: { completed: true },
    });
    return result.count;
  }
}
