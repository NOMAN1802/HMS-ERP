# Patient billing and cashier payments
Purpose: provide domain context for requirements, system design and scoped coding tasks.
Status: CONFIRMED separate invoices/payment first; formulas and detailed corrections OPEN | Owners: business/domain and technical reviewers to assign.

## Workflow and scope
Own charge provenance, invoices, receipts, payment allocation, deposits and financial corrections. Outpatient doctor fee uses separate invoice; other visit services use combined invoice. Cashier collects doctor fee. Full payment or permitted deposit precedes relevant delivery under configured hospital/service policy.

IPD uses a running account with interim payments and final reconciliation. Source requests cover discounts, method corrections, returns, detail-summary agreement and duplicate posting prevention. Do not infer discharge-with-dues or bed-rent formulas.

## Records and ownership
Charge, PriceVersion, Invoice/Line, Payment, Allocation, DepositAccount, Refund, Adjustment and reconciliation records.
All hospital-owned records retain validated tenant/facility context. Cross-module effects use declared application interfaces rather than arbitrary writes.

## Commands, permissions and consistency
Issue invoices, collect/allocate money, assess payment eligibility, approved refund/discount/correction. Use exact arithmetic, transaction guards, idempotency and source-posting uniqueness.
Record actor, time, source/version and reasons for sensitive corrections. Read access and exports also require scope checks; hiding an action in the UI is insufficient.

## Acceptance examples
D=500 doctor fee and S=1,000 service charges. Paying D settles only D. Qualifying deposit against S permits only policy-eligible services. Same key/payment event posts once. Wrong role denied; uncertain provider payment reconciled.
Use synthetic data; add denial, retry, stale-state and relevant concurrency/failure cases to ready tasks. Link actual tests through TRACEABILITY.

## Open questions before detailed implementation
Deposit allocation, overpayment, discounts, rounding, refunds, provider integration and bed-charge engine policy.
Resolve the questions affecting the selected task or explicitly exclude that behavior. See DECISIONS, SOURCE_REQUIREMENTS, WORKFLOWS, DATA and ACCESS_CONTROL for shared context.
