import 'reflect-metadata';
import { expect } from 'chai';
import sinon from 'sinon';
import { TaskResolver } from '../src/graphql/resolvers/TaskResolver';
import { AppContext } from '../src/lib/types';

describe('TaskResolver', () => {
  let prismaMock: any;
  let ctx: AppContext;
  let resolver: TaskResolver;

  beforeEach(() => {
    prismaMock = {
      task: {
        findFirst: sinon.stub(),
        create: sinon.stub(),
        findUnique: sinon.stub(),
        update: sinon.stub(),
        delete: sinon.stub(),
        deleteMany: sinon.stub(),
      },
      user: {
        findUnique: sinon.stub(),
      },
    };

    ctx = { userId: 1, prisma: prismaMock };
    resolver = new TaskResolver();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('task', () => {
    it('should return a task if found', async () => {
      const fakeTask = {
        id: 1,
        task_title: 'Test Task',
        task_description: 'Description',
        createdBy: {
          id: 1,
          tasks: [],
        },
      };

      prismaMock.task.findFirst.resolves(fakeTask);

      const result = await resolver.task(1, ctx);

      expect(result).to.deep.equal(fakeTask);
    });

    it('should throw an error if task not found', async () => {
      prismaMock.task.findFirst.resolves(null);

      try {
        await resolver.task(1, ctx);
      } catch (error: any) {
        expect(error.message).to.equal('Cannot find task id:1');
      }
    });
  });

  describe('allTask', () => {
    it('should return all tasks for the user', async () => {
      const fakeTasks = [
        { id: 1, task_title: 'Task 1', task_description: 'Desc 1' },
        { id: 2, task_title: 'Task 2', task_description: null },
      ];

      prismaMock.user.findUnique.resolves({ tasks: fakeTasks });

      const result = await resolver.allTask(ctx);

      expect(result).to.deep.equal([
        { id: 1, task_title: 'Task 1', task_description: 'Desc 1' },
        { id: 2, task_title: 'Task 2', task_description: undefined },
      ]);
    });

    it('should throw an error if user not found', async () => {
      prismaMock.user.findUnique.resolves(null);

      try {
        await resolver.allTask(ctx);
      } catch (error: any) {
        expect(error.message).to.equal('User not found');
      }
    });
  });

  describe('createTask', () => {
    it('should create and return a new task', async () => {
      const input = { taskTitle: 'New Task', taskDescription: 'New Desc' };
      const fakeTask = {
        id: 1,
        task_title: input.taskTitle,
        task_description: input.taskDescription,
      };

      prismaMock.task.create.resolves(fakeTask);

      const result = await resolver.createTask(input, ctx);

      expect(result).to.deep.equal(fakeTask);
    });
  });

  describe('updateTask', () => {
    it('should update and return the task', async () => {
      const input = {
        id: 1,
        taskTitle: 'Updated Title',
        taskDescription: 'Updated Desc',
        completed: true,
      };

      const existingTask = { createdBy: { id: 1 } };
      const updatedTask = {
        id: 1,
        task_title: input.taskTitle,
        task_description: input.taskDescription,
        completed: input.completed,
        createdBy: { id: 1, tasks: [] },
      };

      prismaMock.task.findUnique.resolves(existingTask);
      prismaMock.task.update.resolves(updatedTask);

      const result = await resolver.updateTask(input, ctx);

      expect(result).to.deep.equal(updatedTask);
    });

    it('should throw an error if task not found', async () => {
      prismaMock.task.findUnique.resolves(null);

      try {
        await resolver.updateTask({ id: 1 }, ctx);
      } catch (error: any) {
        expect(error.message).to.equal('Task not found');
      }
    });

    it('should throw an error if user is not authorized', async () => {
      prismaMock.task.findUnique.resolves({ createdBy: { id: 2 } });

      try {
        await resolver.updateTask({ id: 1 }, ctx);
      } catch (error: any) {
        expect(error.message).to.equal('Not authorized to update this task');
      }
    });
  });

  describe('deleteTask', () => {
    it('should delete and return the task', async () => {
      const existingTask = { createdBy: { id: 1 } };
      const deletedTask = {
        id: 1,
        task_title: 'Deleted Task',
        task_description: 'Desc',
        createdBy: { id: 1 },
      };

      prismaMock.task.findUnique.resolves(existingTask);
      prismaMock.task.delete.resolves(deletedTask);

      const result = await resolver.deleteTask(1, ctx);

      expect(result).to.deep.equal(deletedTask);
    });

    it('should throw an error if task not found', async () => {
      prismaMock.task.findUnique.resolves(null);

      try {
        await resolver.deleteTask(1, ctx);
      } catch (error: any) {
        expect(error.message).to.equal('Task not found');
      }
    });

    it('should throw an error if user is not authorized', async () => {
      prismaMock.task.findUnique.resolves({ createdBy: { id: 2 } });

      try {
        await resolver.deleteTask(1, ctx);
      } catch (error: any) {
        expect(error.message).to.equal('Not authorized to delete this task');
      }
    });
  });

  describe('deleteAllCompleted', () => {
    it('should delete all completed tasks and return the count', async () => {
      prismaMock.task.deleteMany.resolves({ count: 3 });

      const result = await resolver.deleteAllCompleted(ctx);

      expect(result).to.equal(3);
    });
  });
});
