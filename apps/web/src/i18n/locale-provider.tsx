'use client';
// Interface language state (FR-I18N-001, ADR-017). The language is a per-user preference stored
// on the server, not part of the URL: switching re-renders with the other catalog and keeps
// everything else on screen, including unsaved form input. Before sign-in the device remembers
// the last choice; after sign-in the server preference wins. Implements: T-UI-02, T-I18N-01.
import { defaultLocale, htmlLang, isLocale, type Locale, messages } from '@hms/i18n';
import { NextIntlClientProvider } from 'next-intl';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useCachedSession } from '../session/use-session';

const STORAGE_KEY = 'hms.locale';
const TIME_ZONE = 'Asia/Dhaka';

interface LocaleControl {
  locale: Locale;
  setLocale: (next: Locale) => void;
}

const LocaleContext = createContext<LocaleControl | null>(null);

export function useLocaleControl(): LocaleControl {
  const control = useContext(LocaleContext);
  if (!control) throw new Error('useLocaleControl must be used inside <LocaleProvider>');
  return control;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const serverPreference = useCachedSession()?.user.preferredLang;

  // A per-device convenience for the signed-out screens; the app works without storage.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(stored)) setLocaleState(stored);
    } catch {
      // storage blocked: keep the default
    }
  }, []);

  useEffect(() => {
    if (serverPreference) setLocaleState(serverPreference);
  }, [serverPreference]);

  useEffect(() => {
    document.documentElement.lang = htmlLang(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage blocked: the choice lasts for this page view
    }
  }, []);

  const control = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={control}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone={TIME_ZONE}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
