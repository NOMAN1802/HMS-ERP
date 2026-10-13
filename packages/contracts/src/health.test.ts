import { describe, expect, it } from 'vitest';
import { healthResponseSchema } from './health.js';

describe('healthResponseSchema', () => {
  it('accepts a well-formed health response', () => {
    const parsed = healthResponseSchema.parse({
      status: 'ok',
      service: 'api',
      time: '2026-10-13T10:00:00.000Z',
    });
    expect(parsed.service).toBe('api');
  });

  it('rejects a non-ISO time', () => {
    const result = healthResponseSchema.safeParse({ status: 'ok', service: 'api', time: 'today' });
    expect(result.success).toBe(false);
  });
});
