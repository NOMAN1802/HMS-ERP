'use client';
// The Bangla / English switch wired to the app: changes the language at once, remembers it on
// the device, and saves it on the server when signed in (FR-I18N-001). A failed save is told to
// the user, but the language still changes: the screen must not fight the person. Implements: T-UI-02.
import { type Locale } from '@hms/i18n';
import { LanguageSwitch, useToast } from '@hms/ui';
import { useTranslations } from 'next-intl';
import { useLocaleControl } from '../i18n/locale-provider';
import { useApiErrorMessage } from '../i18n/use-api-error-message';
import { useCachedSession, useSessionActions } from '../session/use-session';

export function LanguageControl() {
  const t = useTranslations();
  const { locale, setLocale } = useLocaleControl();
  const { updateLanguage } = useSessionActions();
  const signedIn = useCachedSession() != null;
  const toast = useToast();
  const errorMessage = useApiErrorMessage();

  function change(next: Locale): void {
    setLocale(next);
    if (!signedIn) return;
    updateLanguage.mutate(next, {
      onError: (error) => toast.show({ title: errorMessage(error), tone: 'warning' }),
    });
  }

  return (
    <LanguageSwitch
      value={locale}
      onChange={change}
      label={t('language.label')}
      options={[
        { value: 'bn-BD', label: t('language.bn') },
        { value: 'en', label: t('language.en') },
      ]}
    />
  );
}
