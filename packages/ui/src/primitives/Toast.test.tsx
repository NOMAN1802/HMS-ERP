import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from './Button.js';
import { ToastProvider, useToast } from './Toast.js';

function Trigger({ tone, durationMs }: { tone?: 'info' | 'danger'; durationMs?: number }) {
  const { show } = useToast();
  return (
    <Button
      onClick={() =>
        show({
          title: 'Receipt printed',
          description: 'RCPT-45',
          ...(tone ? { tone } : {}),
          ...(durationMs !== undefined ? { durationMs } : {}),
        })
      }
    >
      Notify
    </Button>
  );
}

function setup(props: { tone?: 'info' | 'danger'; durationMs?: number } = {}) {
  return render(
    <ToastProvider regionLabel="Notifications" closeLabel="Dismiss">
      <Trigger {...props} />
    </ToastProvider>,
  );
}

afterEach(() => {
  vi.useRealTimers();
});

describe('Toast', () => {
  it('shows a titled toast in a labelled list', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    const list = screen.getByRole('list', { name: 'Notifications' });
    expect(list.textContent).toContain('Receipt printed');
    expect(list.textContent).toContain('RCPT-45');
  });

  it('announces through the live region, assertively for danger', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    setup({ tone: 'danger' });
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(80);
    });
    const assertive = document.querySelector('[aria-live="assertive"]') as HTMLElement;
    expect(assertive.textContent).toBe('Receipt printed. RCPT-45');
  });

  it('dismisses on its own after the duration', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    setup({ durationMs: 1000 });
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByRole('list', { name: 'Notifications' })).toBeTruthy();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });
    expect(screen.queryByRole('list', { name: 'Notifications' })).toBeNull();
  });

  it('keeps a danger toast until it is dismissed', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    setup({ tone: 'danger' });
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000);
    });
    expect(screen.getByRole('list', { name: 'Notifications' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByRole('list', { name: 'Notifications' })).toBeNull();
  });

  it('throws a clear error when used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Trigger />)).toThrow('ToastProvider');
    spy.mockRestore();
  });
});
