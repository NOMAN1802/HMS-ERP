# Financial and payment rules
Purpose: protect confirmed billing behavior and identify formulas that need finance approval.
Status: confirmed invoice/payment model; source-derived corrections and detailed formulas OPEN.

## Confirmed outpatient invoices
One combined service invoice per outpatient visit. Doctor's visit fee is issued on a separate invoice, collected by the cashier. Both belong to the patient/visit context and have independent balances. Do not combine their payment status or silently move doctor fee into service totals.

Synthetic example: doctor invoice D = 500; service invoice S = 1,000. A 500 payment allocated to D settles D and leaves S owing 1,000. If S permits a 300 deposit for a particular service, that eligibility follows the approved policy; it does not mean S is fully paid. Exact multi-service deposit allocation is Q-004.

## Payment first
Before starting a relevant service, the server checks full-payment or permitted deposit policy. The browser cannot override eligibility by sending paid=true. Store money received separately from eligibility and service completion. Emergency exceptions remain Q-005. Changes to price/payment policy need effective dates and historical references.

## IPD running account
Accumulate traceable charges for the admission and record interim deposits/partial payments. Final billing reconciles charges, accepted returns, adjustments and allocated payments exactly once. Distinguish account credit, invoice balance and provider status. Discharge-with-dues behavior remains Q-006.

## Source requirements to validate
Medicine/non-medicine subtotals and discounts remain distinct. Accepted medicine returns reduce net patient charges through auditable adjustment/refund rules. Display running bill before head discount. Record actual cash/card/bKash/other method. Authorized payment-method corrections retain original/corrected values and reason. Detail, summary and collection reports reconcile. Fraction/rounding adjustment is explicit and does not accidentally inflate service charge. OT/EMR/other postings use unique source references.

## Bed rent remains unresolved
Sources propose noon-to-noon charging and a 6 p.m. posting point plus transfer/extra-bed cases. Do not choose one interpretation. Once agreed, define event time, window, source/destination rates, duplicate suppression and effective policy version; test admission/transfer/extra bed on both sides of each boundary in Asia/Dhaka.

## Financial implementation invariants
Exact arithmetic and explicit currency/rounding. Posted amounts use correction/reversal records rather than destructive editing. Duplicate submissions/callbacks do not duplicate money. Provider redirects are not settlement proof. Reconcile uncertain outcomes before retrying an external charge/refund. Simultaneous cashier actions require a transactional balance/allocation policy.

SaaS subscription invoices are separate from patient billing and finance ledgers. Full accounting scope remains to be defined. See BILLING_PAYMENTS module, API_CONTRACTS and INTEGRATIONS.
