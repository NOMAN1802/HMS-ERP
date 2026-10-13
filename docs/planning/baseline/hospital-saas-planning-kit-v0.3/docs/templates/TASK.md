# Task template for a coding agent
Purpose: copy this for a bounded implementation task after the relevant rules are settled.
Status options: draft / ready / active / review / done.

## Identity and scope
Task ID and title:
Owner/reviewer:
Requirement/decision IDs:
Module and allowed files/packages:
Dependencies and shared-file reservations:
Included behavior and explicitly excluded open questions:

## Required context
Link only the applicable module, workflow, permission rules, data/API contract and ADR. Quote critical confirmed behavior when omission would cause an error. State which source requirements have been adopted.

## Contract and state
Command/query and trusted tenant/actor context:
Input schema, validation, output and error codes:
Preconditions, state transition and transaction boundary:
Idempotency, concurrency, downstream events and audit:
UI feedback and failure recovery:

## Acceptance
Given/When/Then positive case:
Wrong tenant/role/revoked access case:
Duplicate request and conflicting idempotency payload:
Stale/concurrent case where relevant:
Failure/recovery and downstream reconciliation:
Print/hospital review case if applicable:

## Verification and handoff
Actual repository commands:
Changed files and behavior:
Checks run/results:
Migration and recovery implications:
Documentation/traceability updated:
Remaining limitations and unresolved decisions:

## Worked example: draft task
Title: record payment against the separate doctor-fee invoice.
Links: C-008/C-009, FR-BIL-001/002, BILLING_PAYMENTS, FINANCIAL_RULES.
Scope: manual cashier payment and receipt; online gateway/overpayment excluded pending policy.
Case: D=500 and S=1,000. Cashier pays D=500; D balance becomes zero and S remains 1,000. Doctor-only user cannot collect. Same operation key returns one payment/receipt. Printer failure does not create another payment.
This task becomes ready only after schema/API, permissions, allocation handling and actual commands are agreed; the example is not an executable task yet.
