'use client';
// Status as word plus icon plus color, never color alone (F section 1 rule 5, NFR-ACC-001).
// Implements: T-UI-01, ADR-022 section 3, C-055. The icon takes the text color because the
// lighter shades fail 3:1 on their fills.
import { Icon, type IconName } from '../icons/Icon.js';
import { cx } from '../utils/cx.js';

export type StatusKind = 'idle' | 'active' | 'review' | 'attention' | 'done' | 'problem';

const STYLES: Record<StatusKind, string> = {
  idle: 'bg-status-idle-bg text-status-idle-text',
  active: 'bg-status-active-bg text-status-active-text',
  review: 'bg-status-review-bg text-status-review-text',
  attention: 'bg-status-attention-bg text-status-attention-text',
  done: 'bg-status-done-bg text-status-done-text',
  problem: 'bg-status-problem-bg text-status-problem-text',
};

const ICONS: Record<StatusKind, IconName> = {
  idle: 'status-idle',
  active: 'status-active',
  review: 'status-review',
  attention: 'status-attention',
  done: 'status-done',
  problem: 'status-problem',
};

export interface StatusBadgeProps {
  status: StatusKind;
  /** The visible word, already translated. Required: the word is part of the status. */
  label: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      data-status={status}
      className={cx(
        'inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 font-ui text-sm font-medium',
        STYLES[status],
        className,
      )}
    >
      <Icon name={ICONS[status]} size={16} />
      <span>{label}</span>
    </span>
  );
}
