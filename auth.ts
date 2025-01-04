import CredentialProvider from 'next-auth/providers/credentials';
import { MIN_PASSWORD_LENGTH } from '@/lib/constants';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma, PrismaClient } from '@/lib/prisma';
import { userIncludes } from '@/lib/rich-includes';
import { MembershipStatus } from '@prisma/client';
import authConfig from '@/auth.config';
import NextAuth from 'next-auth';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  adapter: PrismaAdapter(prisma as PrismaClient),

  session: { strategy: 'jwt' },

  providers: [
    CredentialProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: {
          type: 'password',
        },
      },

      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(MIN_PASSWORD_LENGTH),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await prisma.user.findUnique({
            omit: { hashedPassword: false },
            where: { email },
          });

          if (!user) return null;

          const isValid = await bcrypt.compare(password, user.hashedPassword);

          if (!isValid) return null;

          return {
            id: user.id,
          };
        }

        return null;
      },
    }),
  ],
});

export const getAuth = async () => {
  const session = await auth();

  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        include: userIncludes,
      })
    : null;

  const activeMembership = user?.memberships.find(
    (membership) => membership.status === MembershipStatus.ACTIVE
  );

  return { session, user, activeMembership };
};
