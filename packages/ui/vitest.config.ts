import { defineConfig } from 'vitest/config';

// Components are tested in jsdom with Testing Library; the token tests also run here (they only
// read CSS files). Real-browser behavior and axe checks live in apps/web e2e (ADR-022 section 8).
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
