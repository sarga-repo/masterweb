/**
 * Minimal, dependency-free className combiner.
 * Accepts strings, arrays, and conditional (falsy) values.
 */
export type ClassValue =
  string | number | null | false | undefined | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else {
      out.push(String(input));
    }
  }

  return out.join(" ");
}

/**
 * Format an ISO date (YYYY-MM-DD) as an uppercase display date, e.g. "JULY 24, 2025".
 * Uses UTC to keep server/client output deterministic.
 */
export function formatDisplayDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase();
}
