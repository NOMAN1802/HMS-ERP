'use client';
// Turns any failure into text in the current language by its stable code (ADR-017 item 1).
// Unknown codes and client-side failures fall back to generic wording; server text is never shown.
import { errorCodes, type ErrorCode } from '@hms/contracts';
import { useTranslations } from 'next-intl';
import { ApiError, CLIENT_ERROR_CODES } from '../api/errors';

function isApiErrorCode(code: string): code is ErrorCode {
  return Object.hasOwn(errorCodes, code);
}

export function useApiErrorMessage(): (error: unknown) => string {
  const t = useTranslations();
  return (error) => {
    if (error instanceof ApiError) {
      if (error.code === CLIENT_ERROR_CODES.NETWORK) return t('errors.offline');
      if (isApiErrorCode(error.code)) return t(`errors.api.${error.code}`);
    }
    return t('errors.generic');
  };
}
