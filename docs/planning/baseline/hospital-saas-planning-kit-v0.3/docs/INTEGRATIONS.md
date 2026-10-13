# External integrations
Purpose: capture real partner constraints and keep device/provider code outside core rules.
Status: discovery and interface design OPEN.

## Known source request
EXL-200 biochemistry analyzer Blood Urea results are reported missing in the legacy system. The new requirement is reliable mapped result receipt; protocol, device/network details, test code/unit mapping, sample identifiers and error recovery are not supplied. It is not valid to promise compatibility before obtaining and testing these details.

## Inventory template
For every analyzer, payment provider, printer/scanner, PACS/RIS, messaging, attendance device, accounting system or migration source record vendor/version, protocol, credentials, route, sandbox, mapping, match identifiers, delivery guarantees, failure recovery and acceptance contact.

## Payment modes versus gateway
Cash/card/mobile/bank transfer recording is confirmed. Source material names bKash. Whether payments are manually recorded or gateway integrated is OPEN. A stored method is not proof of online settlement. If a gateway is adopted, validate signed callbacks, deduplicate provider references, preserve pending/confirmed/failed/unknown state and reconcile refunds/timeouts.

## Adapter design
Versioned adapters translate partner messages into internal commands. Preserve source IDs, tenant routing and provenance. Quarantine unmatched patient/order/sample data for authorized resolution. Durable inbox/outbox and replay tools prevent repeated imports/postings. Do not embed device parsing throughout Nest domain modules.

## Standards and boundaries
FHIR, HL7 v2, ASTM and DICOM/PACS are possible partner-dependent boundaries, not automatically approved obligations. Verify actual protocol/version with the vendor at implementation time. A radiology module does not imply a full PACS. Government/national integration discovery remains deferred by the owner.

## Acceptance example
Replay the same analyzer message twice: one mapped result is retained and duplicate handling is observable. An unknown sample ID goes to a reconciliation queue rather than attaching to a guessed patient. Failed printer output can be retried without generating another payment/order.
