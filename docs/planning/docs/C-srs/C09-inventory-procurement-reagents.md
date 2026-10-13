# C09 — Inventory, procurement and reagents

| Control | Value |
| --- | --- |
| Module | `mod-inventory` (items, units, batches, stores, stock movements, transfers, adjustments, procurement, reagents) |
| Version | 0.4.0-draft |
| Status | Movement-based stock design PROPOSED. Workflows SOURCE-DERIVED. Valuation, negative stock, approval levels and reagent consumption OPEN. Procurement and reagents are **GAP**-level specifications. |
| Domain reviewer | Store manager + finance + lab manager (reagents) |
| Sources | SRC-S02, SRC-S03, SRC-S04, SRC-L11; v0.3 INVENTORY_REAGENTS |

## 1. Purpose and scope

Keep a trustworthy stock ledger for pharmacy, lab reagents, OT and general stores. Quantities change **only** through recorded movements:
- opening balance
- receipt
- issue/dispense
- return
- transfer out/in
- approved adjustment
- consumption

Procurement (requisition → PO → approval → GRN) and reagent mapping are captured at the level the sources support, with gaps listed.

## 2. Requirements

| ID | Requirement | Status | Verify | Source |
| --- | --- | --- | --- | --- |
| FR-INV-001 | Support requisition, purchase order, approval, goods receipt (GRN), purchase return, store-to-store transfer and internal indent/return workflows. | SOURCE-DERIVED (v0.3) | T | SRC-S02, SRC-S03 |
| FR-INV-002 | Every stock change shall be an append-only movement with item, batch, store, signed quantity (base unit), movement type, source document reference, actor and time. The on-hand balance is derived from movements (with a maintained balance projection updated in the same transaction). | PROPOSED (P-013) | T | v0.3 DATA |
| FR-INV-003 | A movement shall never make a batch's on-hand quantity negative in a store (`INSUFFICIENT_STOCK`). | PROPOSED fixed rule; confirm (Q-063) | T | v0.3 INVENTORY |
| FR-INV-004 | Opening balances and adjustments require a request (reason, counted quantity) and an approval by a different user (`inventory.stock.adjust.approve`). Approval creates the adjustment movement. | SOURCE-DERIVED; limits OPEN (Q-063) | T | SRC-S02 |
| FR-INV-005 | A transfer has dispatch (stock leaves the source; shown "in transit") and receipt (stock enters the destination). The received quantity can differ, with a reason; the discrepancy is visible. | SOURCE-DERIVED | T | SRC-S02 |
| FR-INV-006 | A physical count produces count sheets. Variances become adjustment requests (FR-INV-004), never silent overwrites. | SOURCE-DERIVED | T | v0.3 INVENTORY |
| FR-INV-007 | Units and pack conversions. | OPEN (Q-014, Q-063). Base units only in the interim. | — | — |
| FR-INV-008 | Requisition → PO → approval. | SOURCE-DERIVED capability; approval levels OPEN (Q-064). **GAP.** | — | SRC-S03 |
| FR-INV-009 | GRN against a PO creates receipt movements with batch, expiry and quantity. A repeated GRN submission with the same delivery reference increases stock once. | SOURCE-DERIVED | T | SRC-S03 |
| FR-INV-010 | Controlled receipt without PO. | OPEN (Q-064) | — | SRC-S03 |
| FR-INV-011 | Purchase returns to the supplier. | SOURCE-DERIVED capability; rules **GAP** | — | SRC-S03 |
| FR-INV-012 | Batches record lot number, expiry date and supplier. Expired batches are blocked for issue (FR-PHA-005) and listed in an expiry report. | SOURCE-DERIVED | T | SRC-S01 |
| FR-INV-013 | Inventory valuation (cost, FIFO/weighted average) and financial postings. | OPEN (Q-063, Q-029). **GAP.** | — | — |
| FR-REA-001 | Reagent configuration: reagent item, analyzer, unit of measure, and test-to-reagent mapping (quantity per test run). | SOURCE-DERIVED; rules OPEN (Q-065) | U | SRC-S04 |
| FR-REA-002 | Reagent consumption posting from test runs or manual consumption entries. | OPEN (Q-065). **GAP.** | — | SRC-S04 |
| FR-REA-003 | Reagent stock, purchase and consumption reports; consumption summary filters return data (SRC-L11). | SOURCE-DERIVED | T | SRC-S04, SRC-L11 |

## 3. Acceptance examples

```gherkin
Scenario: GRN retried increases stock once (FR-INV-009)
  Given PO-12 for 100 boxes of gloves
  When GRN with delivery reference "DLV-5531" for 100 boxes is submitted twice
  Then on-hand increases by 100 once

Scenario: Concurrent issues respect available stock (FR-INV-003)
  Given batch B-10 has 5 units in the pharmacy store
  When two dispenses of 4 units each are confirmed at the same moment
  Then exactly one succeeds and the other returns INSUFFICIENT_STOCK
  And on-hand is 1

Scenario: Transfer discrepancy is visible (FR-INV-005)
  Given main store dispatches 50 units to the ward store
  When the ward store receives 48 with reason "2 damaged in transit"
  Then the transfer shows dispatched 50, received 48, discrepancy 2 with reason
```

## 4. Traceability

| Requirement | Command | Data | Permission | Tests |
| --- | --- | --- | --- | --- |
| FR-INV-002, -003 | `PostStockMovement` (internal) | `stock_movement`, `stock_balance` | — | AT-INV-001..003, AT-DB-004 |
| FR-INV-004, -006 | `RequestAdjustment`, `ApproveAdjustment` | `stock_adjustment` | `inventory.stock.adjust.*` | AT-INV-004 |
| FR-INV-005 | `DispatchTransfer`, `ReceiveTransfer` | `stock_transfer` | `inventory.transfer.*` | AT-INV-005 |
| FR-INV-009 | `ReceiveGoods` | `goods_receipt` | `inventory.grn.receive` | AT-INV-006 |

`inventory.grn.receive` (default: store keeper) is listed in the [permission catalogue](C00-srs-overview.md#8-permission-catalogue-and-approval-responsibilities). Purchase-order permissions (`inventory.po.create`, `inventory.po.approve`) will be added when Q-064 is answered.

## 5. Gaps (explicit)

Procurement approvals, receipt without PO, purchase returns, valuation, reagent consumption rules and finance integration are not specified enough to implement. Before any procurement task becomes ready:
- answer Q-063, Q-064 and Q-065
- provide sample documents (PO, GRN, requisition formats)
