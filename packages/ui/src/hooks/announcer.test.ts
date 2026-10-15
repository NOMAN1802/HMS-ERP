import { afterEach, describe, expect, it, vi } from 'vitest';
import { announce, ensureAnnouncer } from './announcer.js';

afterEach(() => {
  vi.useRealTimers();
});

describe('announcer', () => {
  it('creates polite and assertive live regions once', () => {
    ensureAnnouncer();
    ensureAnnouncer();
    expect(document.querySelectorAll('[aria-live="polite"]')).toHaveLength(1);
    expect(document.querySelector('[aria-live="assertive"]')?.getAttribute('role')).toBe('alert');
  });

  it('sets the message after a short delay so it is announced', () => {
    vi.useFakeTimers();
    announce('3 results');
    const region = document.querySelector('[aria-live="polite"]') as HTMLElement;
    expect(region.textContent).toBe('');
    vi.advanceTimersByTime(60);
    expect(region.textContent).toBe('3 results');
  });
});
