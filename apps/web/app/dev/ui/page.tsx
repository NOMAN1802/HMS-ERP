'use client';
// Component gallery: every primitive used the way a screen would use it, with real keyboard
// behavior. It is the target of the browser tests (keyboard flows and axe) and the place to look
// at a component in Bangla and English. Implements: T-UI-01, ADR-022 sections 8 and 9.
// Demo strings are sample data, not product copy; Bangla names use escapes to keep the source ASCII.
import {
  Button,
  Combobox,
  type ComboboxOption,
  Dialog,
  Field,
  IconButton,
  Menu,
  StatusBadge,
  type StatusKind,
  Tabs,
  TextInput,
  ToastProvider,
  useToast,
} from '@hms/ui';
import { type ReactNode, useEffect, useRef, useState } from 'react';

const PATIENTS: ComboboxOption[] = [
  { id: 'p1', label: 'Rahim Uddin', description: 'MRN-000123' },
  {
    id: 'p2',
    label: '\u09B0\u09B9\u09BF\u09AE \u0989\u09A6\u09CD\u09A6\u09BF\u09A8',
    description: 'MRN-000124',
  },
  { id: 'p3', label: 'Rahima Khatun', description: 'MRN-000877' },
  {
    id: 'p4',
    label: '\u09B0\u09B9\u09BF\u09AE\u09BE \u0996\u09BE\u09A4\u09C1\u09A8',
    description: 'MRN-000878',
  },
  { id: 'p5', label: 'Karim Ahmed', description: 'MRN-000412' },
  {
    id: 'p6',
    label: '\u0995\u09B0\u09BF\u09AE \u0986\u09B9\u09AE\u09C7\u09A6',
    description: 'MRN-000413',
  },
];

const STATUSES: Array<{ status: StatusKind; label: string }> = [
  { status: 'idle', label: 'Expected' },
  { status: 'active', label: 'Waiting' },
  { status: 'review', label: 'In consultation' },
  { status: 'attention', label: 'Waiting for payment' },
  { status: 'done', label: 'Paid' },
  { status: 'problem', label: 'Rejected' },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-panel border border-border bg-surface p-5">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function ButtonsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="ghost">Ghost</Button>
      <Button size="lg">Large</Button>
      <Button loading>Saving</Button>
      <Button disabled>Disabled</Button>
      <IconButton icon="search" label="Search" variant="secondary" />
    </div>
  );
}

function FieldDemo() {
  const [phone, setPhone] = useState('');
  const error =
    phone !== '' && phone.length !== 11 ? 'Phone number must have 11 digits' : undefined;
  return (
    <div className="max-w-sm">
      <Field label="Mobile number" hint="Digits only, 11 digits" error={error} required>
        {({ id, invalid, required, ...aria }) => (
          <TextInput
            id={id}
            invalid={invalid}
            required={required}
            inputMode="numeric"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            {...aria}
          />
        )}
      </Field>
    </div>
  );
}

function DialogDemo() {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [note, setNote] = useState('');
  const { show } = useToast();

  function requestClose() {
    if (note.trim() === '') setOpen(false);
    else setConfirmOpen(true);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add note</Button>
      <Dialog
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : requestClose())}
        title="Visit note"
        description="Closing with text asks first, so nothing is lost by accident."
        closeLabel="Close"
        footer={
          <>
            <Button variant="secondary" onClick={requestClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                show({ title: 'Note saved', tone: 'success' });
                setNote('');
                setOpen(false);
              }}
            >
              Save note
            </Button>
          </>
        }
      >
        <Field label="Note">
          {({ id, invalid, ...aria }) => (
            <TextInput
              id={id}
              invalid={invalid}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              {...aria}
            />
          )}
        </Field>
      </Dialog>
      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Discard this note?"
        closeLabel="Close"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Stay
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setConfirmOpen(false);
                setNote('');
                setOpen(false);
              }}
            >
              Discard
            </Button>
          </>
        }
      />
    </>
  );
}

function MenuDemo() {
  const { show } = useToast();
  return (
    <Menu
      menuLabel="Invoice actions"
      items={[
        {
          id: 'print',
          label: 'Print receipt',
          onSelect: () => show({ title: 'Receipt sent to printer' }),
        },
        { id: 'copy', label: 'Reprint copy 2', onSelect: () => {}, disabled: true },
        {
          id: 'cancel',
          label: 'Cancel invoice',
          onSelect: () => show({ title: 'Invoice cancelled', tone: 'warning' }),
          tone: 'danger',
        },
      ]}
      trigger={(props) => (
        <Button variant="secondary" {...props}>
          Invoice actions
        </Button>
      )}
    />
  );
}

function ComboboxDemo() {
  const [options, setOptions] = useState<ComboboxOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('none');
  const [submitted, setSubmitted] = useState('none');
  const timer = useRef<number | undefined>(undefined);

  // Simulates a server search: the owner fetches, the combobox only displays.
  function search(query: string) {
    window.clearTimeout(timer.current);
    setLoading(true);
    timer.current = window.setTimeout(() => {
      const needle = query.toLowerCase();
      setOptions(PATIENTS.filter((p) => p.label.toLowerCase().includes(needle)));
      setLoading(false);
    }, 150);
  }

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div className="max-w-md space-y-3">
      <Field label="Find patient" hint="Type a name; use the arrow keys, then Enter">
        {({ id, invalid, ...aria }) => (
          <Combobox
            id={id}
            invalid={invalid}
            options={options}
            loading={loading}
            listLabel="Patients"
            emptyLabel="No patients found"
            loadingLabel="Searching"
            announceResults={(count) => `${count} patients found`}
            onQueryChange={search}
            onValueChange={(option) => setSelected(option?.label ?? 'none')}
            onSubmitQuery={setSubmitted}
            {...aria}
          />
        )}
      </Field>
      <p>
        Selected: <strong data-testid="selected">{selected}</strong>
      </p>
      <p>
        Submitted text: <strong data-testid="submitted">{submitted}</strong>
      </p>
    </div>
  );
}

function ToastDemo() {
  const { show } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() => show({ title: 'Check-in complete', description: 'Serial 12' })}
      >
        Info toast
      </Button>
      <Button variant="secondary" onClick={() => show({ title: 'Payment saved', tone: 'success' })}>
        Success toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          show({
            title: 'Connection lost',
            description: 'Nothing new can be saved.',
            tone: 'danger',
          })
        }
      >
        Danger toast
      </Button>
    </div>
  );
}

export default function UiGalleryPage() {
  return (
    <ToastProvider regionLabel="Notifications" closeLabel="Dismiss">
      <main className="mx-auto max-w-5xl space-y-6 p-6">
        <h1 className="text-3xl font-semibold">UI gallery</h1>
        <p className="text-text-muted">
          Internal reference for the shared components. Product screens use these and nothing else.
        </p>
        <Section title="Buttons">
          <ButtonsDemo />
        </Section>
        <Section title="Field and text input">
          <FieldDemo />
        </Section>
        <Section title="Status badges">
          <div className="flex flex-wrap gap-3">
            {STATUSES.map((item) => (
              <StatusBadge key={item.status} status={item.status} label={item.label} />
            ))}
          </div>
        </Section>
        <Section title="Dialog">
          <DialogDemo />
        </Section>
        <Section title="Menu">
          <MenuDemo />
        </Section>
        <Section title="Tabs">
          <Tabs
            label="Patient record"
            tabs={[
              { id: 'visits', label: 'Visits', content: <p>Visit history appears here.</p> },
              { id: 'invoices', label: 'Invoices', content: <p>Invoices appear here.</p> },
              { id: 'reports', label: 'Reports', content: <p>Released reports appear here.</p> },
            ]}
          />
        </Section>
        <Section title="Combobox">
          <ComboboxDemo />
        </Section>
        <Section title="Toasts">
          <ToastDemo />
        </Section>
      </main>
    </ToastProvider>
  );
}
