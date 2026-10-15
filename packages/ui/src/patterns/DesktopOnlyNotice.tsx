import { Icon } from '../icons/Icon.js';

// Shown instead of a screen that must not be done on a phone (C-054, F principle 7: unavailable
// is explicit). Payment, registration, result entry and similar tasks use it below the md tier.
// Implements: T-UI-02. Texts are passed in, already translated.
export interface DesktopOnlyNoticeProps {
  title: string;
  body: string;
}

export function DesktopOnlyNotice({ title, body }: DesktopOnlyNoticeProps) {
  return (
    <div
      role="status"
      className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-panel border border-border bg-surface p-6 text-center"
    >
      <Icon name="info" size={28} className="text-primary" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-text-muted">{body}</p>
    </div>
  );
}
