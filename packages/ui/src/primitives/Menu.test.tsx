import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button.js';
import { Menu, type MenuItem } from './Menu.js';

function setup() {
  const onPrint = vi.fn();
  const onCancel = vi.fn();
  const items: MenuItem[] = [
    { id: 'print', label: 'Print receipt', onSelect: onPrint },
    { id: 'copy', label: 'Reprint copy', onSelect: () => {}, disabled: true },
    { id: 'cancel', label: 'Cancel invoice', onSelect: onCancel, tone: 'danger' },
  ];
  render(
    <Menu
      menuLabel="Invoice actions"
      items={items}
      trigger={(props) => <Button {...props}>Actions</Button>}
    />,
  );
  return { onPrint, onCancel };
}

describe('Menu', () => {
  it('exposes the trigger state and opens on the first item', async () => {
    const user = userEvent.setup();
    setup();
    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await user.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('menu', { name: 'Invoice actions' })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Print receipt' }));
  });

  it('moves with arrows, skips disabled items and wraps', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Cancel invoice' }));
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Print receipt' }));
    await user.keyboard('{End}');
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Cancel invoice' }));
  });

  it('opens on the last item with ArrowUp from the trigger', async () => {
    const user = userEvent.setup();
    setup();
    await user.tab();
    await user.keyboard('{ArrowUp}');
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Cancel invoice' }));
  });

  it('selects with Enter, closes and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    const { onPrint } = setup();
    const trigger = screen.getByRole('button', { name: 'Actions' });
    await user.click(trigger);
    await user.keyboard('{Enter}');
    expect(onPrint).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('closes on Escape and returns focus', async () => {
    const user = userEvent.setup();
    setup();
    const trigger = screen.getByRole('button', { name: 'Actions' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('jumps to an item by typing', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.keyboard('c');
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Cancel invoice' }));
  });

  it('does not run a disabled item', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByRole('menuitem', { name: 'Reprint copy' }));
    expect(screen.getByRole('menu')).toBeTruthy();
  });
});
