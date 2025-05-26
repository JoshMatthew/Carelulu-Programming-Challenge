import { Mutation, Resolver } from 'type-graphql';
import { AuthPayload, User } from '../models/User';
import { CreateUser } from '../models/UserAuth';
import { prisma } from '../../lib/constants';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function createUser({ parent, args, context }: any) {
  const password = await bcrypt.hash(args.password, 10);

  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  const token = jwt.sign({ userId: user.id }, 'secret');

  return {
    token,
    user,
  };
}

@Resolver(() => User)
export class UserResolver {
  // @Mutation(() => AuthPayload)
  // async signUp(
  //     @Arg('data', () => CreateUser) data: CreateUser,
  // ): Promise<AuthPayload> {
  //     const { username, password } = data;
  //     const existingUser = await prisma.user.findUnique({ where: { user_name: username } });
  //     if (existingUser) {
  //       return res.status(400).json({ error: 'User already exists' });
  //     }
  // }
}
