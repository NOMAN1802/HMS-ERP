import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// SWC emits decorator metadata, which NestJS dependency injection needs (ADR-018).
export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    include: ['src/**/*.spec.ts'],
    coverage: { provider: 'v8', reporter: ['text', 'lcov'], include: ['src/**'] },
  },
});
