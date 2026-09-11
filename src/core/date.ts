// `new Date("2026-06-01")` parses as UTC midnight, which then renders as the
// previous day in any timezone behind UTC. Dates in this app are calendar
// dates (yyyy-mm-dd) with no time component, so always parse them as local.
export function parseDateOnly(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDateOnly(iso: string, options?: Intl.DateTimeFormatOptions): string {
  return parseDateOnly(iso).toLocaleDateString(undefined, options ?? { month: 'short', day: 'numeric', year: 'numeric' });
}
