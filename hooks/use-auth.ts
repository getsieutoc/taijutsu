import { useSession } from 'next-auth/react';

export type UseAuthOptions = Parameters<typeof useSession>[0];

export const useAuth = (options?: UseAuthOptions) => {
  const { data: session, status, ...rest } = useSession(options);

  const isAuthenticated = !!session && status === 'authenticated';

  return { ...rest, session, status, isAuthenticated };
};
