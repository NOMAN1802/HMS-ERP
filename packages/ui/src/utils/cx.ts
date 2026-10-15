// Joins class names, skipping falsy values. Keeps component class lists readable without a
// dependency (T-UI-01).
export type ClassValue = string | false | null | undefined;

export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
