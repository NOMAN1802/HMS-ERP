# T-I18N-01 and T-UI-02: catalogs, formatters, app shell and sign-in screens

- **Date:** 2026-10-15
- **Commit:** this branch (API endpoint 660e4fd, layouts 708ee08, web and catalogs 75de4f4, tests and fixes in the final commit)
- **Implements:** tasks T-I18N-01 and T-UI-02, FR-I18N-001, -002, -005, SP-11, FR-ACC-001, decisions C-036, C-052 to C-060, C-057 (lakh and crore), ADR-017, ADR-021, ADR-022

## What was built

A person can open the app, sign in with the real API, choose a hospital when they have several, work inside the application shell, switch between Bangla and English without losing what they typed, and sign out. The language choice is saved per user on the server. The shell adapts to desktop, tablet and phone, warns before the idle timeout, and clears everything it knows on logout. Message catalogs and formatters (lakh and crore money, Bangla digits, Dhaka time) now exist in `packages/i18n`, with checks that fail the build on missing or unused keys.

## Files

| File                                                                 | Purpose                                                                                                      |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `packages/i18n/src/messages/{en,bn-BD}.ts`                           | Typed catalogs; Bangla is typed against English so a missing key does not compile                            |
| `packages/i18n/src/{locale,digits,numbers,dates}.ts`                 | Locale list (Bangla default), digit style, lakh and crore money and numbers, dates in the facility time zone |
| `packages/i18n/src/{format,catalog}.test.ts`                         | Formatter behavior; key parity, placeholder parity, empty values, unused keys                                |
| `packages/contracts/src/auth.ts`                                     | `updatePreferencesRequestSchema`                                                                             |
| `packages/mod-identity-access/src/{http,application,infrastructure}` | `PATCH /api/v1/auth/preferences`                                                                             |
| `packages/ui/src/layouts/`                                           | AppShell, AuthLayout, PageLayout                                                                             |
| `packages/ui/src/patterns/`                                          | LanguageSwitch, DesktopOnlyNotice, SessionExpiryDialog, Alert                                                |
| `apps/web/src/api/`                                                  | Fetch client (cookie, CSRF, typed errors, contract validation) and auth calls                                |
| `apps/web/src/session/`                                              | Session query and actions, route guard, expiry timing                                                        |
| `apps/web/src/i18n/`                                                 | Locale provider and API error text by code                                                                   |
| `apps/web/src/components/`                                           | Brand, language control, account menu, sign-in form, app frame, expiry guard                                 |
| `apps/web/app/`                                                      | Providers, root layout, `/login`, `/choose-hospital`, the `(app)` shell group and home                       |
| `apps/web/e2e/auth-shell.spec.ts`, `e2e/support/mock-api.ts`         | Ten browser tests against a contract-valid mock API                                                          |
| `apps/web/public/brand/`                                             | Placeholder tenant logo (Bytespate mark)                                                                     |
| `pnpm-workspace.yaml`                                                | `@parcel/watcher` build script explicitly denied (optional next-intl dependency, unused)                     |

## Decisions applied

- Bangla is the default language (C-052); digits follow the UI language (C-036); money groups as lakh and crore in both languages (C-057).
- The language is a per-user server preference, not part of the URL (ADR-017 item 2). Signed-out screens remember the last choice on the device; after sign-in the server preference wins.
- Switching language re-renders with the other catalog in place, so unsaved input is kept (AT-I18N-001). Error and validation messages are held as data and translated at render, so they follow a language switch too.
- Money formatters take exact decimal strings and never floats (ADR-007); more than two decimal places is an error, not a silent rounding.
- Guards are client-side because the session cookie belongs to the API origin and the web server cannot see it (ADR-021). They are a convenience; the API enforces every request (ADR-002).
- Sign-out waits for the server to confirm before the screen changes, so a failed request never looks like a completed logout.
- Navigation entries name the permission they need and are filtered before reaching the shell. No permissions are issued until T-ACC-02, so only entries without a requirement show.
- TanStack Query is pinned to 5.104.1: 5.104.3 was published the same day and the supply-chain age policy rejects it. The policy file was not relaxed.

## Verification

| Command                                                | Result                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm --filter @hms/api test`                          | 15 passed, 4 new for the preferences endpoint (written first, 404 red)                                                                                                                                                                                                                                                              |
| `pnpm --filter @hms/i18n test`                         | 26 passed (formatters, parity, placeholders, unused keys; the unused-key check was red until screens used the keys)                                                                                                                                                                                                                 |
| `pnpm --filter @hms/ui test`                           | 150 passed (layouts and patterns added)                                                                                                                                                                                                                                                                                             |
| `pnpm --filter @hms/web test`                          | 18 passed (API client, expiry timing, navigation filter, route guard)                                                                                                                                                                                                                                                               |
| `pnpm --filter @hms/web test:e2e`                      | 21 passed in Chromium (10 sign-in and shell, 11 gallery), with axe in both languages, phone width, the expiry dialog                                                                                                                                                                                                                |
| Manual smoke run, real API and PostgreSQL, web on 3100 | Sign-in across origins set the HttpOnly cookie; two-hospital chooser showed the Bangla name with English fallback; hospital choice reached the shell; switching to English was kept after clearing local storage and reloading (server preference); sign-out returned to `/login` and the API answered 401 to the next session read |
| `pnpm turbo run lint typecheck build test`             | 50 of 50 tasks passed (kernel 2, database 14, config-eslint 16, i18n 26, contracts 9, platform 6, identity 42, web 18, api 15, ui 150 tests)                                                                                                                                                                                        |

## Known limitations

- No permissions yet: the nav shows only Home until T-ACC-02 (session payload has no permission codes).
- The expiry warning uses the browser clock against server timestamps; a badly skewed clock shifts the warning time (the server still enforces the real limit). "Stay signed in" cannot extend the 12-hour absolute limit; the dialog then simply runs to the end.
- A request that returns 401 elsewhere in the app does not yet trigger the expired flow (no data screens exist); it should be added with the first data screen.
- Login has no rate limiting or lockout UI (T-ACC-03) and no MFA (T-ACC-04).
- The language save is best effort: if it fails, the screen keeps the chosen language and shows a notice; the server value is applied on the next successful save.
- Bangla wording is proposed and needs native review (Q-050). `DesktopOnlyNotice` exists but no screen uses it yet (its texts are added with the first phone-restricted screen).
- The logo is the raster Bytespate placeholder (ADR-022 section 12).

## How to debug

- Sign-in works but the shell bounces to `/login`: check that the API answers `GET /api/v1/auth/session` with the cookie. The cookie is `__Host-hms_session`, `Secure`, so it only works on `https` or on `localhost`; the API must allow the web origin in `CORS_ORIGINS`.
- A screen shows English or Bangla unexpectedly: the signed-in preference (server) overrides the device choice; check `user.preferredLang` in `GET /auth/session` and the `hms.locale` local storage key.
- A message key fails the build: the English catalog is the source; add it to `en.ts` first, then the same key to `bn-BD.ts`. `catalog.test.ts` names unused or mismatched keys.
- Money looks wrong: formatters take decimal strings (`'1234567.50'`), never numbers. Output grouping is lakh and crore by design.
- Browser tests use the built `@hms/ui` and `@hms/i18n`: run `pnpm turbo run build` before `pnpm --filter @hms/web test:e2e` (CI does).
- The mock API for browser tests lives in `apps/web/e2e/support/mock-api.ts`; extend it when a screen calls a new endpoint.
