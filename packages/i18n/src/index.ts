// Message catalogs (bn-BD, en) and formatters for digits, dates and money (ADR-017, C-025).
// Bangla strings are proposals until a native speaker reviews them (A1).
export const locales = ['en', 'bn-BD'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
