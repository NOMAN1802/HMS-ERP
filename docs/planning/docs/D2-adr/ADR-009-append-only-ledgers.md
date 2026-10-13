# ADR-009 — Append-only posted facts with correction records

- **Status:** PROPOSED (P-013). The obligation is CONFIRMED (C-029).
- **Date:** 2026-10-12
- **Approver:** Finance and clinical reviewers

## Context

Source systems allowed editing and deleting released results and posted bills (CX-010). That caused disputes (SRC-N11) and audit gaps.

## Decision

These records are **insert-only** after posting:
- charges
- invoice lines once allocated
- payments and allocations
- payment-method corrections
- stock movements
- result versions once released
- clinical document versions once signed
- audit events

Corrections create new rows:
- `charge_adjustment`, reversal lines
- `payment_method_correction`
- amendment versions
- adjustment movements

Enforcement:
- `GRANT INSERT, SELECT` only, for `hms_app` on append-only tables
- status columns that may still change (e.g., `superseded_at`) live in separate small tables or columns with narrowly scoped UPDATE grants and triggers checking allowed transitions

## Alternatives

- **Soft delete flags.** Rejected for posted facts: they hide evidence.
- **Event sourcing for everything.** Powerful, but heavy for agents and reporting. Append-only ledgers are applied only where money, stock and clinical evidence demand them.

## Consequences

Projections such as invoice balance, stock balance and bed status are maintained transactionally and checked by reconciliation jobs. Reporting reads the ledgers directly.

## Evidence required

- A database test: `UPDATE` and `DELETE` on these tables fail for `hms_app`.
- Correction flows show the original plus the correction in reports.
