# SaaS customer platform
Purpose: design the hospital-as-customer lifecycle separately from patient care and patient billing.
Status: whole-hospital multi-customer product CONFIRMED; lifecycle design PROPOSED.

## Provisioning journey
Create customer organization -> configure facilities -> create hospital administrator membership -> enable purchased modules -> configure masters/prices/templates -> import or seed data -> verify -> activate.
Provisioning should be repeatable without duplicate organizations or partial hidden setup. Track each step, failures and retries. Product plans and limits are OPEN commercial decisions.

## Hospital permissions versus purchased features
An entitlement says the hospital has the LIS module. A user permission says a particular lab employee may release a result. Both checks may apply; an entitlement never grants clinical authority. SaaS vendor invoices belong to subscription billing, while patients' invoices belong to the hospital's financial records.

## Tenant configuration
Proposed versioned settings include facility timezone, branding, numbering, language, price lists, payment eligibility, discounts, report templates and lab ranges/methods. Clinical/financial policy changes need effective dates. Existing invoices/results retain the configuration used when created or released; editing a setting must not rewrite history.

## Vendor support
Vendor console exposes customer metadata and service health with no routine clinical access. Any patient-data support access needs a defined customer-authorized, scoped and audited process. Separate vendor identity/session audience from hospital staff authorization.

## Commercial lifecycle
Trial, active, suspended and terminated states are proposals. Decide grace periods, export, retention and continuity for active care before implementing module blocking. Subscription delinquency must not accidentally break an active hospitalization through an unreviewed generic entitlement check.

## Example acceptance
Customer A enables a service policy requiring full payment; customer B permits a deposit. Saving B's policy leaves A unchanged. A cashier can record patient payment without being able to change subscription entitlements. Retried provisioning does not create a second tenant.
