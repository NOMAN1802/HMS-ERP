# Requirements-to-implementation traceability
Purpose: let reviewers follow a decision from requirement to code and evidence.
Status: populated starting links; implementation/test/gate evidence is pending.

| Requirement | Decision/source | Workflow/spec | Design/data | Expected evidence | Current state |
| --- | --- | --- | --- | --- | --- |
| FR-PAT-001/002 | Identity agreements | Patients/scheduling | Patient/MRN; access/tenancy | Duplicate warning, tenant MRN, retry | Spec draft |
| FR-BIL-001 | C-008 | Billing/payments | Invoice type/allocations | Doctor payment leaves service balance | Confirmed behavior; contract draft |
| FR-BIL-002 | C-009 | Cashier flow | Payment permission/audit | Doctor-only role denied | Permission matrix draft |
| FR-BIL-003 | C-011/Q-004 | Service delivery | Policy version/eligibility | Full and eligible deposit cases | Allocation details OPEN |
| FR-IPD-001/002/003 | C-014/015/016 | IPD/beds | Admission/occupancy/cleaning | Await-bed, transfer and reuse cases | State detail draft |
| FR-LAB-002 | SRC-L12 to L15 | Lab | Result version/status | View/Back/Print retains state | SOURCE candidate |
| FR-NUR-002 | SRC-N08 to N11 | Nursing/pharmacy | Indent/return/acceptance | Batch edit, visible accepted return | SOURCE; policy OPEN |
| FR-BIL-006 | Source duplicate-posting issues | Billing and OT/clinical | Charge source ID/outbox | Retry posts once | SOURCE candidate |
| NFR-ISO-001 | C-001/P-003 | All surfaces | Tenant references/RLS/files/jobs | Two-tenant adversarial suite | Topology PROPOSED |

## Extend each row
Add canonical API/event/schema links, permission codes, code/package location, actual test/UAT IDs, release gate, reviewer/date and verified commit. The register must reflect real evidence; pending rows are not marked passed.

## Change impact
Changing a rule requires checking data, contracts, customer settings, UI, tests, migrations and reports. Keep source provenance and supersession so old hospital rules cannot be mistaken for current product behavior. Task tracker may generate this map if it preserves stable IDs.
