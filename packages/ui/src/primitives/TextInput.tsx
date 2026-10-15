'use client';
// Single-line text input. Implements: T-UI-01, ADR-022 section 2 (border-strong reaches 3:1),
// F section 7.1. Pairs with Field for label, hint and error wiring.
import type { InputHTMLAttributes, Ref } from 'react';
import { cx } from '../utils/cx.js';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export function TextInput({
  invalid = false,
  className,
  type = 'text',
  ref,
  ...rest
}: TextInputProps) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cx(
        'h-10 w-full rounded-control border bg-surface px-3 font-ui text-text placeholder:text-text-muted disabled:cursor-not-allowed disabled:bg-bg disabled:text-text-muted',
        invalid ? 'border-danger' : 'border-border-strong',
        className,
      )}
      {...rest}
    />
  );
}
