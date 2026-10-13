# C11 — Radiology (RIS) and operating theatre (OT)

| Control | Value |
| --- | --- |
| Module | `mod-radiology`, `mod-ot` (later phases) |
| Version | 0.4.0-draft |
| Status | Workflows SOURCE-DERIVED. Report authority, PACS, OT documentation and pricing OPEN. **Specification level: GAP.** |
| Domain reviewer | Radiology lead; OT lead + anesthesia; finance (OT charges) |
| Sources | SRC-R01, SRC-T01, SRC-B06; v0.3 RADIOLOGY_OT |

## 1. Purpose and scope

**Radiology:**
- schedule modality slots
- perform examinations against eligible orders
- record image references (not store images; DEF-004)
- draft, verify and release reports with versioned amendments (same principles as C05)

**OT:**
- record the stage flow from the sources
- post OT charges exactly once to the patient account

## 2. Requirements

| ID | Requirement | Status | Verify | Source |
| --- | --- | --- | --- | --- |
| FR-RIS-001 | Modality configuration, schedules/appointments, examination records linked to orders, image/study references, and a report workflow (draft → verified → released, amendment as new version). | SOURCE-DERIVED (v0.3) | T | SRC-R01 |
| FR-RIS-002 | An examination may start only for a payment-eligible order line (FR-BIL-003). | CONFIRMED (C-011) | T | C-011 |
| FR-RIS-003 | Report authority (who verifies/releases), templates, and amendment approval. | OPEN (Q-028) | — | SRC-R01 |
| FR-RIS-004 | PACS/DICOM integration (study retrieval, worklist). | DEFERRED (DEF-004); partner-dependent | — | v0.3 INTEGRATIONS |
| FR-RIS-005 | Viewing or printing a released radiology report never changes its state (FPR-07). | CONFIRMED by fixed rule | T | SRC-L12 analogy |
| FR-OT-001 | OT stages and charges shall persist and synchronize to the patient account. A retried OT event posts once (FR-BIL-006). | SOURCE-DERIVED (v0.3) | T | SRC-T01, SRC-B06 |
| FR-OT-002 | OT stage flow from sources:<br>requisition → confirmation → reception/anesthesia → execution → post-operative → clearance<br>Each stage records actor and time. Who may perform each stage is OPEN. | SOURCE-DERIVED; authority OPEN (Q-027) | T | SRC-T01 |
| FR-OT-003 | OT charge posting uses source references, one per billable OT event, e.g. `(OT, procedure, id, COMPLETED)`. | SOURCE-DERIVED | T | SRC-B06 |
| FR-OT-004 | Team/room scheduling and conflicts, consent/checklists, anesthesia record, package pricing. | OPEN (Q-027, Q-061). **GAP.** | — | SRC-T01 |

## 3. Acceptance examples

```gherkin
Scenario: Duplicate OT completion does not duplicate charges (FR-OT-001, FR-OT-003)
  Given procedure P-77 for admission A-12 is marked COMPLETED and posts its OT charge
  When the OT completion event is delivered again by the worker
  Then the running account still has one OT charge for P-77

Scenario: Unauthorized user cannot release a radiology report (FR-RIS-001)
  Given a radiology report draft for Chest X-ray
  When a user without radiology release permission tries to release it
  Then PERMISSION_DENIED is returned
```

## 4. Gaps

These are explicitly unspecified:
- radiology report authority
- modality list
- PACS
- OT documentation (consent, checklists, anesthesia)
- OT resource scheduling
- packages

No radiology or OT task can be "ready" until Q-027 and Q-028 are answered and sample report or OT records are reviewed.
