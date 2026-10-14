// Login settings. Defaults are the C-032 decisions; per-hospital overrides (CP-12) come with
// policy versions (T-PLT-05).
import type { SessionTimeouts } from '../domain/session-policy.js';

export interface AuthConfig {
  timeouts: SessionTimeouts;
  csrfSecret: string;
}

export const AUTH_CONFIG = Symbol('AUTH_CONFIG');
export const CLOCK = Symbol('CLOCK');

function positiveNumber(value: string | undefined, fallback: number, name: string): number {
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) throw new Error(`${name} must be a positive number`);
  return parsed;
}

export function loadAuthConfig(env: NodeJS.ProcessEnv): AuthConfig {
  const csrfSecret = env.CSRF_SECRET ?? '';
  if (csrfSecret.length < 32) throw new Error('CSRF_SECRET must be at least 32 characters');
  return {
    csrfSecret,
    timeouts: {
      idleMinutes: positiveNumber(env.SESSION_IDLE_TIMEOUT_MIN, 60, 'SESSION_IDLE_TIMEOUT_MIN'),
      absoluteHours: positiveNumber(
        env.SESSION_ABSOLUTE_TIMEOUT_H,
        12,
        'SESSION_ABSOLUTE_TIMEOUT_H',
      ),
    },
  };
}
