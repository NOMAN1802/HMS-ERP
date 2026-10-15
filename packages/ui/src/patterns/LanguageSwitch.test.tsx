import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LanguageSwitch } from './LanguageSwitch.js';

const OPTIONS = [
  { value: 'bn-BD', label: 'Bangla' },
  { value: 'en', label: 'English' },
] as const;

describe('LanguageSwitch', () => {
  it('is a labelled group whose pressed button is the current language', () => {
    render(<LanguageSwitch value="bn-BD" options={OPTIONS} onChange={() => {}} label="Language" />);
    expect(screen.getByRole('group', { name: 'Language' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Bangla' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
    expect(screen.getByRole('button', { name: 'English' }).getAttribute('aria-pressed')).toBe(
      'false',
    );
  });

  it('reports the other language when pressed and ignores the current one', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<LanguageSwitch value="bn-BD" options={OPTIONS} onChange={onChange} label="Language" />);
    await user.click(screen.getByRole('button', { name: 'Bangla' }));
    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'English' }));
    expect(onChange).toHaveBeenCalledWith('en');
  });
});
