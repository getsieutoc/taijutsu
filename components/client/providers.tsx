import { SessionProvider } from 'next-auth/react';
import { Provider as JotaiProvider } from 'jotai';
import { SWRConfig } from 'swr';
import { configs } from '@/lib/swr';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={configs}>
      <SessionProvider>
        <JotaiProvider>{children}</JotaiProvider>
      </SessionProvider>
    </SWRConfig>
  );
}
