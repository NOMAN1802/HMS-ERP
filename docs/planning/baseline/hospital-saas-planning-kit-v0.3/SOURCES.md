# Sources, provenance and limits
Purpose: show where requirements came from and how conflicts are resolved.
Updated: 2026-10-10. This update analyzes supplied files/conversation; it does not newly verify external technical or legal sources.

## Primary sources
| Code | Supplied document | Role in the plan |
| --- | --- | --- |
| S1 | HMS ম্যানুয়াল1(1).docx | Existing workflow/menu/permission/report inventory |
| S2 | Hospital_Lab_Software_Feedback_Report(1).docx | Specific lab staff issues and requests |
| S3 | Hospital_Software_Nurse Requirements(1).docx | Six nursing issues and six requested improvements |
| S4 | SRS_Sodhani_Medical_HMS_Bytespate.docx | Earlier combined baseline derived from manual/feedback |
| S5 | SRS_Sodhani_Medical_HMS_Bytespate 1.docx | Expanded earlier SRS, including machine/radiology and delivery material |
| S6 | Sondhany_Medical_HMS_SRS_Bytespate_Limited_v1.2_New_Software(1).docx | New-system direction and detailed lab/nursing/billing traceability |
| S7 | Sondhany_Medical_HMS_SRS_Bytespate_Limited_v2.0_Consolidated(1).docx | Consolidated functional/nonfunctional baseline |

User conversation supplies the SaaS direction, stack, payment/billing choices and additional workflows. DECISIONS records those separately. S6/S7 are useful consolidations but not a replacement for the owner's decisions or direct department feedback.

## Source limitations
The SRS cites a Billing Feedback Report with 27 issues and 22 requirements. That original billing report is not one of the seven attached files; billing requirements are available through its SRS-derived consolidation. Preserve that distinction rather than claiming direct review of the original report.
Older SRS versions overlap and contain source-specific assumptions. Date/version labels and menu counts are inconsistent across documents; retain capabilities rather than deriving implementation package counts from them. Legacy codes whose meaning is unclear must be clarified.
No timeline/budget/staffing estimates are carried into this agent-driven plan. No real patient records or original attachments are bundled in this ZIP. Requirements are paraphrased and linked by source code in SOURCE_REQUIREMENTS.

## Conflict priority
Explicit owner decision -> latest owner-approved specification -> adopted source requirement. Proposed designs and unresolved legacy rules remain visible. Source-specific rules such as bed cutoff, eosinophil rounding and referral formulas require confirmation.

## Technical reference pointers
At implementation time consult official NestJS, Next.js, PostgreSQL, Prisma, Turborepo, Zod, TanStack and chosen coding-client documentation for pinned versions. The earlier ZIP included external links; their contents/version accuracy were not revalidated for this update. No external claim is needed to interpret the source-derived requirements in this pack.
