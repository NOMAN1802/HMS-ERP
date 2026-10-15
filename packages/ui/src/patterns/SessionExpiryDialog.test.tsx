import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SessionExpiryDialog, type SessionExpiryDialogProps } from './SessionExpiryDialog.js';

function props(overrides: Partial<SessionExpiryDialogProps> = {}): SessionExpiryDialogProps {
  return {
    mode: 'warning',
    title: 'Your session is about to end',
    body: 'You will be signed out in 2 minutes.',
    stayLabel: 'Stay signed in',
    signOutLabel: 'Sign out',
    signInAgainLabel: 'Sign in again',
    closeLabel: 'Close',
    onStay: () => {},
    onSignOut: () => {},
    onSignInAgain: () => {},
    ...overrides,
  };
}

describe('SessionExpiryDialog', () => {
  it('renders nothing when there is no mode', () => {
    render(<SessionExpiryDialog {...props({ mode: null })} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('offers to stay signed in or sign out during the warning', async () => {
    const user = userEvent.setup();
    const onStay = vi.fn();
    const onSignOut = vi.fn();
    render(<SessionExpiryDialog {...props({ onStay, onSignOut })} />);
    expect(screen.getByRole('dialog', { name: 'Your session is about to end' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Stay signed in' }));
    await user.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(onStay).toHaveBeenCalledTimes(1);
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  it('cannot be dismissed with Escape: it needs a decision', async () => {
    const user = userEvent.setup();
    render(<SessionExpiryDialog {...props()} />);
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('only offers to sign in again once the session has ended', async () => {
    const user = userEvent.setup();
    const onSignInAgain = vi.fn();
    render(
      <SessionExpiryDialog
        {...props({ mode: 'expired', title: 'Your session has ended', onSignInAgain })}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Stay signed in' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Sign in again' }));
    expect(onSignInAgain).toHaveBeenCalledTimes(1);
  });
});
