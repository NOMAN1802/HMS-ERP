# Testing, CI and evidence
Purpose: show how agent changes are checked against business outcomes.
Status: PROPOSED verification plan; actual scripts are created during scaffold work.

## Check layers
Static: formatting/lint, TypeScript checks, build, package boundaries and contract consistency.
Unit: exact money, policy evaluation, state transitions, normalization and guarded corrections.
PostgreSQL integration: real constraints/RLS/application roles, pool reuse, concurrent beds/slots/stock and transactional posting.
API: actor/tenant/facility denial, validation, idempotency, stale record, revoked membership and exports.
Browser E2E: staff journey from check-in to payment/service/result, including separate invoices and clear committed status.
Device/print/UAT: lab/radiology mappings, labels, A4/A5 and hospital department handoffs.
Operations: migration reconciliation, restore and failure/retry drills.

## Required regression examples
- Doctor invoice payment leaves service invoice balance unchanged.
- Full/deposit policy gates service start correctly.
- Opening/Back/Print does not turn a released report into Pending.
- Nurse quantity edit preserves other indent lines; return record is visible.
- Admission awaiting bed exists; transfer retains history; needs-cleaning bed cannot allocate.
- Actual card/mobile payment method survives reports.
- Repeated OT/EMR charge delivery posts once.
- Phone formatting variations match; duplicate warning never merges automatically.

## CI pipeline outline
Install pinned dependencies -> static checks -> unit/API/PostgreSQL tests -> build -> browser E2E for affected workflows -> migration/contract/dependency/secret checks -> SonarQube gate -> publish reviewed artifacts. Configure required checks once actual scripts exist. No fabricated pnpm command output should appear in task evidence.

## Turborepo cache
Cache deterministic tasks with declared inputs, outputs and environment dependencies. Do not cache live deployments, migrations, provider effects or stateful tests without isolated fresh state. Protect remote cache credentials and never store patient datasets in cached artifacts.

## Completion
Run relevant checks once changes stabilize; investigate concrete failures and repeat affected checks. Tests should check meaningful behavior rather than restate implementation. Keep requirement-to-test links current and record command, exit/result and limitations in the handoff.
