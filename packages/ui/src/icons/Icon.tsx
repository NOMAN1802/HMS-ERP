'use client';
// The only module that imports the icon library, so a family swap is a one-file change.
// Implements: T-UI-01, ADR-022 section 10, ADR-022 section 9 (rule 6).
// Icons are decorative: the word beside an icon carries the meaning (NFR-ACC-001).
// Per-icon subpaths: the package root's type declarations do not resolve under NodeNext, and
// these imports also keep the bundle to the glyphs we use.
import { CaretDown } from '@phosphor-icons/react/dist/csr/CaretDown';
import { CaretLeft } from '@phosphor-icons/react/dist/csr/CaretLeft';
import { CaretRight } from '@phosphor-icons/react/dist/csr/CaretRight';
import { Buildings } from '@phosphor-icons/react/dist/csr/Buildings';
import { DotsThree } from '@phosphor-icons/react/dist/csr/DotsThree';
import { House } from '@phosphor-icons/react/dist/csr/House';
import { SignOut } from '@phosphor-icons/react/dist/csr/SignOut';
import { User } from '@phosphor-icons/react/dist/csr/User';
import { Check } from '@phosphor-icons/react/dist/csr/Check';
import { CheckCircle } from '@phosphor-icons/react/dist/csr/CheckCircle';
import { Circle } from '@phosphor-icons/react/dist/csr/Circle';
import { Eye } from '@phosphor-icons/react/dist/csr/Eye';
import { Hourglass } from '@phosphor-icons/react/dist/csr/Hourglass';
import { Info } from '@phosphor-icons/react/dist/csr/Info';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/csr/MagnifyingGlass';
import { SpinnerGap } from '@phosphor-icons/react/dist/csr/SpinnerGap';
import { Warning } from '@phosphor-icons/react/dist/csr/Warning';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { XCircle } from '@phosphor-icons/react/dist/csr/XCircle';

const ICONS = {
  check: Check,
  'caret-down': CaretDown,
  'caret-left': CaretLeft,
  'caret-right': CaretRight,
  hospital: Buildings,
  home: House,
  more: DotsThree,
  'sign-out': SignOut,
  user: User,
  close: X,
  search: MagnifyingGlass,
  info: Info,
  warning: Warning,
  spinner: SpinnerGap,
  'status-idle': Circle,
  'status-active': Hourglass,
  'status-review': Eye,
  'status-attention': Warning,
  'status-done': CheckCircle,
  'status-problem': XCircle,
} as const;

export type IconName = keyof typeof ICONS;

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className }: IconProps) {
  const Glyph = ICONS[name];
  return <Glyph size={size} weight="regular" aria-hidden="true" className={className} />;
}
