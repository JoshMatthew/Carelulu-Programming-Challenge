import { PrismaClient } from '../../generated/prisma';
import jwt from 'jsonwebtoken';
import { env } from 'process';
import { UNSAFE_SECRET } from './constants';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: number;
}

export const context = async ({ req }: any) => {
  const authHeader = req?.headers?.authorization;
  let userId: number | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(
        token,
        (env.JWT_SECRET || UNSAFE_SECRET) as string,
      ) as JwtPayload;
      userId = decoded.userId;
    } catch (err) {
      console.log('ERROR: Token is invalid or expired; userId remains null');
    }
  }

  return {
    userId,
    prisma,
  };
};
