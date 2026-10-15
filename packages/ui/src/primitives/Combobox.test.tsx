import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Combobox, type ComboboxOption } from './Combobox.js';
import { Dialog } from './Dialog.js';

const OPTIONS: ComboboxOption[] = [
  { id: 'p1', label: 'Rahim Uddin', description: 'MRN-000123' },
  { id: 'p2', label: 'Rahima Khatun', description: 'MRN-000877' },
  { id: 'p3', label: 'Karim Ahmed', description: 'MRN-000412', disabled: true },
];

function setup(props: Partial<React.ComponentProps<typeof Combobox>> = {}) {
  const handlers = {
    onValueChange: vi.fn(),
    onQueryChange: vi.fn(),
    onSubmitQuery: vi.fn(),
  };
  render(
    <Combobox
      aria-label="Search patient"
      options={OPTIONS}
      listLabel="Patients"
      emptyLabel="No patients found"
      loadingLabel="Searching"
      announceResults={(count) => `${count} results`}
      {...handlers}
      {...props}
    />,
  );
  return { ...handlers, input: screen.getByRole('combobox', { name: 'Search patient' }) };
}

describe('Combobox', () => {
  it('opens a labelled listbox with options as the user types', async () => {
    const user = userEvent.setup();
    const { input, onQueryChange } = setup();
    expect(input.getAttribute('aria-expanded')).toBe('false');

    await user.type(input, 'ra');
    expect(onQueryChange).toHaveBeenLastCalledWith('ra');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('listbox', { name: 'Patients' })).toBeTruthy();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('moves the active option with arrows, skipping disabled, and selects with Enter', async () => {
    const user = userEvent.setup();
    const { input, onValueChange } = setup();
    await user.type(input, 'ra');
    await user.keyboard('{ArrowDown}');
    expect(input.getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: /Rahim Uddin/ }).id,
    );
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    expect(input.getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: /Rahim Uddin/ }).id,
    );
    await user.keyboard('{Enter}');

    expect(onValueChange).toHaveBeenCalledWith(OPTIONS[0]);
    expect((input as HTMLInputElement).value).toBe('Rahim Uddin');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('submits the typed text on Enter when no option is active (scanner input)', async () => {
    const user = userEvent.setup();
    const { input, onSubmitQuery, onValueChange } = setup();
    await user.type(input, '01700000001{Enter}');
    expect(onSubmitQuery).toHaveBeenCalledWith('01700000001');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('closes on the first Escape and clears on the second', async () => {
    const user = userEvent.setup();
    const { input } = setup();
    await user.type(input, 'ra');
    await user.keyboard('{Escape}');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect((input as HTMLInputElement).value).toBe('ra');
    await user.keyboard('{Escape}');
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('does not query or act on keys while an input method is composing', () => {
    const { input, onQueryChange, onSubmitQuery } = setup();
    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: '\u09B0' } });
    expect(onQueryChange).not.toHaveBeenCalled();

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSubmitQuery).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: '\u09B0\u09B9\u09BF\u09AE' } });
    fireEvent.compositionEnd(input);
    expect(onQueryChange).toHaveBeenCalledTimes(1);
    expect(onQueryChange).toHaveBeenCalledWith('\u09B0\u09B9\u09BF\u09AE');
  });

  it('counts the minimum query length in characters, not code units', async () => {
    const user = userEvent.setup();
    const { input } = setup({ minQueryLength: 2 });
    // RA + I-KAR: two code points, one character.
    await user.type(input, '\u09B0\u09BF');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    await user.type(input, '\u09AE');
    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  it('shows empty and loading states as status text', async () => {
    const user = userEvent.setup();
    setup({ options: [] });
    await user.type(screen.getByRole('combobox'), 'zz');
    expect(screen.getByText('No patients found').getAttribute('role')).toBe('status');
  });

  it('shows the loading text instead of options while loading', async () => {
    const user = userEvent.setup();
    setup({ loading: true });
    await user.type(screen.getByRole('combobox'), 'ra');
    expect(screen.getByText('Searching').getAttribute('role')).toBe('status');
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('Combobox review findings', () => {
  const base = {
    'aria-label': 'Search patient',
    listLabel: 'Patients',
    emptyLabel: 'No patients found',
    loadingLabel: 'Searching',
    announceResults: (count: number) => `${count} results`,
  };

  it('does not select a hidden stale option while new results are loading', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const view = render(<Combobox {...base} options={OPTIONS} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Search patient' });
    await user.type(input, 'rah');

    // The owner starts a new search and keeps the old options until the response arrives.
    view.rerender(<Combobox {...base} options={OPTIONS} loading onValueChange={onValueChange} />);
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onValueChange).not.toHaveBeenCalled();
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
  });

  it('starts from no active option when new results arrive', async () => {
    const user = userEvent.setup();
    const view = render(<Combobox {...base} options={OPTIONS} />);
    const input = screen.getByRole('combobox', { name: 'Search patient' });
    await user.type(input, 'rah');
    await user.keyboard('{ArrowDown}');
    expect(input.getAttribute('aria-activedescendant')).not.toBeNull();

    // A different result set must not inherit the old position (Enter would pick its first item).
    const fresh: ComboboxOption[] = [
      { id: 'p9', label: 'Karim Ahmed' },
      { id: 'p10', label: 'Karima Begum' },
    ];
    view.rerender(<Combobox {...base} options={fresh} />);
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
  });

  it('shows the label of a selection set by the parent', () => {
    const view = render(<Combobox {...base} options={OPTIONS} value={null} />);
    const input = screen.getByRole('combobox', { name: 'Search patient' }) as HTMLInputElement;
    expect(input.value).toBe('');

    view.rerender(<Combobox {...base} options={[]} value={OPTIONS[0] as ComboboxOption} />);
    expect(input.value).toBe('Rahim Uddin');
  });

  it('clears the shown name when the parent clears the selection', () => {
    const view = render(
      <Combobox {...base} options={OPTIONS} value={OPTIONS[0] as ComboboxOption} />,
    );
    const input = screen.getByRole('combobox', { name: 'Search patient' }) as HTMLInputElement;
    expect(input.value).toBe('Rahim Uddin');

    view.rerender(<Combobox {...base} options={OPTIONS} value={null} />);
    expect(input.value).toBe('');
  });

  it('keeps what the user types after a selection and reports the cleared selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Combobox
        {...base}
        options={OPTIONS}
        defaultValue={OPTIONS[0] as ComboboxOption}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Search patient' }) as HTMLInputElement;
    expect(input.value).toBe('Rahim Uddin');

    await user.type(input, 'x');
    expect(input.value).toBe('Rahim Uddinx');
    expect(onValueChange).toHaveBeenCalledWith(null);
  });

  it('leaves Escape to the input method while composing', () => {
    render(<Combobox {...base} options={OPTIONS} />);
    const input = screen.getByRole('combobox', { name: 'Search patient' });
    fireEvent.change(input, { target: { value: 'ra' } });
    expect(input.getAttribute('aria-expanded')).toBe('true');

    fireEvent.keyDown(input, { key: 'Escape', isComposing: true });
    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  it('does not close a dialog around it when Escape belongs to the input method', () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange} title="Find patient" closeLabel="Close">
        <Combobox {...base} options={OPTIONS} />
      </Dialog>,
    );
    const input = screen.getByRole('combobox', { name: 'Search patient' });
    fireEvent.keyDown(input, { key: 'Escape', isComposing: true });
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
