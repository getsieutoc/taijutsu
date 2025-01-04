import { userIncludes } from '@/lib/rich-includes';
import { Prisma } from '@prisma/client';

export * from './common';

export type UserWithPayload = Prisma.UserGetPayload<{
  include: typeof userIncludes;
}>;
