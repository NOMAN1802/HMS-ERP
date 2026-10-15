'use client';
// Warns before the idle timeout and ends the screen cleanly when the session is over
// (F section 8, SP-11, C-032). "Stay signed in" asks the API for the session again, which slides
// the idle timeout. The times come from the server; this clock only decides when to show them.
// Implements: T-UI-02.
import type { SessionResponse } from '@hms/contracts';
import { SessionExpiryDialog } from '@hms/ui';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { expiryState, minutesLeft } from '../session/expiry';
import { useSession, useSessionActions } from '../session/use-session';

const TICK_MS = 1000;

export function SessionExpiryGuard({ session }: { session: SessionResponse }) {
  const t = useTranslations();
  const router = useRouter();
  const { refetch } = useSession();
  const { forget } = useSessionActions();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(timer);
  }, []);

  const state = expiryState(session, now);

  return (
    <SessionExpiryDialog
      mode={state.mode}
      title={state.mode === 'expired' ? t('session.expiredTitle') : t('session.expiringTitle')}
      body={
        state.mode === 'expired'
          ? t('session.expiredBody')
          : t('session.expiringBody', { minutes: minutesLeft(state.secondsLeft) })
      }
      stayLabel={t('session.stay')}
      signOutLabel={t('common.signOut')}
      signInAgainLabel={t('session.signInAgain')}
      closeLabel={t('common.close')}
      onStay={() => void refetch()}
      onSignOut={() => {
        forget();
        router.replace('/login');
      }}
      onSignInAgain={() => {
        forget();
        router.replace('/login');
      }}
    />
  );
}
