import { getServerSession, NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import { prisma } from '@/lib/prisma';
import { Role } from '@/types';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: 'noreply@sieutoc.website',
    }),
  ],
};

export async function getSession() {
  const session = await getServerSession(authOptions);

  const isAdmin = session?.user?.role === Role.ADMIN;

  return {
    session,
    isAdmin,
  };
}
