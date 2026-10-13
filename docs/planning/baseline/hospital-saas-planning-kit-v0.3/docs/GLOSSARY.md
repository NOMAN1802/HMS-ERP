# Domain glossary
Purpose: keep conversation terms, screen labels and database concepts consistent.
Status: working vocabulary; final labels and translations need product review.

| Term | Meaning in this product |
| --- | --- |
| Tenant/customer | The hospital organization buying the SaaS product |
| Facility | A hospital/care location within the customer organization |
| Department | Operational area such as laboratory or emergency |
| MRN | Hospital-issued patient record number; identifier scope must be explicit |
| Patient | Person's clinical identity, retained across visits |
| Appointment | A booked future slot; may be rescheduled or cancelled |
| Visit/encounter | An actual interaction, created/linked at check-in or direct arrival |
| Next visit | Familiar label for a follow-up booking; actual attendance remains a separate visit |
| OPD | Outpatient care |
| IPD/admission | Inpatient stay, possibly starting while awaiting a bed |
| Daycare | Same-day admission/service workflow from source documents; exact boundaries OPEN |
| Service order | Request to provide consultation, test, imaging or another service |
| Prescription | Clinician's medicine instructions; distinct from dispensing |
| Dispensing | Pharmacy actually issues medicines to the patient |
| Indent | Internal request for medicines/items from a store or pharmacy |
| Invoice/bill | Recorded charges owed; distinct from payment and receipt |
| Receipt | Evidence of recorded payment/allocation |
| Deposit | Money received before or during services, with defined allocation rules |
| LIS | Laboratory information system |
| RIS | Radiology information system |
| PACS | Imaging archive/viewer integration; a full implementation is not implied |
| Specimen/sample | Collected material associated with a patient and ordered tests |
| Verified/released result | Result reviewed and made available by permitted staff |
| GRN | Goods received record against a purchase or authorized receipt |
| Reagent | Lab material consumed while running tests |
| B2B client | Organization using the hospital's diagnostic services |
| Working share/referral | Source terminology for allocation/payment policies; formulas OPEN |
| Medical discharge | Clinical decision to end the stay |
| Financial clearance | Billing/finance check; not automatically the same as medical discharge |

Store date-only values separately from timestamps. Bangladesh business display uses Asia/Dhaka; define business-day cutoffs explicitly. English abbreviations in source documents must not become opaque permission codes in the new UI. Preserve provenance for ambiguous legacy codes rather than guessing their meaning.
