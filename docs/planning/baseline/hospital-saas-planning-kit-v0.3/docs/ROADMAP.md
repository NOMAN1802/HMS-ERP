# Dependency roadmap and release decisions
Purpose: order work by dependencies and demonstrated outcomes.
Status: PROPOSED stages; first-release scope Q-001 remains OPEN. No calendar estimates.

| Stage | Scope | Evidence before expanding |
| --- | --- | --- |
| R0 Planning baseline | Decisions, workflows, roles, pilot profile, first-release choice | Confirmed vs source vs open visible |
| R1 Foundation | Monorepo, identity, tenants/facilities, permissions, audit, database, CI | Actual scripts; two-tenant access/restore proof |
| R2 Reception/cashier slice | Search/register, schedules/check-in, doctor invoice/payment | Independent invoice balance and retry tests |
| R3 OPD/services/LIS | Consultation/prescription, service invoice/gate, sample/result release | End-to-end departmental handoff and lab review |
| R4 IPD/nursing/pharmacy | Admission/bed/cleaning, running bill, care/issue/return | Occupancy concurrency; stock and finance reconcile |
| R5 Procedures/operations | Emergency/Daycare depth, radiology/OT, procurement/reagents | Actual schedules, devices, correction and charge flow |
| R6 Enterprise breadth | Full finance/HR, portal, B2B/referral and reporting | Accounting/payroll/identity/UAT evidence |

Move a complete required capability earlier if the first hospital needs it. An initial LIS may use manual entry only with a validated release workflow; required device connections belong in the operational slice. If hospital dispensing is required, include minimum stock/batch/expiry/returns before calling pharmacy production-ready.

## Current decision boundary
Earlier assistant suggestions alternated between OPD/LIS first and early OPD/emergency/IPD entry. Neither is treated as owner-approved release scope. Agree the first commercial release separately from this implementation dependency order.

## Planning breadth versus coding depth
Keep the whole-hospital module map and shared data model in view. Design the next slice thoroughly; future domain specs can remain explicitly draft. Continuous concerns—tenant isolation, audit, correctness, migrations, accessibility and recovery—apply at every stage, rather than appearing only at the end.
