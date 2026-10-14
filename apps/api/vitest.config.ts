import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// API tests use DATABASE_URL from the root .env locally; CI sets it directly.
config({ path: fileURLToPath(new URL('../../.env', import.meta.url)), quiet: true });

// SWC emits decorator metadata, which NestJS dependency injection needs (ADR-018).
export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    include: ['src/**/*.spec.ts'],
    coverage: { provider: 'v8', reporter: ['text', 'lcov'], include: ['src/**'] },
  },
});
