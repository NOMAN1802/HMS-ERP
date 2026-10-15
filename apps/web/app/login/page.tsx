'use client';
// SCR-01: sign in. Implements: T-UI-02, UC-ACC-01.
import { Alert, AuthLayout, Button } from '@hms/ui';
import { useTranslations } from 'next-intl';
import { Brand } from '../../src/components/brand';
import { FullScreenStatus } from '../../src/components/full-screen-status';
import { LanguageControl } from '../../src/components/language-control';
import { LoginForm } from '../../src/components/login-form';
import { useAccess } from '../../src/session/use-access';

export default function LoginPage() {
  const t = useTranslations();
  const access = useAccess('anonymous');

  if (access.status === 'loading' || access.status === 'redirecting') {
    return <FullScreenStatus>{t('common.loading')}</FullScreenStatus>;
  }

  return (
    <AuthLayout brand={<Brand name={t('app.name')} />} topEnd={<LanguageControl />}>
      {access.status === 'unreachable' ? (
        <div className="flex flex-col gap-4">
          <Alert tone="danger">{t('errors.offline')}</Alert>
          <Button variant="secondary" onClick={access.retry}>
            {t('common.retry')}
          </Button>
        </div>
      ) : (
        <LoginForm />
      )}
    </AuthLayout>
  );
}
