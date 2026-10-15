# T-UI-01 (decisions): UI foundation

- **Date:** 2026-10-15
- **Commit:** this commit
- **Implements:** task T-UI-01 (decision part only, no code), NFR-UX-001, NFR-ACC-001, FR-I18N-001, decisions C-052..C-060, ADR-022

## What was built

The visual and component foundation of the client was decided and written down. There is no application code yet: this entry records the decisions that the T-UI-01 spike and T-UI-02 app shell will implement. A developer can now open ADR-022 to find the tokens, breakpoints, fonts, component rules and reuse rules, and `PRODUCT.md` and `DESIGN.md` at the repository root for the product and visual context.

## Files

| File                                                 | Purpose                                                                                                                    |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `docs/planning/docs/D2-adr/ADR-022-ui-foundation.md` | The decision record: tokens, status colors, fonts, device tiers, shell, in-house components, reuse rules, branding, motion |
| `docs/planning/docs/D2-adr/README.md`                | ADR index row                                                                                                              |
| `docs/planning/docs/D2-adr/ADR-017-localization.md`  | Status line: items 3 and 5 amended by ADR-022                                                                              |
| `docs/planning/docs/A2-decision-register.md`         | New section 2.5 with C-052..C-060                                                                                          |
| `docs/planning/docs/F-ui-ux-design.md`               | Header, new section 2.3 (device tiers), fonts and digits in 7.4, design-system table in 12                                 |
| `docs/planning/docs/G-implementation-plan.md`        | T-UI-01 scope and acceptance now match ADR-022                                                                             |
| `docs/planning/CHANGES_AND_OPEN_DECISIONS.md`        | ADR row, summary and open items                                                                                            |
| `PRODUCT.md`                                         | Product record for design tooling (users, purpose, constraints, principles)                                                |
| `DESIGN.md`                                          | Seed visual-system record (north star, colors, type, layout, shapes, rules)                                                |

## Decisions applied

- The decision order was: device tiers, feel, color approach, themes, language order, component strategy, then breakpoints, phone scope, primary hue, fonts, status colors, accent, digit grouping, in-house components, branding.
- Primary is teal-700, not teal-600, because white text on teal-600 measures 3.66:1 and fails AA.
- The accent is cyan-700 because it was the only Tailwind hue at least 37 degrees from every hue already in use (teal, green, blue, purple, amber, red).
- Tiro Bangla is limited to reading text because Google Fonts offers only Regular and Italic for it; weighted text uses Noto Sans Bengali.
- Status tokens are named by meaning (idle, active, review, attention, done, problem), so a hue can change without touching screens.
- Reuse is a rule: layers tokens, hooks, primitives, layouts, patterns, screens, with lint rules and a contrast test required in T-UI-01.
- The Bytespate logo is a placeholder tenant logo; its red and green must not sit beside status colors.

## Verification

| Command                                                                                                    | Result                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Node script reading `apps/web/node_modules/tailwindcss/theme.css`, computing WCAG contrast (oklch to sRGB) | teal-700 5.39, teal-800 7.53, teal-600 3.66; cyan-700 5.3; red-700 6.4; status text 6.4 to 13.3; amber-600 and green-600 icons 2.9 on tint |
| Same script, hue angle and nearest-used-hue distance for 11 candidate families                             | cyan 37 degrees is the only candidate at least 27 degrees from all used hues (pink 27, then 21 or less)                                    |
| `curl` Google Fonts CSS API for each family and weight                                                     | Tiro Bangla ital 0;1 OK, wght 500 and 700 HTTP 400; TikTok Sans, Geist, Noto Sans Bengali OK                                               |
| Browser capture of apollohospitals.com at 1366 and 390 wide                                                | Patterns noted (search first, quick actions, bottom tabs); captures deleted, not committed                                                 |
| `pnpm exec prettier --check PRODUCT.md DESIGN.md`                                                          | All matched files use Prettier code style                                                                                                  |

## Known limitations

- No code: tokens CSS, `packages/ui` and the lint rules do not exist yet (T-UI-01, T-UI-02).
- `--color-border-strong` (mist-500 range) is not yet checked against 3:1.
- Tiro Bangla rendering at body size, Bengali digit alignment in money columns and Geist tabular figures are untested.
- Dark tokens are planned but not designed or reviewed.
- Elevation (shadow) values in `DESIGN.md` are a proposed default, not confirmed.
- The logo is raster only; no vector master exists.
- Icon family is Phosphor by default; Tabler is an accepted alternative pending confirmation.
- Bangla status labels still need native-speaker review (Q-050).

## How to debug

- If a screen disagrees with these decisions, ADR-022 wins over F where they differ; the token CSS wins over prose once it exists.
- To re-measure a color pair, read the value from `apps/web/node_modules/tailwindcss/theme.css` (values are `oklch`) and compute the WCAG ratio; the contrast unit test required by ADR-022 section 9 will automate this.
- If a font looks wrong, check the `--font-heading`, `--font-body` and `--font-ui` stacks first: Latin glyphs come from the first family and Bengali from the next, so a missing Bengali glyph means the Bengali family failed to load.
- If a hospital's brand clashes with the status colors, the fix is the tenant token override (not in RP-A), never a change to the status tokens.
