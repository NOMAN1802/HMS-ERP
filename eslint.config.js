import js from '@eslint/js';
import { uiGuardrails, webGuardrails } from '@hms/config-eslint';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// ESLint + SonarJS rules gate pull requests; SonarQube Community analyses main only (ADR-012).
export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      '**/generated/**',
      '**/next-env.d.ts',
      'docs/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  sonarjs.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}', 'packages/ui/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  // Reuse guardrails for the client (ADR-022 section 9): rules and their tests live in
  // packages/config-eslint.
  ...webGuardrails,
  ...uiGuardrails,
);
