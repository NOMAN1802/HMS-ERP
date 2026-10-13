# C08 — Hospital pharmacy: dispensing, returns, medicine catalogue

| Control | Value |
| --- | --- |
| Module | `mod-pharmacy` (catalogue, dispensing, return acceptance, pharmacy worklists). Stock movements are recorded through `mod-inventory`; charges through `mod-billing`. |
| Version | 0.4.0-draft |
| Status | Internal/external fulfilment CONFIRMED (C-012). Stock/return operations SOURCE-DERIVED. Substitution, units, batch selection, partial dispensing, reservation and payment gate OPEN. |
| Domain reviewer | Chief pharmacist + finance |
| Sources | C-012; SRC-S01, SRC-B03, SRC-N01, SRC-N08, SRC-N11; v0.3 PHARMACY |

## 1. Purpose and scope

Dispense medicines from the hospital pharmacy against prescriptions (OPD) and indents (IPD). Each dispense:
- records actual batch and quantity
- moves stock exactly once
- posts charges exactly once

Accept returns with reconciled quantities. Outside fulfilment never moves stock.

**Interim boundary for the first pharmacy slice** (when built, RP-B):
- exact prescribed items only
- base units only
- staff-chosen batch
- no substitution
- no reservation
- no walk-in POS

## 2. Requirements

| ID | Requirement | Status | Verify | Source |
| --- | --- | --- | --- | --- |
| FR-PHA-001 | A prescription line fulfilled `EXTERNAL` shall never create a dispense, stock movement or pharmacy charge. | CONFIRMED | T | C-012 |
| FR-PHA-002 | Each dispense line shall record medicine, batch, expiry, quantity (base unit), store, dispenser and time, and link to:<br>• the prescription line or indent line<br>• the stock movement<br>• the charge<br>A retried dispense creates one movement and one charge. | SOURCE-DERIVED | T | SRC-S01 |
| FR-PHA-003 | Payment gate:<br>• OPD dispense requires eligible payment for the pharmacy charge lines (pay before issue)<br>• IPD dispense posts to the admission running account<br>**Disabled until confirmed** (CP-20, Q-015). | OPEN (Q-015) | T | — |
| FR-PHA-004 | The pharmacist shall dispense from a pharmacy request (prescription with `HOSPITAL_PHARMACY` fulfilment) or a ward indent, selecting the quantity per line in the base unit. Pack/unit conversions are OPEN (Q-014). | CONFIRMED capability; units OPEN | T | SRC-S01 |
| FR-PHA-005 | Batch selection is by the pharmacist from batches in stock. A batch past its expiry date (facility timezone date) shall be blocked (`BATCH_EXPIRED`). Automatic FEFO suggestion is OPEN (Q-014). | Expiry block PROPOSED fixed safety rule; FEFO OPEN | T | SRC-S01 |
| FR-PHA-006 | Substitution (generic/brand). | **OPEN (Q-014).** Not available. | — | — |
| FR-PHA-007 | Accepting a return requires `pharmacy.return.accept`. The accepted quantity per line must not exceed the eligible issued quantity (issued − already accepted returns). Acceptance creates a stock movement back into a store, with a reason for non-accepted quantity. Credit posting follows CP-21 (Q-018). | SOURCE-DERIVED; sequence OPEN | T | SRC-N01, SRC-N11, SRC-B03 |
| FR-PHA-008 | Partial dispensing (less than requested, the rest outstanding). | OPEN (Q-014). Interim: a line can be issued in parts, and the outstanding quantity remains visible on the request. | T | — |
| FR-PHA-009 | Stock reservation at prescription or indent time. | OPEN (Q-014). Not available; stock is checked at dispense. | — | — |
| FR-PHA-010 | Point-of-sale to walk-in (unregistered) customers. | OPEN (Q-058) | — | SRC-S01 |
| FR-PHA-011 | Medicine catalogue: medicine (brand), generic, strength, form, manufacturer, supplier links, base unit, pack definition (informational until Q-014), bn/en names, active flag. | SOURCE-DERIVED | T | SRC-S01 |
| FR-PHA-012 | "Credit collection" (SRC-S01). | OPEN: its meaning must be confirmed (patient credit sales? collection of dues?) | — | SRC-S01 |
| FR-PHA-013 | Concurrent dispenses shall never take a batch below zero (FR-INV-003). The second dispense receives `INSUFFICIENT_STOCK`. | CONFIRMED (C-029) | T | v0.3 PHARMACY |

## 3. Use cases

### UC-PHA-01 Dispense against a ward indent (IPD, when enabled)

1. The pharmacist opens the indent from the worklist.
2. For each line, choose the batch and quantity.
3. Confirm. One transaction per dispense:
   - dispense lines
   - stock movements (out of the pharmacy store)
   - charge requests (`sourceRef = (PHARMACY, dispense_line, id, ISSUED)`)
   - indent line status update
   - audit and outbox
4. Print the issue slip.

**Denied paths:**
- D1: expired batch → `BATCH_EXPIRED`.
- D2: insufficient stock → `INSUFFICIENT_STOCK`.
- D3: no permission → SP-04.

### UC-PHA-02 Accept a medicine return

1. Open the return (C07 UC-NUR-02).
2. Enter accepted quantities and reasons.
3. Confirm. This creates the return-in stock movements, the return status, and a credit request (when CP-21 allows).

## 4. Acceptance examples

```gherkin
Scenario: Outside fulfilment creates no stock movement (FR-PHA-001)
  Given prescription line "Amoxicillin 500 mg x21" with fulfilment EXTERNAL
  When the visit is completed
  Then no dispense, stock movement or pharmacy charge exists for that line

Scenario: Two-line dispense posts once (FR-PHA-002)
  Given indent IND-301 for A-12 with Ceftriaxone x4 and Omeprazole x10
  When the pharmacist dispenses both lines and the request is retried after a timeout
  Then two stock movements and two charge lines exist, not four

Scenario: Accepted return cannot exceed issued (FR-PHA-007)
  Given Paracetamol x20 issued and x5 already accepted as returned
  When a return of x16 is accepted
  Then VALIDATION_FAILED is returned (maximum returnable is 15)

Scenario: Expired batch blocked (FR-PHA-005)
  Given batch B-77 expired on 2026-10-31
  When the pharmacist selects B-77 on 2026-11-01 (Asia/Dhaka)
  Then BATCH_EXPIRED is returned
```

## 5. Traceability

| Requirement | Decision / source | Command | Data | Permission | Tests |
| --- | --- | --- | --- | --- | --- |
| FR-PHA-001 | C-012 | `SignPrescription` (no stock effect) | `prescription_line.fulfilment` | — | AT-PHA-001 |
| FR-PHA-002, -013 | SRC-S01 | `DispenseMedicines` | `dispense_line`, `stock_movement`, `charge` | `pharmacy.dispense` | AT-PHA-002..004 |
| FR-PHA-005 | SRC-S01 | `DispenseMedicines` | `batch.expiry_date` | — | AT-PHA-005 |
| FR-PHA-007 | SRC-N11 | `AcceptMedicineReturn` | `medicine_return_line`, `stock_movement` | `pharmacy.return.accept` | AT-PHA-006, AT-PHA-007, UAT-PHA-002 |

## 6. Gaps and open questions

- Q-014 substitution, units, FEFO, partial dispensing, reservation, post-discharge returns
- Q-015 payment gate
- Q-018 credit sequence
- Q-058 walk-in POS
- "credit collection" meaning (folded into Q-058 for discussion)
- Q-067 catalogue structure
