@AGENTS.md

# Claude client entry point
Purpose: expose the shared repository instructions to the selected coding client.
The authoritative instructions are in AGENTS.md. Product context is in CONTEXT.md; decisions and open questions are in docs/. A task supplies the specific module and acceptance context.

This import is an intended setup convention, not proof that a particular installed client loads it. Verify instruction discovery during scaffold setup using that client's current documentation. Add scoped adapters only where necessary and keep business rules in the shared specs. Do not copy a second independent set of billing or tenancy rules here.
