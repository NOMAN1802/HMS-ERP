# Implementation readiness checklist
Purpose: tell the owner and coding agents which planning outputs are still needed.
Status: documentation readiness assessment, not application verification.

## Present in this pack
Confirmed decisions, source register, workflow explanations, starting requirements, ownership map, proposed architecture/stack/tenancy, logical entity model, module specs, permission direction, quality/operations guidance and task templates.

## Required before scaffold task
Approve architecture/tenancy and initial applications; select compatible versions, package manager, authentication and actual CI/test scripts. Agree a thin first outcome with synthetic fixtures. Infrastructure candidates remain proposals.

## Required before a workflow coding task
- Adopt relevant source requirements and preserve decision IDs.
- Finalize actor permissions, fields, state transitions and denial/correction behavior.
- Agree canonical API/schema, owned entities and transaction boundaries.
- Resolve money/clinical questions affecting that task.
- Provide positive/retry/denial/concurrency acceptance cases and actual test commands.

## Required before production use
First-release scope and pilot review; complete staff handoffs; tested tenant isolation; required printer/device/provider integrations; migration/restore reconciliation; agreed quality/support targets; departmental UAT; later deferred launch-obligation review as separately scoped.

## Recommended next discussion
First-release boundary (Q-001), customer/facility model (Q-002), then reception/cashier roles and deposit allocation (Q-003/Q-004). Our confirmed invoice model stays intact through those discussions. Whole-hospital breadth can remain in draft module specs while the next slice becomes precise.
