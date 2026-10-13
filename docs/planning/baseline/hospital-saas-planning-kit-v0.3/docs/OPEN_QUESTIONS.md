# Open questions and next planning discussion
Purpose: give the owner a manageable sequence of decisions and tell agents what remains unknown.
Status: OPEN items; source-specific rules must not be inferred.

## Discuss next
| ID | Question | Why it matters | Suggested responder |
| --- | --- | --- | --- |
| Q-001 | What must the first production release include? | Prior assistant release suggestions were not owner approval | Product owner + pilot hospital |
| Q-002 | Is a customer one hospital or a group with several facilities? | Patient numbering, permissions and billing scope | Product owner |
| Q-003 | Which staff roles perform and approve each action? | Complete permission matrix | Hospital operations |
| Q-004 | Does a deposit unlock each service independently, and how is it allocated? | Enforce payment-first without using a misleading total | Cashier/finance |
| Q-005 | What emergency payment exceptions are required? | Avoid guessing policy from general OPD rules | Emergency lead + finance |
| Q-006 | What happens if an IPD patient is medically discharged with unpaid balance? | Distinguish medical decision, bill clearance and physical departure | Hospital + finance |

## Domain questions
Bed rent: sources mention noon-to-noon checkout and 6 p.m. posting, plus special transfer/extra-bed rules. Agree their relationship, event precedence, partial-day treatment and examples before building the engine.
Lab: who enters, verifies and releases; who receives a released report; exact eosinophil rounding; approved reference ranges, methods, PBF templates and correction process.
Pharmacy: medicine substitutions, pack/unit conversions, partial dispensing, expiry selection, stock reservation and acceptance of returns after discharge.
Nursing: medication-administration scope, allowed order cancellation stages, whether return stock is accepted by pharmacy before credit is issued.
Billing: discounts and limits, approvals, rounding, refunds, overpayment, invoice correction, same-invoice test restoration and allocation of multi-invoice payments.
Emergency/OT: staff priority categories, escalation, consent/checklists, resource conflicts and clearance duties.
HR/finance: full payroll rules, ledger scope, period close, chart of accounts, attendance sources. The attachments do not fully specify these modules.

## Technology and operations questions
Hosting/topology; identity provider; languages; expected users/patients/peak hours; backup loss tolerance and restore time; support hours; printer sizes; analyzer protocols; payment gateways vs manual recording; migration scope; portal/proxy verification.

## Deferred discussion
Government rules, statutory requirements and national interfaces are parked at the owner's request. Do not treat their absence as a completed compliance assessment. They need a later separately scoped review; this is not the next planning question.

## Recording an answer
Record question ID, answer, owner/date, affected decisions and examples. Promote a rule only when authority is clear. A task can proceed with unresolved questions explicitly excluded if they do not affect its behavior; unresolved financial/clinical assumptions cannot be hidden in generated code.
