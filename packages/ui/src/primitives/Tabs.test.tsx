import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { type TabItem, Tabs } from './Tabs.js';

const TABS: TabItem[] = [
  { id: 'visits', label: 'Visits', content: <p>Visit list</p> },
  { id: 'invoices', label: 'Invoices', content: <p>Invoice list</p>, disabled: true },
  { id: 'reports', label: 'Reports', content: <p>Report list</p> },
];

describe('Tabs', () => {
  it('names panels from tabs and selects the first enabled tab', () => {
    render(<Tabs label="Patient record" tabs={TABS} />);
    const visits = screen.getByRole('tab', { name: 'Visits' });
    expect(screen.getByRole('tablist', { name: 'Patient record' })).toBeTruthy();
    expect(visits.getAttribute('aria-selected')).toBe('true');
    expect(visits.getAttribute('tabindex')).toBe('0');
    expect(screen.getByRole('tab', { name: 'Reports' }).getAttribute('tabindex')).toBe('-1');
    expect(screen.getByRole('tabpanel', { name: 'Visits' })).toBeTruthy();
  });

  it('moves and selects with arrows, skipping disabled tabs', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tabs label="Patient record" tabs={TABS} onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Reports' }));
    expect(onValueChange).toHaveBeenCalledWith('reports');
    expect(screen.getByRole('tabpanel', { name: 'Reports' })).toBeTruthy();

    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Visits' }));
    await user.keyboard('{End}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Reports' }));
    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Visits' }));
  });

  it('selects on click and ignores a disabled tab', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Patient record" tabs={TABS} />);
    await user.click(screen.getByRole('tab', { name: 'Invoices' }));
    expect(screen.getByRole('tab', { name: 'Visits' }).getAttribute('aria-selected')).toBe('true');
    await user.click(screen.getByRole('tab', { name: 'Reports' }));
    expect(screen.getByRole('tab', { name: 'Reports' }).getAttribute('aria-selected')).toBe('true');
  });

  it('follows the value when controlled', () => {
    render(<Tabs label="Patient record" tabs={TABS} value="reports" />);
    expect(screen.getByRole('tab', { name: 'Reports' }).getAttribute('aria-selected')).toBe('true');
  });
});
