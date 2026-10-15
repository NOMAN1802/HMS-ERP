// Numbers and money as strings. Money is never parsed as a float (ADR-007, C-037): amounts arrive
// as exact decimal strings and leave as grouped text. Lakh and crore grouping in both languages
// (C-057): 12,34,567. Rounding to whole taka is a billing rule, not a formatting one, so more
// than two decimal places is an error here, never a silent round.
import { toLocaleDigits } from './digits.js';
import type { Locale } from './locale.js';

const DECIMAL = /^(-?)(\d+)(?:\.(\d+))?$/;

interface ParsedDecimal {
  negative: boolean;
  integer: string;
  fraction: string;
}

function parseDecimal(value: string): ParsedDecimal {
  const match = DECIMAL.exec(value);
  if (!match) throw new RangeError(`Not an exact decimal string: "${value}"`);
  const integer = (match[2] as string).replace(/^0+(?=\d)/, '');
  return { negative: match[1] === '-', integer, fraction: match[3] ?? '' };
}

/** Groups a string of digits as 12,34,567 (last three, then pairs). */
export function groupLakhCrore(digits: string): string {
  if (!/^\d+$/.test(digits)) throw new RangeError(`Not a digit string: "${digits}"`);
  if (digits.length <= 3) return digits;
  const lastThree = digits.slice(-3);
  const groups: string[] = [];
  let rest = digits.slice(0, -3);
  while (rest.length > 2) {
    groups.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest) groups.unshift(rest);
  return [...groups, lastThree].join(',');
}

/** Groups an exact decimal string, keeping the decimals it has. */
export function formatNumber(value: string, locale: Locale): string {
  const { negative, integer, fraction } = parseDecimal(value);
  const decimals = fraction ? `.${fraction}` : '';
  const text = `${negative ? '-' : ''}${groupLakhCrore(integer)}${decimals}`;
  return toLocaleDigits(text, locale);
}

export type CurrencySymbol = 'none' | 'sign' | 'code';

export interface MoneyFormatOptions {
  symbol?: CurrencySymbol;
}

const SYMBOLS: Record<CurrencySymbol, string> = { none: '', sign: '৳ ', code: 'BDT ' };

/** Two decimals always; the symbol is chosen per template (ADR-017 item 3). */
export function formatMoney(
  amount: string,
  locale: Locale,
  { symbol = 'none' }: MoneyFormatOptions = {},
): string {
  const { negative, integer, fraction } = parseDecimal(amount);
  if (fraction.length > 2) {
    throw new RangeError(`More than two decimal places: "${amount}"`);
  }
  const grouped = `${groupLakhCrore(integer)}.${fraction.padEnd(2, '0')}`;
  const text = `${negative ? '-' : ''}${SYMBOLS[symbol]}${grouped}`;
  return toLocaleDigits(text, locale);
}
