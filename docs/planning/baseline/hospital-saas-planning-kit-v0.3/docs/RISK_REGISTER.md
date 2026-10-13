# Product and implementation risks
Purpose: track concrete failure scenarios and how the selected slice will prevent/recover from them.
Status: starting register; named owners and ratings need assignment.

| ID | Scenario | Control/design direction | Evidence / open work |
| --- | --- | --- | --- |
| R-01 | Wrong patient selected | Visible patient/visit context, duplicate review | Staff UAT; exact identifying fields |
| R-02 | Doctor invoice payment unlocks unpaid tests | Independent balances and per-service eligibility | FR-BIL-001/003 tests |
| R-03 | Cross-customer records leaked | Server scope, tenant references, RLS/files/jobs controls | Real app-role isolation suite |
| R-04 | Duplicate payment/OT/EMR posting | Idempotency and source references | Duplicate/retry/concurrency tests |
| R-05 | Report opens as Pending after release | Explicit guarded state transitions | Source LIS regression cases |
| R-06 | Two admissions allocated same bed | Transaction/constraint concurrency | Concurrent allocation tests |
| R-07 | Stock/return differs from patient bill | Linked movement/accepted return/adjustment | Nursing-pharmacy reconciliation |
| R-08 | Bed charge incorrectly applies cutoff | Approved examples and versioned engine | Approved domain examples and cutoff clarification |
| R-09 | Source menu interpreted as full HR/finance spec | Explicit scope gaps and requirement review | Complete workflows before coding |
| R-10 | AI agent invents unresolved policy | Status labels and ready task criteria | Review linked decisions and generated behavior |
| R-11 | Outage/migration creates lost/duplicate work | Restore/cutover and reconciliation procedures | Timed rehearsal and data reconciliation |

Use OPEN_QUESTIONS for unresolved decisions rather than duplicating inconsistent policies here. Assign rating method, owner, due review, control evidence and remaining risk. Ratings are not fabricated. Government-specific risks are deferred from current discovery; no production compliance conclusion is made.
