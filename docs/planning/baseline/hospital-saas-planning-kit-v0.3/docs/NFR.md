# Non-functional requirements
Purpose: define measurable quality beyond feature behavior.
Status: initial register; thresholds require pilot capacity/support decisions.

| ID | Quality and scenario | Current target/status | Verification |
| --- | --- | --- | --- |
| NFR-ISO-001 | UI/API/job/file/report access across customers | Zero unauthorized cross-tenant access | Application-role isolation suite |
| NFR-PERF-001 | Registration search, order selection, cashier transaction under peak load | OPEN percentile/time; eliminate source-reported 1–1.5 minute loaders | Representative dataset and load test |
| NFR-CAP-001 | Concurrent staff, daily visits/orders, historical growth | OPEN hospital profile | Load/soak and query plans |
| NFR-AVAIL-001 | Critical care/operational workflows over agreed support period | OPEN service objective | Workflow probes and incident reports |
| NFR-REC-001 | Database/file restore and per-customer recovery | RPO/RTO OPEN | Timed restore/reconciliation exercise |
| NFR-AUD-001 | Sensitive actions traceable to actor/record version | Required action coverage to finalize | Audit reconciliation and denied-action tests |
| NFR-INTEG-001 | Duplicate financial events and retries | One intended posting per source operation | Duplicate/retry and reconciliation tests |
| NFR-UX-001 | Keyboard-driven search/order/payment flow | Efficient clear interaction; exact accessibility target OPEN | Staff usability testing |
| NFR-PRINT-001 | A4/A5 reports, labels, bed/room fields | Correct output on approved hardware | Actual printer/barcode UAT |
| NFR-I18N-001 | Bangla/English content and local dates | Languages OPEN; Bangladesh display Asia/Dhaka | Locale and boundary tests |
| NFR-OBS-001 | Diagnose hangs, account locks and stuck jobs | Logs/metrics/correlation without patient leakage | Incident simulation |

## Setting a target
Record action, load, dataset size, environment, percentile/threshold, owner and evidence. For example, a reception search latency goal must specify active users and indexed record count; a generic fast requirement is not a finished target. Numeric suggestions from agents remain proposals until approved.

## Availability and recovery
Whole-hospital use includes overnight work; do not copy a vague working-hours promise into a 24-hour hospital plan. Distinguish database recovery, file recovery and external payment reconciliation. Offline synchronization is not promised merely because power/internet outages are possible.

## Integrity and maintainability
Use transactional state, exact totals, consistent source references, documented interfaces and meaningful tests. SonarQube/coverage does not demonstrate correct patient identity, clinical release or cross-tenant isolation. Implemented quality targets link to TRACEABILITY and the release gate.
