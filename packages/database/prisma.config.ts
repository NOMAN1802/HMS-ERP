import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

// One .env at the repository root serves every app and package.
config({ path: fileURLToPath(new URL('../../.env', import.meta.url)), quiet: true });

// Migrations connect as hms_migrator on a DIRECT connection (not through a pooler).
// The application connects as hms_app (ADR-003).
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: env('DATABASE_MIGRATOR_URL') },
});
