import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useDismiss } from './use-dismiss.js';

function Overlay({ label, onDismiss }: { label: string; onDismiss: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useDismiss({ enabled: true, onDismiss, insideRefs: [ref] });
  return (
    <div ref={ref}>
      <button type="button">{label}</button>
    </div>
  );
}

describe('useDismiss', () => {
  it('dismisses on a press outside but not inside', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <div>
        <button type="button">outside</button>
        <Overlay label="inside" onDismiss={onDismiss} />
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'inside' }));
    expect(onDismiss).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'outside' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('lets Escape close only the top-most overlay', async () => {
    const user = userEvent.setup();
    const lower = vi.fn();
    const upper = vi.fn();
    render(
      <div>
        <Overlay label="lower" onDismiss={lower} />
        <Overlay label="upper" onDismiss={upper} />
      </div>,
    );
    await user.keyboard('{Escape}');
    expect(upper).toHaveBeenCalledTimes(1);
    expect(lower).not.toHaveBeenCalled();
  });
});
