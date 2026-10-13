# Permissions and audit
Purpose: define who may perform each action and ensure the backend enforces it.
Status: PROPOSED matrix; cashier collection is CONFIRMED. Exact role grants need hospital review.

## Permission model
Broad role duties plus tenant, facility, department, record relationship and workflow state. Feature entitlements determine module availability; they are not user permissions. Do not infer authority from a hidden/visible menu, job title or tenant administrator role alone.

| Role | Proposed usual actions | Separate authority to decide |
| --- | --- | --- |
| Reception | Patient search/register, booking/check-in, allowed direct tests | Identity merge, discounts, refunds |
| Cashier | Record payment and receipt, view relevant balances | Refund approval, method corrections, discount limits |
| Doctor | Consultation, authorized orders, prescribing | Lab release and financial refund |
| Nurse | Assigned patient/worklist/vitals, indents/return requests | Order cancellation stages, returned-stock acceptance |
| Lab operator | Collect/receive samples, enter results | Verify/finalize/release |
| Lab authority | Review and release within permitted scope | Step skip/reverse and report amendments |
| Radiology/OT staff | Assigned schedules/exams/procedures | Final report/signature, clearance |
| Pharmacy/store | Issue/accept returns, receipt/transfer work | Stock adjustment, purchase approval |
| Finance | Reconcile, approved correction and financial reports | Period close and writeoff |
| Hospital admin | Staff membership/configuration | Clinical access, sensitive policy changes |
| Vendor operator | Customer provisioning/service health | Exceptional customer-authorized support access |
| Patient/proxy | Verified permitted appointments/released records | Proxy verification and delivery policy |

## Sensitive actions
Separate read, create, update, sign, verify, release, cancel, refund, discount, export, stock-adjust and configuration permissions. Source documents' Add/Edit/Delete buttons cannot justify deleting released clinical or posted financial evidence. State and downstream work affect what correction is permitted.

## Audit evidence
Actor, tenant/facility, action, target record/version, timestamp, request correlation, outcome and reason where applicable. Define sensitive read/export coverage. Restrict audit mutation and retention. Ordinary logs avoid unrestricted patient content, credentials and payment data.

## Acceptance
Doctor-only user cannot collect cashier payment; lab-entry permission cannot automatically release results; wrong-tenant IDs are denied; revoked memberships stop access; exported files remain scoped. Final role matrix must be reviewed before ready tasks grant sensitive operations.
