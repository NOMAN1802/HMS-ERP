# ADR-007 — Money representation and rounding

- **Status:** PROPOSED (P-011). Rounding rules OPEN (Q-020).
- **Date:** 2026-10-12
- **Approver:** Finance reviewer + tech lead

## Context

Source complaints include totals that disagree and implicit fraction adjustments (SRC-B05). Browser floating-point totals must never be authoritative (v0.3 DATA). Currency is BDT with 2 minor digits (AS-001).

## Decision

- **Storage:** PostgreSQL `numeric(18,2)` for amounts, plus `currency char(3)` (default `BDT`) on invoices and payments. CHECK constraints for sign rules (e.g., payment amount > 0).
- **Domain arithmetic:** a `Money` value object in `domain-kernel` holding a `bigint` of minor units and a currency.
  - Conversion from or to the Prisma `Decimal` happens only in repositories.
  - Mixing currencies throws.
- **Transport:** decimal strings (`"500.00"`), never JSON numbers.
- **Rounding:** none, unless a configured policy (CP-07) requires it. When a policy exists, rounding produces an **explicit adjustment line** with its own source reference (SRC-B05), never a silent change to a line amount.
  - Percentage computations (when discounts exist) specify rounding mode and the level it applies at (line or invoice) in the policy version.
- **Quantities** (medicine, reagent) use `numeric(14,3)` with a unit code. Conversions are OPEN (Q-014).

## Alternatives

| Alternative | Comment |
| --- | --- |
| `bigint` minor units in the database | Equally exact. Less readable in SQL and reports. Preferable if multi-currency with differing minor units arrives. |
| `decimal.js` everywhere | Fine, but easy to leak floats when mixed with numbers. The bigint value object makes misuse a type error. |
| PostgreSQL `money` type | Locale-dependent formatting. Not recommended. |

## Consequences

Agents must use `Money` helpers. A lint rule forbids arithmetic on raw `number` fields named `amount|total|balance` in domain packages.

## Evidence required

- Property-based unit tests: allocations sum exactly; no float paths.
- An AT-BIL test that detail equals summary across 10,000 synthetic invoices.
