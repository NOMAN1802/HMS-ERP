'use client';
// Bangla / English switch (FR-I18N-001). Two toggle buttons in a labelled group: the choice is
// always visible and takes one press. Option labels are written in their own language
// and passed in by the app. Implements: T-UI-02, ADR-022 section 7.
import { cx } from '../utils/cx.js';

export interface LanguageOption<T extends string> {
  value: T;
  label: string;
}

export interface LanguageSwitchProps<T extends string> {
  value: T;
  options: readonly LanguageOption<T>[];
  onChange: (value: T) => void;
  /** Accessible name of the group, already translated. */
  label: string;
}

export function LanguageSwitch<T extends string>({
  value,
  options,
  onChange,
  label,
}: LanguageSwitchProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex rounded-control border border-border-strong bg-surface p-0.5"
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => !selected && onChange(option.value)}
            className={cx(
              'h-9 rounded-control px-3 font-ui text-sm font-medium transition-colors duration-(--motion-press) ease-out',
              selected ? 'bg-primary text-on-primary' : 'text-text hover:bg-surface-hover',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
