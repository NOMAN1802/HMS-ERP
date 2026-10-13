# Finance, HR, attendance and payroll
Purpose: provide domain context for requirements, system design and scoped coding tasks.
Status: CONFIRMED product breadth; detailed rules largely OPEN | Owners: business/domain and technical reviewers to assign.

## Workflow and scope
Finance source coverage includes daily transactions/finalization, bank reconciliation and search. Full ledger, balanced posting, periods, payables/receivables and close must be separately specified if required. Hospital patient accounting remains distinct from SaaS subscription revenue.

HR sources include employee personal/job/department records and reports; they do not provide complete payroll calculations. Practitioner professional identity is not equivalent to employment/payroll identity. Attendance devices and payroll policies need discovery.

## Records and ownership
Ledger/integration records if adopted, employee/employment, rosters/attendance/payroll entities after specification.
All hospital-owned records retain validated tenant/facility context. Cross-module effects use declared application interfaces rather than arbitrary writes.

## Commands, permissions and consistency
Import/post/reconcile/correct/close according to approved finance rules; workforce changes with scoped sensitive access. No statutory/payroll rates invented.
Record actor, time, source/version and reasons for sensitive corrections. Read access and exports also require scope checks; hiding an action in the UI is insufficient.

## Acceptance examples
A payment retains actual method in reconciliation. Reversal preserves original posting. Employee data access differs from clinical privileges. Detailed accounting/payroll acceptance awaits approved worked examples.
Use synthetic data; add denial, retry, stale-state and relevant concurrency/failure cases to ready tasks. Link actual tests through TRACEABILITY.

## Open questions before detailed implementation
Ledger vs external integration, chart/period close, salary/allowances/deductions/overtime/leave and attendance integration; government discussion deferred.
Resolve the questions affecting the selected task or explicitly exclude that behavior. See DECISIONS, SOURCE_REQUIREMENTS, WORKFLOWS, DATA and ACCESS_CONTROL for shared context.
