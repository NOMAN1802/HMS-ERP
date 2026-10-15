import { describe, expect, it } from 'vitest';
import { expiryState, minutesLeft } from './expiry';

const NOW = Date.parse('2026-10-15T10:00:00.000Z');
const at = (seconds: number): string => new Date(NOW + seconds * 1000).toISOString();

describe('expiryState', () => {
  it('shows nothing while there is plenty of time', () => {
    const state = expiryState({ idleExpiresAt: at(1800), absoluteExpiresAt: at(30000) }, NOW);
    expect(state.mode).toBeNull();
  });

  it('warns during the last two minutes of the idle timeout', () => {
    const state = expiryState({ idleExpiresAt: at(120), absoluteExpiresAt: at(30000) }, NOW);
    expect(state).toEqual({ mode: 'warning', secondsLeft: 120 });
    expect(
      expiryState({ idleExpiresAt: at(121), absoluteExpiresAt: at(30000) }, NOW).mode,
    ).toBeNull();
  });

  it('follows whichever limit comes first', () => {
    const state = expiryState({ idleExpiresAt: at(1800), absoluteExpiresAt: at(60) }, NOW);
    expect(state).toEqual({ mode: 'warning', secondsLeft: 60 });
  });

  it('is expired at and after the end time', () => {
    expect(expiryState({ idleExpiresAt: at(0), absoluteExpiresAt: at(900) }, NOW).mode).toBe(
      'expired',
    );
    expect(expiryState({ idleExpiresAt: at(-30), absoluteExpiresAt: at(900) }, NOW).mode).toBe(
      'expired',
    );
  });
});

describe('minutesLeft', () => {
  it('rounds up and never shows zero minutes', () => {
    expect(minutesLeft(120)).toBe(2);
    expect(minutesLeft(61)).toBe(2);
    expect(minutesLeft(5)).toBe(1);
  });
});
