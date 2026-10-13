# C07 — Nurse station: worklists, indents, medicine returns

| Control | Value |
| --- | --- |
| Module | `mod-nursing` (worklist views, indents, return requests). Pharmacy owns issue and acceptance; billing owns credit. |
| Version | 0.4.0-draft |
| Status | Staff requirements SOURCE-DERIVED (S3 nurse feedback, all 12 items). Bed history CONFIRMED (C-015). MAR scope, return sequence and cancellation stages OPEN. |
| Domain reviewer | Nursing superintendent + chief pharmacist |
| Sources | SRC-N01..N12; C-012, C-015; v0.3 NURSING |

## 1. Purpose and scope

Give ward nurses an accurate, current list of their patients, with location, discharge status and permitted lab reports. Let them request and return medicines in batches, with records that both nursing and pharmacy can see. This removes the "missing paper" disputes (SRC-N11).

**Out of scope until decided:**
- medication administration record (MAR) (Q-016)
- observations/vitals content (Q-070)
- care plans

## 2. Actors

Nurse, ward in-charge, pharmacist (counterpart), doctor (reader).

## 3. Requirements

| ID | Requirement | Status | Verify | Source |
| --- | --- | --- | --- | --- |
| FR-NUR-001 | The nurse worklist shall list, for the nurse's ward scope:<br>• `ACTIVE` admissions<br>• Daycare stays<br>• patients medically discharged but not departed (clearly marked)<br>Each row shows bed, name, MRN, age/sex, doctor and alerts. Released lab reports for these patients open from the list. | SOURCE-DERIVED | T, U | SRC-N03, SRC-N04, SRC-N06 |
| FR-NUR-002 | Medicine indents and returns shall support multiple lines per request, safe quantity edits and a visible return slip. | SOURCE-DERIVED (v0.3) | T | SRC-N08, SRC-N09, SRC-N11 |
| FR-NUR-003 | The nurse's ward scope comes from the membership's department/ward scope (FR-ACC-008). Assignment by shift is OPEN. | PROPOSED | T | — |
| FR-NUR-004 | An indent is a multi-line request: medicine, quantity in the base unit, optional note.<br>• Lines can be added, edited or removed while the indent is `SUBMITTED` and the line is not yet issued.<br>• Editing one line's quantity changes only that line (line-level version), never the whole indent.<br>• A line already issued cannot be edited. A correction uses a return. | SOURCE-DERIVED | T | SRC-N08, SRC-N09 |
| FR-NUR-005 | A medicine return is a multi-line request referencing the issue lines being returned, with quantity and reason. On submission it gets a number and a printable **return slip**. Both nursing and pharmacy see its status:<br>• `SUBMITTED`<br>• `ACCEPTED` / `PARTIALLY_ACCEPTED` / `REJECTED` (pharmacy, with accepted quantities and reasons)<br>• `CREDITED` (billing posted the credit) | SOURCE-DERIVED; credit sequence OPEN (Q-018) | T, U | SRC-N01, SRC-N11 |
| FR-NUR-006 | Returns after medical discharge or departure shall be recordable and visible (SRC-N01). Whether they are accepted and credited after the final bill is OPEN (Q-014, Q-018). Interim: before the final bill → normal flow; after the final bill → recorded as `SUBMITTED` and routed to a supervisor queue; no credit is posted automatically. | SOURCE-DERIVED; policy OPEN | T | SRC-N01 |
| FR-NUR-007 | A nurse may **request** cancellation of a mistaken order (e.g., the X-ray Chest A/P case). The request goes to the authorized approver. Execution follows FR-ORD-006 and Q-017. | SOURCE-DERIVED; stages OPEN | T | SRC-N07 |
| FR-NUR-008 | Medication administration recording (MAR). | **OPEN (Q-016).** Not implemented. | — | v0.3 NURSING |
| FR-NUR-009 | Bed and patient labels shall print correctly on the first attempt from committed data (FR-PRN-003). Reprint is available. | SOURCE-DERIVED | U | SRC-N12 |
| FR-NUR-010 | Nursing observations/vital signs. | **OPEN (Q-070).** Not implemented. | — | — |
| FR-NUR-011 | Discharged and departed patients shall be visually and textually distinct (status badge and text, not colour alone). | SOURCE-DERIVED | U | SRC-N06 |
| FR-NUR-012 | Long nursing sessions shall not hang or block re-login (handled by FR-ACC-003/005). Account-lock reasons are diagnosable (FR-ACC-004, FR-SUP-003). | SOURCE-DERIVED | T | SRC-N02, SRC-N10 |
| FR-NUR-013 | Bed changes are visible in the nurse worklist on the next refresh, with patient identity unchanged and transfer history viewable. | SOURCE-DERIVED | T | SRC-N05 |

## 4. Use cases

### UC-NUR-01 Create a batch indent

- **Actor:** nurse (`nursing.indent.manage`).
- **Normal path:**
  1. Select the patient (an admission in scope).
  2. Add several medicines with quantities, using type-ahead and Enter to add.
  3. Submit. The server creates indent `SUBMITTED` with lines.
  4. The pharmacy worklist shows it.
- **Alternative paths:**
  - A1: edit line 2's quantity from 10 to 6 → only line 2 changes (version-checked).
  - A2: remove line 3 before issue → line `CANCELLED`, others intact.
- **Denied paths:** D1: edit an issued line → `INVALID_TRANSITION` ("Already issued — use a return").
- **Recovery:** SP-01, SP-03.
- **Requirements:** FR-NUR-002, FR-NUR-004.

### UC-NUR-02 Return medicines

- **Normal path:**
  1. Select the admission and choose "Return medicines".
  2. The UI lists issued lines with returnable quantity (issued − returned − pending returns).
  3. Enter quantities and reasons for several lines.
  4. Submit. The return becomes `SUBMITTED`, and the slip prints.
  5. The pharmacist accepts (full or partial, with reasons) → `ACCEPTED`/`PARTIALLY_ACCEPTED`. Stock moves back (C08/C09).
  6. Billing posts credit lines for the accepted quantities, if CP-21 sequence applies → `CREDITED`.
- **Denied paths:** D1: quantity above returnable → `VALIDATION_FAILED`.
- **Recovery:** R1: disputed return → both sides open the same return record and slip number, with full history.
- **Requirements:** FR-NUR-005, FR-PHA-007, FR-BIL-030.

## 5. State machines

| Record | States |
| --- | --- |
| Indent | `DRAFT → SUBMITTED → PARTIALLY_ISSUED → ISSUED → CLOSED`; `SUBMITTED → CANCELLED` (no line issued) |
| Indent line | `OPEN → ISSUED` / `PARTIALLY_ISSUED`; `OPEN → CANCELLED` |
| Medicine return | `SUBMITTED → ACCEPTED / PARTIALLY_ACCEPTED / REJECTED → CREDITED` (credit step per Q-018) |

## 6. Acceptance examples

```gherkin
Scenario: Quantity edit preserves other lines (SRC-N09, FR-NUR-004)
  Given indent IND-301 has lines Ceftriaxone 1g x4, Paracetamol 500mg x20, Omeprazole 20mg x10, none issued
  When the nurse changes Paracetamol to 12
  Then IND-301 still has three lines with quantities 4, 12 and 10

Scenario: Return of two medicines is visible to both sides (SRC-N11, FR-NUR-005)
  Given admission A-12 was issued Ceftriaxone x4 and Paracetamol x20
  When the nurse submits return RET-88 for Ceftriaxone x1 and Paracetamol x5
  Then the pharmacy worklist shows RET-88 with both lines
  And the nurse can reprint slip RET-88
  When the pharmacist accepts Ceftriaxone x1 and Paracetamol x4 with reason "1 strip damaged"
  Then RET-88 is PARTIALLY_ACCEPTED and both sides see accepted quantities

Scenario: Discharged patient clearly identified (SRC-N06)
  Given A-12 is MEDICALLY_DISCHARGED and not departed
  When the nurse opens the ward list
  Then A-12 shows the text badge "Discharged — awaiting departure"
```

## 7. Traceability

| Requirement | Source | Command | Data | Permission | Tests |
| --- | --- | --- | --- | --- | --- |
| FR-NUR-001, -011, -013 | SRC-N03..N06 | `GetWardWorklist` | admission, bed_occupancy, lab_report | `nursing.worklist.view` | AT-NUR-001..003, UAT-NUR-001 |
| FR-NUR-004 | SRC-N08, N09 | `SubmitIndent`, `UpdateIndentLine` | `indent`, `indent_line` | `nursing.indent.manage` | AT-NUR-004, AT-NUR-005, UAT-NUR-002 |
| FR-NUR-005, -006 | SRC-N01, N11 | `SubmitMedicineReturn` | `medicine_return`, `medicine_return_line` | `nursing.return.submit` | AT-NUR-006..008, UAT-NUR-003, UAT-NUR-004 |
| FR-NUR-007 | SRC-N07 | `RequestOrderCancellation` | `order_cancellation_request` | `nursing.worklist.view` | AT-NUR-009 |

## 8. Gaps and open questions

- Q-016 MAR
- Q-018 return/credit sequence
- Q-014 post-discharge returns
- Q-017 cancellation stages
- **Q-070** Observation/vital-sign content and frequency
- Shift-based ward assignment
