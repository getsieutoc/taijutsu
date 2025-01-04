import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Provider as JotaiProvider } from 'jotai';
import { SessionProvider } from 'next-auth/react';
import { configs } from '@/lib/swr';
import { SWRConfig } from 'swr';

export function GeneralProviders({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={configs}>
      <SessionProvider>
        <JotaiProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </JotaiProvider>
      </SessionProvider>
    </SWRConfig>
  );
}
