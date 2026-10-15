import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button.js';
import { Dialog } from './Dialog.js';

function Harness({ onOpenChange = () => {} }: { onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          onOpenChange(next);
          setOpen(next);
        }}
        title="Discard changes?"
        description="Unsaved input will be lost."
        closeLabel="Close"
        footer={<Button>Discard</Button>}
      >
        <p>Body</p>
      </Dialog>
    </div>
  );
}

describe('Dialog', () => {
  it('is a labelled modal dialog and moves focus into it', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Open' }));

    const dialog = screen.getByRole('dialog', { name: 'Discard changes?' });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-describedby')).not.toBeNull();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('keeps Tab inside and makes the page behind inert', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');

    for (let i = 0; i < 6; i += 1) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
    expect(container.hasAttribute('inert')).toBe(true);
  });

  it('closes on Escape and returns focus to the opener', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Harness onOpenChange={onOpenChange} />);
    const opener = screen.getByRole('button', { name: 'Open' });
    await user.click(opener);
    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
    expect(document.body.hasAttribute('inert')).toBe(false);
  });

  it('gives focus back only after the page behind is no longer inert', async () => {
    // Browsers refuse focus() on an inert element; jsdom does not, so record the state instead.
    const user = userEvent.setup();
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Open' });
    await user.click(opener);

    const inertWhenFocused: boolean[] = [];
    const focus = opener.focus.bind(opener);
    vi.spyOn(opener, 'focus').mockImplementation((options) => {
      inertWhenFocused.push(opener.closest('[inert]') !== null);
      focus(options);
    });
    await user.keyboard('{Escape}');

    expect(inertWhenFocused.length).toBeGreaterThan(0);
    expect(inertWhenFocused.every((inert) => !inert)).toBe(true);
  });

  it('closes from the close button and from a press on the backdrop', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Open' }));
    const backdrop = document.querySelector('[aria-hidden="true"].absolute') as HTMLElement;
    await user.click(backdrop);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('stays open when the owner ignores the close request', async () => {
    const user = userEvent.setup();
    render(
      <Dialog open onOpenChange={() => {}} title="Locked" closeLabel="Close">
        <p>Unsaved</p>
      </Dialog>,
    );
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog', { name: 'Locked' })).toBeTruthy();
  });
});
