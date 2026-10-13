# System design review
Purpose: expand architecture into a concrete runtime design for the selected workflow.
Status: PROPOSED worked baseline; deployment values and complete contracts remain OPEN.

## Example: cashier records a doctor-fee payment
1. Staff UI loads the patient, visit and separate invoice balances under the authenticated tenant.
2. Cashier submits invoice ID, amount/method and idempotency key.
3. API validates tenant membership, cashier permission, invoice state, allowed amount and payment policy.
4. Billing transaction creates payment/allocation/receipt and audit linkage; invoice balance becomes authoritative from posted facts.
5. An outbox event supports downstream reporting or notifications. The UI reloads committed balances.
6. A repeated identical operation returns the recorded outcome; conflicting payload under the same key is denied.
This is a proposed manual-collection design. Provider settlement requires separate verified callback/reconciliation behavior in API_CONTRACTS and INTEGRATIONS.

## Boundaries
Staff/browser is an untrusted input source. Hospital API applies permission and state checks. Persistence enforces tenant references and critical constraints. Vendor control APIs have separate credentials/authority. Workers preserve tenant routing and current authorization where delayed sensitive action requires it.

## Interface design
Define command/query name, schema version, server-derived context, response, error codes, state transition, audit, transaction and events. Contracts belong to canonical schemas; frontend/server/generated API references must not diverge. See API_CONTRACTS for examples.

## Deployment view to complete
Choose hosting/topology, identity, API/worker instances, PostgreSQL roles and pools, Redis/queue if adopted, storage, secrets, monitoring and backup location. Define dev/staging/production and synthetic staging data. State which components share a process versus deployment; the architecture diagram is not an infrastructure mandate.

## Failure analysis
Concurrent cashiers; stale invoice; partial payment; payment timeout; duplicate callback; queue outage; object-storage failure; printer failure; worker retry; revoked membership. Separate committed money from uncertain external provider state. A failed print must not create another payment.

## Design-review evidence
Requirement links, logical ERD, access rules, transaction boundaries, failure sequences, capacity estimates, alternatives/ADRs, migration strategy and tests. Document who reviews clinical/financial assumptions. Settle selected slice questions before implementation while allowing unaffected planning to continue.
