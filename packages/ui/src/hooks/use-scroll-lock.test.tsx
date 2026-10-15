import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useScrollLock } from './use-scroll-lock.js';

function Lock({ active = true }: { active?: boolean }) {
  useScrollLock(active);
  return null;
}

describe('useScrollLock', () => {
  it('locks while any lock is active and restores after the last one', () => {
    const root = document.documentElement;
    const first = render(<Lock />);
    const second = render(<Lock />);
    expect(root.style.overflow).toBe('hidden');
    first.unmount();
    expect(root.style.overflow).toBe('hidden');
    second.unmount();
    expect(root.style.overflow).toBe('');
  });
});
