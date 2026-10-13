# Project instructions

Hospital ERP sold as SaaS. Read [README.md](README.md) for layout and commands, and [docs/planning/README.md](docs/planning/README.md) for requirements and design. Coding agents follow [G §5](docs/planning/docs/G-implementation-plan.md#5-context-packet-for-each-agent-task).

## Git: always push to all three remotes

| Remote   | URL                                       | Role     |
| -------- | ----------------------------------------- | -------- |
| `origin` | https://github.com/byteSpate/HMS-SaaS.git | Main     |
| `reza`   | https://github.com/rezaulrht/HMS-ERP.git  | Backup 1 |
| `noman`  | https://github.com/NOMAN1802/HMS-ERP.git  | Backup 2 |

After every commit that is pushed, push the same branch to **all three**:

```bash
git push origin <branch> && git push reza <branch> && git push noman <branch>
```

- Never force-push. If a remote rejects a push, fetch and investigate instead.
- If the remotes are missing (fresh clone), add them:
  `git remote add reza https://github.com/rezaulrht/HMS-ERP.git && git remote add noman https://github.com/NOMAN1802/HMS-ERP.git`

## Secrets

- Database URLs and passwords live only in `.env` (git-ignored). Never commit them or write them into docs.
- Supabase: the app connects as `hms_app` (RLS enforced), migrations as `hms_migrator`. Never point the app at the Supabase `postgres` or `service_role` users; they bypass RLS (ADR-019).
