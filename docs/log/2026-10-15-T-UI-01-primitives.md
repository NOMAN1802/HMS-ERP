# T-UI-01 (S2 to S5): guardrails, hooks, primitives and gallery

- **Date:** 2026-10-15
- **Commit:** this branch (guardrails d2995aa, primitives c0d9b45, gallery and fixes in the final commit)
- **Implements:** task T-UI-01 (slices S2 to S5), NFR-UX-001, NFR-ACC-001, FR-I18N-001, decisions C-056, C-058, C-059, ADR-022 sections 8, 9, 10, 13 and 14, ADR-002 evidence item 1

## What was built

The in-house component layer of ADR-022. A developer can now build a screen from `@hms/ui`: Button, IconButton, TextInput and Field, StatusBadge, Dialog, Menu, Tabs, Combobox and Toast, on top of reusable behavior hooks. Lint rules stop feature code from writing raw widgets, color literals, ad-hoc formatting, `'use server'` or direct icon imports. An internal gallery at `/dev/ui` shows every primitive and is the target of real-browser keyboard and accessibility tests.

## Files

| File                                                        | Purpose                                                                                                                              |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/config-eslint/`                                   | Reuse guardrail rules (apps/web and packages/ui) with 16 rule tests                                                                  |
| `eslint.config.js`, `.dependency-cruiser.cjs`               | Wire the rules; `packages/ui` may import only i18n; packages never import apps                                                       |
| `packages/ui/src/hooks/`                                    | Controllable state, tabbable lookup, focus trap, overlay stack and dismiss, scroll lock, typeahead, index navigation, live announcer |
| `packages/ui/src/primitives/`                               | Button, TextInput, Field, StatusBadge, Dialog, Menu, Tabs, Combobox, Toast, each with tests                                          |
| `packages/ui/src/icons/Icon.tsx`                            | The only module that imports the icon library (Phosphor, per-icon subpaths)                                                          |
| `packages/ui/src/utils/`                                    | `cx` class joiner and the grapheme counter                                                                                           |
| `packages/ui/src/styles/`                                   | New tokens: hover surface, overlay shadow, motion utilities                                                                          |
| `packages/ui/README.md`                                     | Usage, layers, keyboard contracts, how to add a primitive                                                                            |
| `packages/ui/vitest.config.ts`, `packages/ui/test/setup.ts` | jsdom and Testing Library setup                                                                                                      |
| `apps/web/app/dev/ui/`                                      | The gallery route (noindex)                                                                                                          |
| `apps/web/e2e/ui-gallery.spec.ts`                           | Keyboard flows, Bangla search, axe and phone-width checks in Chromium                                                                |
| `packages/config-typescript/library.json`                   | `.test.tsx` files excluded from builds like `.test.ts`                                                                               |

## Decisions applied

- Every primitive has a keyboard contract (file header, README table), tests written with it, and a browser check (ADR-022 section 8).
- Primitives carry no user-facing text: labels such as the close button name and the empty-list text are required props, already translated.
- Combobox does not fetch: the owner passes options for the current query. While an input method is composing it queries nothing and ignores Enter and arrows. The minimum length counts grapheme clusters (F section 9). Enter with no active option submits the typed text, so a scanner that ends with Enter works.
- Dialog closing is always a request (`onOpenChange(false)`), so a screen with unsaved input can keep it open and ask first (F section 3 rule 2). The gallery demonstrates this with a nested confirm dialog.
- Only the top-most overlay reacts to Escape and outside presses (overlay stack), so a combobox list inside a dialog closes first.
- Floating UI is used for positioning only (allow-list in ADR-022 section 8). Popups render inline with fixed positioning so they stay inside a dialog's focus trap.
- Icons are imported per glyph from `@phosphor-icons/react/dist/csr/*`: the package root's type declarations do not resolve under NodeNext, and this also tree-shakes.

## Bugs found by the real browser (and fixed)

| Bug                                                      | Cause                                                                                                                                                                   | Fix and guard                                                                                                                      |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Focus did not return to the opener after a dialog closed | Cleanup order: the focus trap handed focus back while the page was still `inert`, and browsers refuse `focus()` on inert nodes. jsdom does not, so the unit test passed | `useInertOutside` is declared before the focus trap; a regression test records whether the opener was inert at the moment of focus |
| Axe "region" violation with a toast visible              | Toast list sat outside any landmark                                                                                                                                     | The list is inside a labelled `section` region                                                                                     |

The first one is why ADR-022 requires a browser check per primitive and not only jsdom.

## Verification

| Command                                      | Result                                                                                                                                                                       |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm --filter @hms/config-eslint test`      | 16 passed; mutation check (raw-widget selector disabled) failed 5, restored                                                                                                  |
| `pnpm --filter @hms/ui test`                 | 121 passed (18 files)                                                                                                                                                        |
| `pnpm --filter @hms/web test:e2e`            | 11 passed (axe on the gallery, with the dialog open and with a toast; keyboard flows for dialog, menu, tabs, combobox; Bangla query; phone width has no horizontal overflow) |
| `pnpm turbo run lint typecheck build test`   | 50 of 50 tasks passed (contracts 7, config-eslint 16, kernel 2, database 14, ui 121, platform 6, identity 42, api 11 tests)                                                  |
| `pnpm boundaries:check`                      | No violations                                                                                                                                                                |
| Visual pass in Chromium at 1366 and 390 wide | Bangla names shape correctly, no overflow, focus ring and overlay shadow as designed                                                                                         |

## Known limitations

- No exit animations (overlays unmount immediately); entry motion is a short fade and 0.97 scale, removed for reduced motion.
- Tooltip, Select (listbox), Checkbox, Radio, Switch and DateField are not built yet.
- The Combobox keeps its own display text; a controlled `value` does not rewrite the text from a later option list.
- The Menu and Combobox popups use fixed positioning and do not portal; inside an element with a CSS transform they could mis-position.
- The gallery contains English demo strings (no i18n catalogs exist yet); Bangla sample names use escapes.
- `packages/i18n` formatters (lakh and crore) are the next task, T-I18N-01.
- Tiro Bangla and Geist were only viewed on a high-density screen; low-resolution 1366x768 monitors still need a check.
- `apps/web` has no favicon (a 404 in the console).

## How to debug

- A keyboard behavior breaks: read the contract in the primitive's file header, then its test; reproduce in the gallery at `/dev/ui` with `pnpm --filter @hms/web dev`.
- Focus is lost after closing an overlay: check hook order in the component (cleanups run in declaration order) and whether anything is still `inert`.
- A lint rule fires in `apps/web`: the message names the replacement; rules and their tests are in `packages/config-eslint`.
- The browser tests use the built `@hms/ui`: run `pnpm --filter @hms/ui build` (or `pnpm turbo run build`) before `pnpm --filter @hms/web test:e2e`, or you test stale code.
- The contrast test names the failing token pair; fix the token, not the test.
