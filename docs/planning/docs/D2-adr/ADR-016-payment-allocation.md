# ADR-016 — Line-level payment allocation capability

- **Status:** PROPOSED (P-020). The allocation **policy** is OPEN (Q-004, Q-024).
- **Date:** 2026-10-12
- **Approver:** Finance reviewer

## Context

- Payment-first is checked per service (C-011).
- A service invoice can contain several services with different eligibility (FR-BIL-003).
- Recording allocations only at invoice level would make per-service eligibility ambiguous, or would force an allocation order to be invented.

## Decision

- `payment_allocation` rows reference an **invoice line** (and, through it, the invoice). For IPD running accounts, allocation may reference the account invoice as a whole (`invoice_line_id` null, `invoice_id` set) while IPD per-service gates are not required.
- **Interim UI rule:** the cashier explicitly chooses lines, with full-line pre-selection (FR-BIL-012).
- `invoice_line.allocated_amount` is maintained transactionally, with `CHECK (allocated_amount <= net_amount)`.
- **Once Q-004 is answered,** an allocation *policy* (e.g., ordered auto-allocation, deposit pools) is added as configuration without changing the storage model.

## Alternatives

- **Invoice-level allocation with computed line coverage by a fixed order.** That would invent a business rule. Rejected.
- **Deposit account as the only intermediary.** Possible later (Q-040). It fits the same model as an additional allocation target.

## Consequences

- Receipts can list exactly which services were paid.
- Eligibility is unambiguous.
- Slightly more cashier interaction until a policy allows auto-allocation.

## Evidence required

AT-BIL-004..007, AT-BIL-013.
