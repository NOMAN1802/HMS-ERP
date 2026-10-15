---
name: Hospital ERP Design System
description: Calm clinical utility for bilingual hospital desks; one teal primary, six status colors, built entirely in-house.
---

<!-- SEED: established with the user before implementation; re-run $impeccable document once there's code to capture the actual tokens and components. -->

# Design System: Hospital ERP

## Overview

**Creative North Star: "The Quiet Front Desk"**

A good front desk never makes the patient wait for the software. The interface is that desk: everything within reach, nothing shouting, the next action obvious. Surfaces are calm and neutral, text is high-contrast, and color is a small, trustworthy vocabulary: teal means "you can act here", and the six status colors say what state a thing is in. Density rises only where people scan long lists or type many values: worklists and the lab result-entry grid.

It is designed Bangla first, then checked in English, because Bangla strings run longer and need more line height; a layout that survives Bangla survives English. Screens are keyboard-first on desktop and touch-first on tablet and phone, with the same components and tokens at every size.

The world rejects: photographic heroes and decoration at a workstation, brand colors that collide with status colors (the logo's red and green), color as the only carrier of meaning, and any one-off widget or color written outside the shared system.

**Key Characteristics:**

- Calm clinical utility; the data is the interface.
- One primary, one small accent, six status colors by meaning.
- Bangla first; one font stack for both languages.
- Three device tiers from one set of components.
- Everything built in-house and reused: tokens, hooks, primitives, layouts, patterns.

**Motion grammar.** Motion confirms, it never decorates. Nothing animates on keyboard-initiated actions (focus search, row navigation, shortcuts). Press feedback is a `scale(0.97)` at 160 ms; dialogs and popovers use 150 to 200 ms ease-out and scale from their trigger; entry never starts from `scale(0)`. Reduced motion removes movement and keeps opacity changes.

## Colors

A tinted-neutral system with one primary. Values below are the established seed (measured from Tailwind 4.3.3 and recorded in ADR-022 section 2); the token CSS in `packages/ui` becomes the single source once it exists.

### Primary

- **Clinical Teal** (teal-700 `#00786f`): filled primary buttons, links, the active nav item, selected state. 5.4:1 with a white label. Pressed and hover is **Deep Teal** (teal-800 `#005f5a`); soft fills such as a selected row use **Teal Mist** (teal-50 `#f0fdfa`). The focus ring is teal-600 `#009689` (3.5:1 on the page background).

### Secondary

- There is no secondary hue. **Secondary is a button style**: a white surface, a strong neutral border, dark text, and a light grey fill on hover. Cancel, back and "not this" use it.

### Tertiary

- **Signal Cyan** (cyan-700 `#007595`, 5.3:1 on white), the accent. Used only for the second series in dashboard charts, the "New" marker and shortcut-key chips. It is 37 degrees from teal and 41 from blue, so it never carries meaning alone and is never a button, status or link.

### Neutral

- **Mist 50** (`#f9fbfb`): page background. **White**: data surfaces (cards, inputs, tables) so print preview matches the screen.
- **Mist 200** (`#e3e7e8`): decorative dividers and card edges. **Mist 500** (`#67787c`, 4.6:1 on white and 4.5:1 on the page background): input and outlined-button borders.
- **Mist 900** (`#161b1d`): body text (16.7:1). **Mist 600** (`#4b585b`): secondary text (7.4:1). **Deep Teal Ink** (teal-950 `#022f2e`): headings (14.5:1). No pure black or pure white text.

### Status (soft fills, text and icon in the dark shade)

- **Idle** grey (`#f1f3f3` / `#22292b`): not started or closed.
- **Active** blue (`#dbeafe` / `#193cb8`): under way.
- **Review** purple (`#f3e8ff` / `#6e11b0`): held at a person's checkpoint.
- **Attention** amber (`#fef3c6` / `#973c00`): blocked until someone acts (money, cleaning).
- **Done** green (`#dcfce7` / `#016630`): done, ready, OK.
- **Problem** red (`#ffe2e2` / `#9f0712`): a problem or money owed.
- **Danger action** red-700 (`#c10007`, 6.4:1 with white): destructive buttons only.

### Named Rules

**The One Meaning Rule.** Teal means "you can act here" and nothing else. A status is never teal, and an actionable thing is never a status color.

**The Word Beside The Color Rule.** Every badge carries a word and an icon; the icon uses the badge's text color (the lighter shades fail 3:1 on their fills). Paper is monochrome, so the word always prints.

**The Logo Quarantine Rule.** The Bytespate mark (pure red, green) never sits beside status badges; it lives in the shell header, login card and print headers.

**The Dark Is Off Rule.** Light and dark token files both exist, but dark applies only through an explicit `data-theme="dark"` until it is reviewed, never from the system preference.

## Typography

**Heading Font:** TikTok Sans (English), Noto Sans Bengali (Bangla)
**Body Font:** Geist (English), Tiro Bangla (Bangla)
**UI Font:** Geist (English), Noto Sans Bengali (Bangla)

**Character:** Modern, even and quiet. The Noto Sans family supplies every weight the interface needs in Bangla; Tiro Bangla, a single-weight serif, is reserved for reading text. One stack serves both languages, so a switch never swaps families and a line mixing a Bangla name with an English name sets correctly.

### Hierarchy

- **Display / Headline / Title**: heading font. Sizes and weights: `[to be resolved in T-UI-01]`.
- **Body**: body font, 16 px, line height 1.6 for Bangla, about 1.5 for English; maximum line length about 70 characters.
- **Label / Table header / Button / Badge / Input / Money / MRN**: UI font, medium weight. Money and MRN use tabular figures; whether Geist and the Bengali digits align in columns is a T-UI-01 check.
- **Compact (worklists)**: one step smaller, `[size to be resolved in T-UI-01]`.

### Named Rules

**The No Faux Bold Rule.** `font-synthesis: none`. Anything that needs weight is set in the Noto Sans family, never in Tiro Bangla.

**The Longer Bangla Rule.** Components are sized and reviewed for strings about 30 percent longer than English; buttons never truncate a critical word and table headers wrap.

## Layout

Three tiers on Tailwind's default breakpoints: phone below 768, tablet 768 to 1279, desktop 1280 and up. Design widths are 360, 768 and 1366 minimum.

- **Desktop:** 240 px collapsible sidebar plus a top bar (hospital and facility, `/` search, language, user menu). Split panes, compact tables, content capped at the 2xl width instead of stretching.
- **Tablet:** 72 px icon rail plus the same top bar; list and detail one pane at 768, split at 1024.
- **Phone:** top bar with search and a bottom tab bar (at most five role items plus More); tables become stacked rows. Tasks that must not be done on a phone show a plain "Use a tablet or computer" panel.
- **Patient context:** a sticky patient banner under the top bar.
- **Rhythm:** 4 px grid; rows 32 px compact and 40 px comfortable; 44 px touch targets on phone and tablet.
- **Search first:** one prominent search (`/`) on the front desk with a row of four quick actions beneath it (New registration, Check in, Take payment, Print token), each with its shortcut shown.
- All breakpoint behavior lives in layout components; screens never write it.

## Elevation & Depth

`[Proposed default, not yet confirmed with the product owner]` Flat by default and tonal: depth comes from the white data surface on the Mist 50 page and from borders, not shadows. Shadows appear only on overlays (dialog, popover, menu, toast), tinted to the background hue and never pure black. Exact values `[to be resolved in T-UI-01]`.

## Shapes

One radius scale: inputs and buttons 6 px, cards and panels 8 px, pills only for status badges. Borders are 1 px. No decorative hairlines, rotated labels or ornament; no pill buttons.

## Do's and Don'ts

### Do:

- Review every screen in Bangla first, then English, at phone, tablet and desktop.
- Take every color, size, widget and formatter from `packages/ui` and `packages/i18n`.
- Give every status a word and an icon; give every primitive a keyboard contract and an axe check.
- Show "Not set up for this hospital" when a feature is unavailable.

### Don't:

- Write a color literal, a raw `button` or `input`, or a shell breakpoint in `apps/web`.
- Use orange, yellow, indigo or any hue within 21 degrees of a status color.
- Use the native `dialog`, Popover API or native date picker, or a styled component kit.
- Animate keyboard-initiated actions, or rely on a toast for critical information.
- Put the logo beside a status badge, or fabricate hospitals, customers or testimonials in demo content.
