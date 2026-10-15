import type { ReactNode } from 'react';
import { Icon, type IconName } from '../icons/Icon.js';
import { cx } from '../utils/cx.js';

// Inline message for a form or a section: a problem that needs attention, or a short notice.
// Status as icon plus words plus color (F section 1 rule 5). Danger and warning are announced
// at once (role=alert); info and success wait politely (role=status). Unlike a toast, it stays
// where the person is looking, so it can carry critical information (F section 5).
// Implements: T-UI-02, NFR-ACC-001.
export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const TONES: Record<AlertTone, { classes: string; icon: IconName }> = {
  info: { classes: 'bg-status-active-bg text-status-active-text', icon: 'info' },
  success: { classes: 'bg-status-done-bg text-status-done-text', icon: 'status-done' },
  warning: { classes: 'bg-status-attention-bg text-status-attention-text', icon: 'warning' },
  danger: { classes: 'bg-status-problem-bg text-status-problem-text', icon: 'status-problem' },
};

export interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Alert({ tone = 'info', title, children, className }: AlertProps) {
  const { classes, icon } = TONES[tone];
  return (
    <div
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
      className={cx('flex items-start gap-3 rounded-control px-4 py-3 font-ui', classes, className)}
    >
      <Icon name={icon} className="mt-0.5 shrink-0" />
      <div className="min-w-0">
        {title ? <p className="font-medium">{title}</p> : null}
        <p>{children}</p>
      </div>
    </div>
  );
}
