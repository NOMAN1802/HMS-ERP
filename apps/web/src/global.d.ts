// Types next-intl's message keys and locale from the shared catalogs, so a wrong key does not
// compile (FR-I18N-002).
import type { Locale, Messages } from '@hms/i18n';

declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}
