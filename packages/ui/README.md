# @hms/ui

The shared design system for the staff web app: tokens, behavior hooks, primitives. Everything is built in-house on semantic HTML (ADR-022). Feature screens in `apps/web` compose these and write no raw widgets, color literals or number/date formatting (enforced by lint, see `packages/config-eslint`).

## Use

```tsx
// once, in the app's global stylesheet, after `@import 'tailwindcss'`
@import '@hms/ui/styles.css';
@source '../../../packages/ui/src';
```

```tsx
import { Button, Dialog, Field, TextInput } from '@hms/ui';
```

Colors are Tailwind utilities generated from semantic tokens: `bg-primary`, `text-text-muted`, `border-border-strong`, `bg-status-done-bg`. Tailwind's default palette is removed on purpose. Light is the default theme; dark applies only with `data-theme="dark"`.

## Layers

| Layer          | Where             | Rule                                                                                                       |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------- |
| Tokens         | `src/styles/`     | The only place color literals live. A contrast test guards every pair                                      |
| Behavior hooks | `src/hooks/`      | No styling, no domain words                                                                                |
| Primitives     | `src/primitives/` | Built from hooks and tokens. No user-facing text of their own: labels come in as props, already translated |
| Icons          | `src/icons/`      | The only module that imports the icon library                                                              |

## Keyboard contracts

Each primitive documents its contract in its file header and proves it in its test and in `apps/web/e2e/ui-gallery.spec.ts`.

| Primitive | Contract                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button    | Enter and Space activate; `type="button"` by default; busy state blocks presses                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Dialog    | Focus moves in; Tab cycles inside; Escape (unless it belongs to an input method) and backdrop press request close; focus returns to the opener; page behind is inert and does not scroll                                                                                                                                                                                                                                                                                                           |
| Menu      | Enter, Space, click or ArrowDown opens on the first item, ArrowUp on the last; arrows, Home, End move; typing jumps; Escape closes and returns focus; Tab closes; disabled items skipped                                                                                                                                                                                                                                                                                                           |
| Tabs      | Roving tabindex; ArrowLeft and ArrowRight, Home and End move and select; disabled tabs skipped                                                                                                                                                                                                                                                                                                                                                                                                     |
| Combobox  | ArrowDown and ArrowUp open and move; Enter selects the active option, or submits the text when none is active (scanner); Escape closes, then clears; no query or key handling while an input method is composing, and Escape that belongs to the input method never closes an overlay; Enter and arrows never act on results hidden behind the loading state; the field always shows the selected option's label (also when the parent sets or clears it); minimum length counts grapheme clusters |
| Toast     | Announced through live regions; danger is assertive and stays until dismissed; timer pauses on hover and focus; never the only copy of critical information                                                                                                                                                                                                                                                                                                                                        |

## Add a primitive

1. Write the keyboard contract first (WAI-ARIA Authoring Practices pattern) in the file header.
2. Write the tests first (Testing Library, `userEvent`), watch them fail, then implement.
3. Take every color, size and motion value from tokens; no literals.
4. Pass user-facing text in as props; never hard-code a language.
5. Export it from `src/index.ts`, add it to the gallery in `apps/web/app/dev/ui/page.tsx`, and add its flow and axe check to the browser spec.
6. Behavior that touches focus or `inert` needs a browser test, not only jsdom (jsdom does not enforce `inert`).
