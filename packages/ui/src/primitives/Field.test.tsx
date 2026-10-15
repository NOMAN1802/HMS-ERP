import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Field } from './Field.js';
import { TextInput } from './TextInput.js';

function Example({ error }: { error?: string }) {
  return (
    <Field label="Phone" hint="11 digits" {...(error ? { error } : {})} required>
      {({ id, invalid, required, ...aria }) => (
        <TextInput id={id} invalid={invalid} required={required} {...aria} />
      )}
    </Field>
  );
}

describe('Field', () => {
  it('connects label, hint and control', () => {
    render(<Example />);
    const input = screen.getByLabelText(/Phone/);
    expect(input.getAttribute('aria-describedby')).toContain('hint');
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('adds the error to the description and marks the control invalid', () => {
    render(<Example error="Enter 11 digits" />);
    const input = screen.getByLabelText(/Phone/);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    const errorId = describedBy.split(' ').find((id) => id.endsWith('error')) as string;
    expect(document.getElementById(errorId)?.textContent).toBe('Enter 11 digits');
  });
});
