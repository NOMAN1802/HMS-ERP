import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DesktopOnlyNotice } from './DesktopOnlyNotice.js';

describe('DesktopOnlyNotice', () => {
  it('states plainly that the task is not available on a phone', () => {
    render(<DesktopOnlyNotice title="Use a tablet or computer" body="Not available on a phone." />);
    expect(screen.getByRole('status').textContent).toContain('Use a tablet or computer');
    expect(screen.getByRole('status').textContent).toContain('Not available on a phone.');
  });
});
