import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert } from './Alert.js';

describe('Alert', () => {
  it('announces a problem immediately', () => {
    render(<Alert tone="danger">The password is not correct.</Alert>);
    expect(screen.getByRole('alert').textContent).toContain('The password is not correct.');
  });

  it('keeps a notice polite', () => {
    render(<Alert tone="info">Saved earlier.</Alert>);
    expect(screen.getByRole('status').textContent).toContain('Saved earlier.');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('shows an optional title before the message', () => {
    render(
      <Alert tone="warning" title="Check this">
        Details here.
      </Alert>,
    );
    expect(screen.getByRole('alert').textContent).toBe('Check thisDetails here.');
  });
});
