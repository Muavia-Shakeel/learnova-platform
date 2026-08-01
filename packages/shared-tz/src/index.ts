import { DateTime } from "luxon";

export const DEFAULT_TIMEZONE = "Europe/London";

/** Lesson times are always stored in UTC; convert to a viewer's local zone for display. */
export function toLocal(utcIso: string, timezone: string): DateTime {
  return DateTime.fromISO(utcIso, { zone: "utc" }).setZone(timezone);
}

/** Convert a wall-clock time picked in a given zone (e.g. a booking form) to UTC for storage. */
export function toUtc(localIso: string, timezone: string): DateTime {
  return DateTime.fromISO(localIso, { zone: timezone }).toUTC();
}

export function nowUtcIso(): string {
  return DateTime.utc().toISO() as string;
}

export function addHours(utcIso: string, hours: number): string {
  return DateTime.fromISO(utcIso, { zone: "utc" }).plus({ hours }).toISO() as string;
}

/** Resolves which zone a lesson should be scheduled/displayed in: student's zone if known, else UK. */
export function resolveTimezone(studentTimezone?: string | null): string {
  return studentTimezone && DateTime.local().setZone(studentTimezone).isValid
    ? studentTimezone
    : DEFAULT_TIMEZONE;
}

export function formatForDisplay(utcIso: string, timezone: string): string {
  return toLocal(utcIso, timezone).toFormat("ccc dd LLL yyyy, HH:mm ZZZZ");
}
