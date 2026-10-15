'use client';
// Warning shown shortly before the idle timeout, with "Stay signed in" (F section 8, SP-11,
// C-032), and the notice once the session has ended. Implements: T-UI-02.
// The dialog cannot be dismissed by Escape or the backdrop: it needs a decision.
import { Button } from '../primitives/Button.js';
import { Dialog } from '../primitives/Dialog.js';

export interface SessionExpiryDialogProps {
  mode: 'warning' | 'expired' | null;
  /** Text under the title, already translated and formatted (minutes left, or the end notice). */
  body: string;
  title: string;
  stayLabel: string;
  signOutLabel: string;
  signInAgainLabel: string;
  closeLabel: string;
  onStay: () => void;
  onSignOut: () => void;
  onSignInAgain: () => void;
}

export function SessionExpiryDialog({
  mode,
  body,
  title,
  stayLabel,
  signOutLabel,
  signInAgainLabel,
  closeLabel,
  onStay,
  onSignOut,
  onSignInAgain,
}: SessionExpiryDialogProps) {
  return (
    <Dialog
      open={mode !== null}
      // A decision is required: the close request is ignored.
      onOpenChange={() => {}}
      title={title}
      description={body}
      closeLabel={closeLabel}
      size="sm"
      footer={
        mode === 'warning' ? (
          <>
            <Button variant="secondary" onClick={onSignOut}>
              {signOutLabel}
            </Button>
            <Button onClick={onStay}>{stayLabel}</Button>
          </>
        ) : (
          <Button onClick={onSignInAgain}>{signInAgainLabel}</Button>
        )
      }
    />
  );
}
