import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../models/User';
import {
  AuthPayload,
  SignupUserInput,
  SigninUserInput,
} from '../models/UserAuth';
import { AuthConstants } from '../../lib/constants';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from 'process';
import { AppContext } from '../../lib/types';

@Resolver(() => User)
export class UserResolver {
  @Mutation(() => AuthPayload)
  async signUp(
    @Arg('data', () => SignupUserInput) data: SignupUserInput,
    @Ctx() ctx: AppContext,
  ): Promise<AuthPayload> {
    const { username, password } = data;
    const { prisma } = ctx;

    const existingUser = await prisma.user.findUnique({
      where: { user_name: username },
    });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        user_name: username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { exp: AuthConstants.AUTH_EXPIRATION, userId: user.id },
      (env.JWT_SECRET || 'unsafe-secret') as string,
    );

    return {
      token,
      user,
    };
  }

  @Mutation(() => AuthPayload)
  async signIn(
    @Arg('data', () => SigninUserInput) data: SigninUserInput,
    @Ctx() ctx: AppContext,
  ): Promise<AuthPayload> {
    const { username, password } = data;
    const { prisma } = ctx;

    const user = await prisma.user.findUnique({
      where: { user_name: username },
    });
    if (!user) {
      throw new Error('Username does not exist');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Incorrect password');
    }

    const token = jwt.sign(
      { exp: AuthConstants.AUTH_EXPIRATION, userId: user.id },
      (env.JWT_SECRET || 'unsafe-secret') as string,
    );

    return {
      token,
      user,
    };
  }

  @Query(() => [User])
  async getUsers(@Ctx() ctx: AppContext): Promise<User[]> {
    const { prisma } = ctx;
    return await prisma.user.findMany();
  }
}
