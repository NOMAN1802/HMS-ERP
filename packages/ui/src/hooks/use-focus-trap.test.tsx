import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { describe, expect, it } from 'vitest';
import { useFocusTrap } from './use-focus-trap.js';

function Harness() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, { active: open });
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        open
      </button>
      {open ? (
        <div ref={ref} tabIndex={-1} role="dialog" aria-label="trap">
          <button type="button">first</button>
          <button type="button" onClick={() => setOpen(false)}>
            last
          </button>
        </div>
      ) : null}
    </div>
  );
}

describe('useFocusTrap', () => {
  it('moves focus in on open, cycles on Tab and Shift+Tab, and restores focus on close', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'open' });
    await user.click(opener);

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'first' }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'last' }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'first' }));
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'last' }));

    await user.keyboard('{Enter}');
    expect(document.activeElement).toBe(opener);
  });
});
