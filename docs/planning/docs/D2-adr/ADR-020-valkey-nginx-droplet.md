# ADR-020 — Valkey for queues; nginx on the existing droplet

- **Status:** ACCEPTED by the product owner on 2026-10-13 (Valkey). nginx is the stated intent; confirm at T-OPS-01.
- **Date:** 2026-10-13
- **Resolves:** the Redis 8 vs Valkey choice in [ADR-006](ADR-006-outbox-jobs.md) (CX-015)
- **Amends:** [ADR-011](ADR-011-vps-topology.md) (Caddy → nginx; shared droplet)

## Decision

1. **Valkey 9**, self-hosted in Docker, backs BullMQ. Valkey is BSD-licensed and a drop-in replacement for Redis. Settings: `appendonly yes`, `maxmemory-policy noeviction`.
   - Local development: `valkey` service in `docker/compose.dev.yaml`.
   - Staging/demo: a Valkey container on the droplet, bound to the private Docker network only.
   - A hosted Valkey/Redis service is not used for BullMQ. BullMQ workers poll and issue many commands, which quickly exhausts per-command free tiers.
2. **nginx** is the reverse proxy and TLS terminator, matching the team's existing project on the same droplet. TLS via Let's Encrypt (certbot). The Caddy template in `templates/caddy` is not used.
3. **Hosting target for staging/demos:** the existing DigitalOcean droplet in SGP1 (2 vCPU / 4 GB / 120 GB), shared with another application. HMS runs `api`, `worker`, `web` and `valkey` in Docker Compose. The database is on Supabase (ADR-019).

## Consequences

- The existing nginx gets new `server` blocks for the HMS domain(s), proxying to the HMS containers on localhost ports. The other app's configuration is not modified.
- Sharing a droplet is acceptable for staging and demos. Production with real hospital data needs its own droplet (revisit at RG-3).
