'use client';
// Client providers for the whole app: server state (TanStack Query, ADR-002 point 2), the
// interface language, and notifications. Implements: T-UI-02, T-I18N-01.
import { ToastProvider } from '@hms/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { type ReactNode, useState } from 'react';
import { LocaleProvider } from '../src/i18n/locale-provider';

function Notifications({ children }: { children: ReactNode }) {
  const t = useTranslations();
  return (
    <ToastProvider regionLabel={t('common.notifications')} closeLabel={t('common.dismiss')}>
      {children}
    </ToastProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  // One client per browser tab. Nothing tenant-specific is cached beyond the session, and the
  // whole cache is cleared on logout and expiry (ADR-002 evidence).
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false, refetchOnWindowFocus: true } },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <Notifications>{children}</Notifications>
      </LocaleProvider>
    </QueryClientProvider>
  );
}
