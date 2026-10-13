import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// One .env at the repository root serves every app and package.
config({ path: fileURLToPath(new URL('../../.env', import.meta.url)), quiet: true });

// Migrations connect as hms_migrator on a DIRECT connection (not through a pooler).
// The application connects as hms_app (ADR-003).
// The URL is optional so `prisma generate` (build, typecheck) works without a database.
const migratorUrl = process.env.DATABASE_MIGRATOR_URL;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  ...(migratorUrl ? { datasource: { url: migratorUrl } } : {}),
});
