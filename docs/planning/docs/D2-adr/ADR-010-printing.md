# ADR-010 — Printing: browser print views plus server-side PDF

- **Status:** PROPOSED (P-014)
- **Date:** 2026-10-12
- **Approver:** Product owner, after printer UAT (Q-046)

## Context

- Staff print receipts, slips, labels and reports all day on A4, A5 and label printers (SRC-Q01, SRC-N12).
- Bilingual output is confirmed (C-025). Bangla needs correct shaping of conjuncts and vowel signs.
- Released documents must be reproducible (FR-LAB-003).
- "Print preview equals output" is a requirement (FR-PRN-001).

## Decision

1. **Desk printing:** HTML print views rendered by the web app from the committed record version and template version. CSS `@page` sets size and margins. The browser print dialog sends the job to the workstation's installed printer. Self-hosted Noto Sans Bengali and Noto Sans fonts are used.
2. **Archived and delivered documents** (released lab reports, final bills, exports, portal downloads): the worker renders the **same HTML template** to PDF with headless Chromium in an isolated `pdf-renderer` container (no internet egress). The PDF is stored in object storage with its hash and referenced by version.
3. **Labels:** HTML at exact label size via `@page`. If a label printer cannot be driven reliably this way, a direct-print method (e.g., printer language over a local agent) is an OPEN option. It is not assumed.
4. Every print creates a `print_event`. Printing never changes business state (FPR-07).

## Alternatives

- **PDF libraries** (pdfmake, PDFKit). Bangla shaping is unreliable without a full shaping engine. Rejected for bilingual output.
- **Report designers** (JasperReports and similar). Heavy JVM tooling, separate template language.
- **Client-side PDF generation.** Inconsistent across browsers.

## Consequences

- One template language (HTML/CSS) for screen preview, print and PDF.
- Chromium memory use needs a concurrency limit (`pdf-render` concurrency 2, PROPOSED).
- Browser print margins and headers vary, so UAT on real printers is mandatory (I §5).

## Evidence required

- Spike T-PRN-01 renders a bilingual receipt and a lab report to PDF with correct Bangla shaping. Native-speaker review.
- UAT-PRN-* on pilot printers.
