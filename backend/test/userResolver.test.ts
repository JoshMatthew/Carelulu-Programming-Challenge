import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import { UserResolver } from '../src/graphql/resolvers/UserResolver';
import { AppContext } from '../src/lib/types';

describe('UserResolver', () => {
  let prismaMock: any;
  let ctx: AppContext;
  let resolver: UserResolver;

  beforeEach(() => {
    prismaMock = {
      user: {
        findUnique: sinon.stub(),
        create: sinon.stub(),
      },
    };

    ctx = { userId: null, prisma: prismaMock };
    resolver = new UserResolver();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('signUp', () => {
    it('should create a new user and return auth payload', async () => {
      const input = { username: 'testuser', password: 'password123' };
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const fakeUser = {
        id: 1,
        user_name: input.username,
        password: hashedPassword,
      };

      prismaMock.user.findUnique.resolves(null);
      prismaMock.user.create.resolves(fakeUser);

      const result = await resolver.signUp({ ...input }, ctx);

      expect(result).to.have.property('token');
      expect(result.user).to.deep.equal(fakeUser);
    });

    it('should throw error if user already exists', async () => {
      const input = { username: 'existinguser', password: 'password123' };
      const existingUser = {
        id: 1,
        user_name: input.username,
        password: 'hashedpassword',
      };

      prismaMock.user.findUnique.resolves(existingUser);

      try {
        await resolver.signUp({ ...input }, ctx);
      } catch (error: any) {
        expect(error.message).to.equal('User already exists');
      }
    });
  });

  describe('signIn', () => {
    it('should authenticate user and return auth payload', async () => {
      const input = { username: 'testuser', password: 'password123' };
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const existingUser = {
        id: 1,
        user_name: input.username,
        password: hashedPassword,
      };

      prismaMock.user.findUnique.resolves(existingUser);

      const result = await resolver.signIn({ ...input }, ctx);

      expect(result).to.have.property('token');
      expect(result.user).to.deep.equal(existingUser);
    });

    it('should throw error if username does not exist', async () => {
      const input = { username: 'nonexistent', password: 'password123' };

      prismaMock.user.findUnique.resolves(null);

      try {
        await resolver.signIn({ ...input }, ctx);
      } catch (error: any) {
        expect(error.message).to.equal('Username does not exist');
      }
    });

    it('should throw error if password is incorrect', async () => {
      const input = { username: 'testuser', password: 'wrongpassword' };
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      const existingUser = {
        id: 1,
        user_name: input.username,
        password: hashedPassword,
      };

      prismaMock.user.findUnique.resolves(existingUser);

      try {
        await resolver.signIn({ ...input }, ctx);
      } catch (error: any) {
        expect(error.message).to.equal('Incorrect password');
      }
    });
  });
});
