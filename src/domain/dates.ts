import { format, isValid, parseISO, startOfDay } from 'date-fns';

/** Yerel takvim gününü `yyyy-MM-dd` olarak yazar (toISOString'in UTC kaymasından kaçınır). */
export function toDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/** `yyyy-MM-dd` (veya eski ISO) metnini yerel gece yarısına çevirir. */
export function fromDateKey(key: string): Date {
  const parsed = parseISO(key.slice(0, 10));
  return isValid(parsed) ? startOfDay(parsed) : startOfDay(new Date());
}
