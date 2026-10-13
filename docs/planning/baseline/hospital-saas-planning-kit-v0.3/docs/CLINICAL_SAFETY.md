# Clinical workflow correctness
Purpose: identify the hospital-specific rules agents must obtain from qualified users.
Status: engineering checklist; domain review required for relevant implementation tasks.
Government-rule discussion is deferred; this document concerns ordinary patient/workflow correctness.

## Patient and record identity
Preserve visible patient/visit/admission context. Unknown emergency identities and duplicate resolution require history. Staff review the identifying fields used at collection, consultation, dispensing and report delivery; phone similarity does not justify automatic merge.

## Prescriptions and medication work
Doctor writes prescription; pharmacy issues medicines; nursing administration, if in scope, is another event. Define medication/strength/form, dose, route, frequency, duration and allergy/unknown states with hospital reviewers. Catalogues, substitutions and dose rules are not generated from assumptions.

## Lab and imaging results
Lab users define approved units/ranges/methods, rounding and report formats. Reviewer/release permissions and amendment history are explicit. Versioned releases preserve the reviewed content. Printing/navigation cannot downgrade state. Critical-result notification/acknowledgment workflow needs separate domain requirements rather than assuming report printing means the doctor saw it.

## Payment and admission interaction
General payment-first and deposit support are confirmed. Emergency exceptions and medical-versus-financial discharge behavior are unresolved and must be discussed. Agents do not derive clinical denial rules from a generic invoice state.

## Review evidence
Department users validate patient selection, sample labels, prescriptions, released reports, corrections, returns and handoffs with synthetic examples. Record reviewer, scope and unresolved limits. A review of one lab format does not approve all clinical rules; SonarQube and passing unit tests do not replace this evidence.
