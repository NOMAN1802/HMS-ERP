'use client';
// Home: the landing screen inside the shell. Role modules appear here as their tasks are built
// and as permissions (T-ACC-02) grant them. Implements: T-UI-02.
import { PageLayout } from '@hms/ui';
import { useLocale, useTranslations } from 'next-intl';
import { tenantName } from '../../src/components/app-frame';
import { useCachedSession } from '../../src/session/use-session';

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const session = useCachedSession();
  if (!session) return null;

  return (
    <PageLayout
      title={t('home.title')}
      description={t('home.welcome', { name: session.user.displayName })}
    >
      <div className="max-w-xl rounded-panel border border-border bg-surface p-5">
        <p className="font-medium">{t('home.hospital', { name: tenantName(session, locale) })}</p>
        <p className="mt-2 text-text-muted">{t('home.nothingYet')}</p>
      </div>
    </PageLayout>
  );
}
