# Module ownership map
Purpose: assign records and writes to a domain before creating packages or tables.
Status: PROPOSED ownership with confirmed and SOURCE capability scope.

| Domain | Owns | Main handoffs / spec |
| --- | --- | --- |
| SaaS/access | Tenant setup, membership, entitlements, policy settings | Every hospital command; modules/SAAS_ACCESS.md |
| Patients/scheduling | Identity, MRNs, practitioners, availability, booking/check-in | Clinical, diagnostics, admissions; modules/PATIENTS_SCHEDULING.md |
| OPD/clinical | Visits, notes, prescriptions and clinical requests | Orders, billing, pharmacy; modules/OPD_CLINICAL.md |
| Billing/payments | Charge ledger, invoices, payments, allocations, refunds | All delivered billable services; modules/BILLING_PAYMENTS.md |
| IPD/beds | Admission and occupancy/transfer history | Nursing, billing, discharge; modules/IPD_BEDS.md |
| Nursing | Care worklists, observations, indents/returns | Lab read access, pharmacy acceptance; modules/NURSING.md |
| LIS | Test catalogue, samples and result versions/release | Billing gate and clinician/report delivery; modules/LAB.md |
| Pharmacy | Medicine catalogue and dispensing/returns | Inventory movements and billing; modules/PHARMACY.md |
| Inventory/procurement | Stock movement, PO/receipt, transfer, reagent stock | Pharmacy/LIS/OT consumption; modules/INVENTORY_REAGENTS.md |
| Emergency/Daycare | Urgent/day-stay operational workflows | Patient identity, billing, admissions; modules/EMERGENCY_DAYCARE.md |
| Radiology/OT | Modality/procedure schedules, execution/reporting | Orders, inpatient charges, resources; modules/RADIOLOGY_OT.md |
| Finance/workforce | Ledger/integration, HR/attendance/payroll | Billing, procurement, staff records; modules/FINANCE_HR.md |
| Reports/portal/B2B | Authorized views, patient/client access and delivery | Owned domain records; modules/REPORTING_PORTAL_B2B.md |

Shared testkit/authorization/audit/contracts are capabilities with explicit owners, not a dumping ground for unrelated business logic. An invoice write belongs to billing even if the button sits in an OT screen. Patient demographics are authoritative in the patient module, not copied independently into each department.

## Scope limits
The source documents are detailed for billing, beds, lab and nursing, but thinner for full finance, HR/payroll, emergency clinical work and EMR. A module name does not imply a complete specification. Blood bank/transfusion, dialysis, dietary, ambulance, assets and other whole-hospital services need explicit scope decisions before being advertised or built.
