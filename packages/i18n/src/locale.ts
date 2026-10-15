// Supported interface languages (C-025, ADR-017). Bangla is the default: designs are reviewed
// in Bangla first (C-052) and the user preference defaults to bn-BD in the schema.
export const locales = ['bn-BD', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'bn-BD';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Value for the `lang` attribute of the document (F section 7.4). */
export function htmlLang(locale: Locale): string {
  return locale;
}
