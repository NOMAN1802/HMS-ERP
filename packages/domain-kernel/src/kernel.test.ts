import { describe, expect, it } from 'vitest';
import { DomainError, fixedClock } from './index.js';

describe('fixedClock', () => {
  it('returns the start time until advanced', () => {
    const clock = fixedClock(new Date('2026-10-14T00:00:00.000Z'));
    expect(clock.now().toISOString()).toBe('2026-10-14T00:00:00.000Z');
    clock.advanceBy(60_000);
    expect(clock.now().toISOString()).toBe('2026-10-14T00:01:00.000Z');
  });
});

describe('DomainError', () => {
  it('keeps the code and details', () => {
    const error = new DomainError('ACCOUNT_LOCKED', 'locked', { lockedUntil: 'x' });
    expect(error.code).toBe('ACCOUNT_LOCKED');
    expect(error.details).toEqual({ lockedUntil: 'x' });
    expect(error).toBeInstanceOf(Error);
  });
});
