'use client';
// SCR-01 (second step): choose a hospital when the account has more than one, or switch later
// from the account menu. A hospital switch gets a new session on the server (ADR-004).
// Implements: T-UI-02, UC-ACC-01, FR-ACC-002.
import { Alert, AuthLayout, Button } from '@hms/ui';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Brand } from '../../src/components/brand';
import { FullScreenStatus } from '../../src/components/full-screen-status';
import { LanguageControl } from '../../src/components/language-control';
import { useApiErrorMessage } from '../../src/i18n/use-api-error-message';
import { useAccess } from '../../src/session/use-access';
import { useSessionActions } from '../../src/session/use-session';

export default function ChooseHospitalPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const errorMessage = useApiErrorMessage();
  const access = useAccess('account');
  const { selectMembership, logout } = useSessionActions();
  const [failure, setFailure] = useState<unknown>(null);

  if (access.status !== 'ready' && access.status !== 'unreachable') {
    return <FullScreenStatus>{t('common.loading')}</FullScreenStatus>;
  }

  const memberships = access.session?.memberships ?? [];
  const pendingId = selectMembership.isPending ? selectMembership.variables : null;

  function choose(membershipId: string): void {
    setFailure(null);
    selectMembership.mutate(membershipId, {
      onSuccess: () => router.replace('/'),
      onError: setFailure,
    });
  }

  function signOut(): void {
    logout.mutate(undefined, { onSuccess: () => router.replace('/login'), onError: setFailure });
  }

  return (
    <AuthLayout brand={<Brand name={t('app.name')} />} topEnd={<LanguageControl />}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-semibold">{t('chooseHospital.title')}</h1>
          <p className="mt-1 text-text-muted">{t('chooseHospital.description')}</p>
        </div>

        {failure || access.status === 'unreachable' ? (
          <Alert tone="danger">{errorMessage(failure ?? { code: 'NETWORK' })}</Alert>
        ) : null}

        {memberships.length === 0 && access.status === 'ready' ? (
          <>
            <Alert tone="info">{t('chooseHospital.noAccess')}</Alert>
            <Button variant="secondary" onClick={signOut}>
              {t('common.signOut')}
            </Button>
          </>
        ) : (
          <ul className="flex flex-col gap-3">
            {memberships.map((membership) => {
              const names =
                locale === 'bn-BD'
                  ? [membership.tenantNameBn, membership.tenantNameEn]
                  : [membership.tenantNameEn, membership.tenantNameBn];
              const name = names.find((value) => value) ?? membership.tenantId;
              return (
                <li key={membership.id}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full justify-start"
                    aria-label={t('chooseHospital.continueWith', { name })}
                    loading={pendingId === membership.id}
                    disabled={selectMembership.isPending}
                    onClick={() => choose(membership.id)}
                  >
                    {name}
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AuthLayout>
  );
}
