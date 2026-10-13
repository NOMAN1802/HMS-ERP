# Planning process
Purpose: turn discussion and hospital feedback into reviewable requirements and executable agent tasks.
Status: proposed working process; no duration/staffing estimates.

## 1. Preserve context
Record confirmed decisions, source-derived requirements, proposals and open questions. Use stable IDs and source references. Keep whole-hospital scope visible while choosing the next slice. Government-specific discovery is deferred; it does not gate unrelated planning today.
Deliverable: CONTEXT, DECISIONS, SOURCE_REQUIREMENTS and OPEN_QUESTIONS.

## 2. Map real work
For each flow capture staff roles, normal route, alternative routes, cancellations, overnight work, downtime and errors. Obtain examples of receipts, report formats, bed policies and stock returns with synthetic/de-identified content. The manual's menu list is an inventory, not a validated new UI design.
Deliverable: WORKFLOWS, glossary, module notes and role matrix.

## 3. Specify observable behavior
Write requirement IDs, preconditions, actor authority, state changes and testable outcomes. Distinguish fixed product invariants from configurable hospital policy. A cancelled test's restoration or a post-discharge return needs financial/clinical implications explained, not merely an enabled button.
Deliverable: FUNCTIONAL_REQUIREMENTS, module specs, ACCESS_CONTROL and acceptance examples.

## 4. Set quality and design
Agree measurable latency, capacity, availability and recovery goals. Design modules, interfaces, tenant boundaries, logical entities, constraints and physical schema. Resolve financial/clinical unknowns for the selected task before encoding them. Generic fields marked TBD are not implementation-ready specifications.
Deliverable: NFR, architecture ADRs, system/data design, UX and API contracts.

## 5. Prove a complete slice
Build UI -> API -> database -> permissions -> audit -> tests for one outcome. Run with two tenants and representative roles. Demonstrate actual handoffs, duplicate submissions, denied operations and committed state. Refine design from evidence.
Deliverable: runnable behavior, check results and department feedback.

## 6. Expand through reviewed tasks
Use templates/TASK for bounded changes. Coordinate schema/contracts, keep docs current and tie each requirement to tests. Review migrations and deploy with recovery evidence. Human hospital reviewers validate domain rules; coding-agent output remains subject to ordinary engineering review.

## Completion rules
A document is usable when its status, owner, scope, examples and remaining questions are explicit. A task is ready when its dependencies and acceptance behavior are known. A release is ready only when the agreed workflow and operational evidence are complete. Planning can continue without settling every future department today.
