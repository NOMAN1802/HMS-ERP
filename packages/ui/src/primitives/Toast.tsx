'use client';
// Transient notifications. Implements: T-UI-01, ADR-022 section 13, F section 7.3, NFR-ACC-001.
// A toast is never the only copy of critical information: outcomes that matter (payment saved,
// not saved) use an inline outcome panel (F section 5). Toasts are announced through the shared
// live regions; danger toasts are assertive and stay until dismissed. The timer pauses while the
// pointer or keyboard focus is on a toast.
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { announce, ensureAnnouncer } from '../hooks/announcer.js';
import { Icon, type IconName } from '../icons/Icon.js';
import { cx } from '../utils/cx.js';
import { IconButton } from './Button.js';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Milliseconds before it goes away. 0 keeps it until dismissed. */
  durationMs?: number;
}

interface ToastRecord extends ToastOptions {
  id: string;
}

interface ToastApi {
  show: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast must be used inside <ToastProvider>');
  return api;
}

const TONES: Record<ToastTone, { classes: string; icon: IconName }> = {
  info: { classes: 'bg-status-active-bg text-status-active-text', icon: 'info' },
  success: { classes: 'bg-status-done-bg text-status-done-text', icon: 'status-done' },
  warning: { classes: 'bg-status-attention-bg text-status-attention-text', icon: 'warning' },
  danger: { classes: 'bg-status-problem-bg text-status-problem-text', icon: 'status-problem' },
};

const DEFAULT_DURATION: Record<ToastTone, number> = {
  info: 5000,
  success: 5000,
  warning: 8000,
  danger: 0,
};

interface ToastItemProps {
  toast: ToastRecord;
  closeLabel: string;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, closeLabel, onDismiss }: ToastItemProps) {
  const [paused, setPaused] = useState(false);
  const tone = toast.tone ?? 'info';
  const duration = toast.durationMs ?? DEFAULT_DURATION[tone];

  useEffect(() => {
    if (paused || duration <= 0) return;
    const timer = window.setTimeout(() => onDismiss(toast.id), duration);
    return () => window.clearTimeout(timer);
  }, [paused, duration, onDismiss, toast.id]);

  return (
    <li
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cx(
        'motion-pop flex items-start gap-3 rounded-panel border border-border px-4 py-3 shadow-overlay',
        TONES[tone].classes,
      )}
    >
      <Icon name={TONES[tone].icon} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1 font-ui">
        <p className="font-medium">{toast.title}</p>
        {toast.description ? <p className="text-sm">{toast.description}</p> : null}
      </div>
      <IconButton
        icon="close"
        label={closeLabel}
        variant="ghost"
        className="-me-2 -mt-1 size-9 text-current hover:bg-transparent hover:opacity-70"
        onClick={() => onDismiss(toast.id)}
      />
    </li>
  );
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Accessible name of the notification list, already translated. */
  regionLabel: string;
  /** Accessible name of each dismiss button, already translated. */
  closeLabel: string;
  maxVisible?: number;
}

export function ToastProvider({
  children,
  regionLabel,
  closeLabel,
  maxVisible = 4,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    ensureAnnouncer();
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (options: ToastOptions) => {
      counter.current += 1;
      const id = `toast-${counter.current}`;
      setToasts((current) => [...current, { ...options, id }].slice(-maxVisible));
      const message = options.description
        ? `${options.title}. ${options.description}`
        : options.title;
      announce(message, options.tone === 'danger' ? 'assertive' : 'polite');
      return id;
    },
    [maxVisible],
  );

  const api = useMemo<ToastApi>(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toasts.length > 0 && typeof document !== 'undefined'
        ? createPortal(
            <ol
              data-hms-keep-active=""
              aria-label={regionLabel}
              className="fixed bottom-4 end-4 z-60 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
            >
              {toasts.map((toast) => (
                <ToastItem
                  key={toast.id}
                  toast={toast}
                  closeLabel={closeLabel}
                  onDismiss={dismiss}
                />
              ))}
            </ol>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
}
