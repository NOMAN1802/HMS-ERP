# C03 — OPD consultation, clinical documents, service orders and prescriptions

| Control | Value |
| --- | --- |
| Module | `mod-clinical` (visits, consultations, clinical documents, orders, prescriptions) |
| Version | 0.4.0-draft |
| Status | Journey and the prescription/dispensing distinction CONFIRMED. Clinical content (fields, coding) OPEN. Order cancellation stages OPEN. |
| Domain reviewer | Medical director / senior OPD consultant |
| Sources | C-005, C-006, C-008, C-009, C-011, C-012, C-013, C-027; SRC-O02, SRC-O03, SRC-B01, SRC-N07; v0.3 OPD_CLINICAL, CLINICAL_SAFETY |

## 1. Purpose and scope

This module covers:
- the doctor's worklist
- consultation documentation with signed versions
- service orders (tests, imaging, procedures, other services) with their own billing gate
- prescriptions
- next-visit booking
- admission requests

It does **not** price or bill (C04), dispense (C08), or produce results (C05/C11).

**Clinical safety boundary (C-027, FPR-13):** the software records clinician decisions. It does not propose diagnoses, doses or orders.

## 2. Actors

Doctor; receptionist (direct diagnostic orders only); nurse (order requests in IPD, later); lab/radiology (consume orders).

## 3. Requirements

| ID | Requirement | Status | Verify | Source |
| --- | --- | --- | --- | --- |
| FR-ORD-001 | Reception may create orders only for tests configured as directly orderable (CP-01). Others are denied with reason `TEST_NOT_DIRECTLY_ORDERABLE`. | CONFIRMED | T | C-006 |
| FR-ORD-002 | Every order shall record:<br>• the authenticated requester, taken from the session and never from the client<br>• the requesting practitioner for clinician orders<br>• the source (`CONSULTATION`, `RECEPTION_DIRECT`, `WARD`, `EMERGENCY`)<br>• the visit or admission<br>• priority (routine/urgent, staff-chosen)<br>• clinical note (optional)<br>• the catalogue item and its version | CONFIRMED (v0.3 WORKFLOWS) | T | v0.3 |
| FR-ORD-003 | Creating an order shall request a charge from billing through the billing interface. Billing prices the order from the price list version in force and adds a line to the visit's service invoice (FR-BIL-009) or the admission's running account. The order does not write invoice tables. | CONFIRMED (ownership rule) | T, I | v0.3 MODULES |
| FR-ORD-004 | The order fulfilment lifecycle shall be separate from payment:<br>• `REQUESTED → IN_PROGRESS → COMPLETED`<br>• `REQUESTED → CANCELLED`<br>• `IN_PROGRESS → CANCELLED` (only per Q-017)<br>Payment eligibility is derived from billing (FR-BIL-003) and shown alongside, not stored as an order state. | PROPOSED | T | v0.3 DATA |
| FR-ORD-005 | Orders created after consultation shall pass through their own billing/payment gate. A paid doctor-fee invoice does not make later orders eligible. | CONFIRMED | T | C-008, C-011, v0.3 WORKFLOWS |
| FR-ORD-006 | Cancelling an order shall require `order.service.cancel` and a reason. **Interim rule:** allowed only while the order is `REQUESTED` and its invoice line has no allocated payment. Cancellation after payment or after work started is **not available** until Q-017 defines stages, approvals and financial reversal. | CONFIRMED (cancellation needed: SRC-N07); stages OPEN (Q-017) | T | SRC-N07 |
| FR-ORD-007 | Order items shall come from the service catalogue with corrected names and configured expected reporting time (SRC-O02). The expected report time is shown on the receipt and order slip. | SOURCE-DERIVED | T, U | SRC-O02 |
| FR-ORD-008 | Order entry shall support continuous keyboard entry: type-ahead search, Enter to add, a quantity field where applicable, and a list that keeps focus. No page reload between items (SRC-O02 continuous order-list navigation, SRC-B01). | SOURCE-DERIVED | U | SRC-O02, SRC-B01 |
| FR-CLI-001 | A prescription shall be distinct from dispensing. Creating or signing a prescription creates no stock movement and no pharmacy charge. | CONFIRMED | T | C-012 |
| FR-CLI-002 | The doctor's worklist shall list today's visits for the doctor's sessions with status:<br>• `EXPECTED` (booked, not arrived)<br>• `WAITING_PAYMENT` (checked in, doctor-fee invoice not eligible)<br>• `WAITING` (eligible)<br>• `IN_CONSULTATION`<br>• `CONSULTED`<br>Starting a consultation requires the doctor-fee invoice to be eligible under CP-02. | CONFIRMED (C-009, C-011); statuses PROPOSED | T | C-009, C-011 |
| FR-CLI-003 | Consultation notes: `DRAFT` → `SIGNED` (by the authoring doctor) → an amendment creates a new signed version linked to the previous one, with a reason. Earlier signed versions remain readable. Unsigned drafts can be discarded. Signed versions cannot be deleted. | CONFIRMED principle (C-029); content OPEN (Q-066) | T | v0.3 CLINICAL_SAFETY |
| FR-CLI-004 | Prescriptions shall be built from a medicine catalogue. Each line has: medicine, strength/form, dose, route, frequency, duration, instructions (bn/en) and quantity (optional). The exact field set, catalogue structure (generic/brand) and allowed free text are OPEN with hospital reviewers. | CONFIRMED capability; fields OPEN (Q-067) | U | v0.3 CLINICAL_SAFETY |
| FR-CLI-005 | Signed prescriptions shall print from a configurable bilingual template (default A5, PROPOSED), with patient banner, doctor's name/degrees/registration and next-visit date if booked. Printing does not change the prescription. | CONFIRMED (C-025, SRC-Q01); layout PROPOSED | U | C-025, SRC-Q01 |
| FR-CLI-006 | Each prescription line shall record a fulfilment choice: `HOSPITAL_PHARMACY` (creates a pharmacy request, C08) or `EXTERNAL`. `EXTERNAL` never creates stock movement or charge. An optional patient-reported note may be recorded. | CONFIRMED | T | C-012 |
| FR-CLI-007 | The consultation record shall capture allergy information as `KNOWN_ALLERGIES` (list), `NO_KNOWN_ALLERGIES` or `NOT_ASKED/UNKNOWN`. Absence of data is never displayed as "no allergies". | PROPOSED structure; content OPEN (Q-066) | T | v0.3 CLINICAL_SAFETY |
| FR-CLI-008 | A doctor shall be able to request admission from an OPD visit. This creates an admission request (C06) linked to the source visit (C-013). | CONFIRMED | T | C-013 |
| FR-CLI-009 | The doctor shall be able to book a next visit from the consultation screen (FR-SCH-006). | CONFIRMED | U | C-018 |
| FR-CLI-010 | Doctors shall be able to view released lab and radiology results for their patients from the worklist. Unreleased results are not visible to them as final. | CONFIRMED (C-019) | T | C-019 |

## 4. Use cases

### UC-CLI-01 Conduct an OPD consultation

- **Actor / permission:** doctor (`clinical.consultation.record`, `clinical.document.sign`, `order.service.create`, `clinical.prescription.create`).
- **Preconditions:**
  - The visit is `OPEN` and of kind `OPD_CONSULTATION`, with this doctor as attending practitioner (or a covering doctor with permission).
  - The doctor-fee invoice is eligible (FR-CLI-002).
- **Normal path:**
  1. The doctor selects the next `WAITING` patient. The server sets `IN_CONSULTATION` (version-checked, so two doctors cannot open the same consultation for editing).
  2. The doctor writes the note sections (draft autosaves to the server every few seconds, PROPOSED).
  3. The doctor adds orders (FR-ORD-002). Each order triggers a charge request; service invoice S gains lines.
  4. The doctor writes the prescription and fulfilment choices.
  5. The doctor signs the note and prescription. The server records signer, time and version, and the worklist moves to `CONSULTED`.
  6. Optional: book the next visit; print the prescription and order slip.
- **Outputs:**
  - `clinical_document_version` (signed)
  - `service_order`(s)
  - `prescription` + lines
  - billing lines on S (through the interface)
  - outbox `ConsultationSigned`, `ServiceOrdered`
- **Alternative paths:**
  - A1: no orders and no prescription → sign the note only.
  - A2: the doctor requests admission → FR-CLI-008.
  - A3: the doctor needs to correct after signing → UC-CLI-02.
- **Denied paths:**
  - D1: the doctor-fee invoice is not eligible → `PAYMENT_NOT_ELIGIBLE`; the worklist shows "Waiting for payment".
  - D2: a user without `clinical.document.sign` (e.g., a scribe role, if created) can draft but not sign.
  - D3: a doctor tries to record the cashier payment → `PERMISSION_DENIED` (C-009).
- **Cancellation:** C1: the doctor closes without signing → the draft remains `DRAFT`, visible only to the author and permitted roles. The worklist returns to `WAITING` or stays `IN_CONSULTATION` (PROPOSED: returns to `WAITING` after the doctor explicitly "parks" the patient).
- **Recovery:**
  - R1: browser crash → the server draft is restored.
  - R2: duplicate sign request → SP-01.
- **Requirements:** FR-CLI-001..007, FR-ORD-002..005.

### UC-CLI-02 Amend a signed clinical document

- **Normal path:** open the signed version → "Amend" → edit → reason (mandatory) → sign → new version `v(n+1)` with `amends = v(n)`. Prints show the latest version, with "Amended" and the date.
- **Denied paths:** D1: a non-author without `clinical.document.amend` → SP-04.
- **Requirements:** FR-CLI-003.

### UC-ORD-01 Create a direct diagnostic order at reception

See UC-VIS-02 in [C02](C02-patients-scheduling.md#uc-vis-02-create-a-walk-in-or-direct-diagnostic-visit). Additional rules:
- The server checks CP-01 per test.
- Prices come from the server.
- The receipt shows the expected reporting time (FR-ORD-007).

### UC-ORD-02 Cancel an order (interim rule)

- **Preconditions:** the order is `REQUESTED`; its invoice line has no allocation.
- **Normal path:**
  1. The doctor or receptionist chooses "Cancel order" and enters a reason.
  2. The server sets the order to `CANCELLED` and asks billing to cancel the unpaid line (`InvoiceLineCancelled`).
  3. The service invoice total decreases. The cancelled line remains visible, struck through.
- **Denied paths:** D1: the line has an allocation, or the order is `IN_PROGRESS` → `FEATURE_NOT_AVAILABLE` ("Cancellation after payment or after work has started is not configured — see supervisor"), pending Q-017.
- **Requirements:** FR-ORD-006, FR-BIL-020.

## 5. State machines

| Record | States | Notes |
| --- | --- | --- |
| Consultation (worklist) | `EXPECTED → WAITING_PAYMENT → WAITING → IN_CONSULTATION → CONSULTED` | `WAITING_PAYMENT ↔ WAITING` follows eligibility. |
| Clinical document | `DRAFT → SIGNED`; amendment = new `SIGNED` version | No delete after signing. |
| Service order | `REQUESTED → IN_PROGRESS → COMPLETED`; `REQUESTED → CANCELLED` | Payment eligibility is derived (FR-ORD-004). |
| Prescription | `DRAFT → SIGNED`; `SIGNED → AMENDED` (new version) | Dispensing state belongs to C08. |

## 6. Fixed rules versus configurable policy

| Fixed | Configurable |
| --- | --- |
| Requester from session; orders priced by billing | Directly orderable tests (CP-01) |
| Prescription ≠ dispensing; external fulfilment never moves stock | Payment eligibility rules (CP-02) |
| Signed documents only amended, never deleted | Cancellation stages (CP-22, OPEN) |
| Each post-consultation order has its own gate | Print templates (CP-19) |

## 7. Acceptance examples

```gherkin
Scenario: Doctor fee paid unlocks consultation but not tests (FR-ORD-005, FR-CLI-002)
  Given visit V for Karim Ahmed has doctor-fee invoice D = 500.00 BDT, fully paid
  When Dr. Hasan orders CBC (300.00) and Chest X-ray (700.00)
  Then service invoice S has two lines totalling 1,000.00 with balance 1,000.00
  And both orders show payment status "Not eligible"
  And lab sample collection for CBC is refused with PAYMENT_NOT_ELIGIBLE

Scenario: Prescription does not move stock (FR-CLI-001, FR-CLI-006)
  Given paracetamol 500 mg has 1,000 tablets in the hospital pharmacy store
  When Dr. Hasan signs a prescription for 20 tablets with fulfilment EXTERNAL
  Then the store still has 1,000 tablets and no pharmacy charge exists

Scenario: Amendment keeps the original (FR-CLI-003)
  Given a signed consultation note version 1
  When the author amends the advice with reason "Dose clarified"
  Then version 2 is signed and linked to version 1
  And version 1 remains readable in history

Scenario: Interim cancellation rule (FR-ORD-006)
  Given the CBC line on S has an allocation of 300.00
  When the doctor tries to cancel the CBC order
  Then the response is FEATURE_NOT_AVAILABLE and the order remains REQUESTED
```

## 8. Traceability

| Requirement | Decision / source | Command | Data | Permission | Tests |
| --- | --- | --- | --- | --- | --- |
| FR-ORD-001..005 | C-006, C-008, C-011 | `CreateServiceOrder`, `CreateDirectDiagnosticOrder` | `service_order`, billing `charge` | `order.*` | AT-ORD-001..006 |
| FR-ORD-006 | SRC-N07, Q-017 | `CancelServiceOrder` | `service_order`, `invoice_line` | `order.service.cancel` | AT-ORD-007, AT-ORD-008 |
| FR-CLI-001, -006 | C-012 | `SignPrescription` | `prescription`, `prescription_line` | `clinical.prescription.create` | AT-CLI-001, AT-CLI-002 |
| FR-CLI-002 | C-009, C-011 | `GetDoctorWorklist`, `StartConsultation` | `consultation` | `clinical.consultation.record` | AT-CLI-003, AT-CLI-004 |
| FR-CLI-003 | C-029 | `SignClinicalDocument`, `AmendClinicalDocument` | `clinical_document_version` | `clinical.document.*` | AT-CLI-005, AT-CLI-006 |
| FR-CLI-008 | C-013 | `RequestAdmission` | `admission` | `ipd.admission.create` | AT-IPD-001 |

## 9. Gaps and open questions

- **Q-066** Clinical note content: sections, coded diagnosis (classification and version), OPD vitals.
- **Q-067** Prescription field set, medicine catalogue structure (generic/brand) and free-text rules.
- **Q-017** Cancellation stages and reversal.
- **Q-012** Critical results acknowledgment (C05).
- Order sets/favourites for doctors are a usability proposal ([F](../F-ui-ux-design.md)), not a requirement until reviewed.
