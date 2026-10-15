import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBadge, type StatusKind } from './StatusBadge.js';

const STATUSES: StatusKind[] = ['idle', 'active', 'review', 'attention', 'done', 'problem'];

describe('StatusBadge', () => {
  it.each(STATUSES)('shows the %s word and an icon, not color alone', (status) => {
    const { container } = render(<StatusBadge status={status} label={`State ${status}`} />);
    expect(screen.getByText(`State ${status}`)).toBeTruthy();
    expect(container.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  });
});
