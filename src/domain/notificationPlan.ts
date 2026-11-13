import { addDays, startOfDay } from 'date-fns';
import { endDateOf, SetupInfo } from './service';

export interface PlannedNotification {
  kind: 'quote' | 'milestone';
  date: Date;
  title: string;
  body: string;
}

const QUOTE_DAYS = 30;
const QUOTE_HOUR = 8;
const MILESTONE_HOUR = 9;

const MILESTONES = [
  {
    daysLeft: 100,
    title: 'Dalya! 💯',
    body: "Şafak 100'den düştü, yüzler bitiyor! Dayan az kaldı.",
  },
  { daysLeft: 81, title: 'Plakalara Düştük! 🗺️', body: 'Artık il il sayma vakti. Şafak 81 Düzce!' },
  { daysLeft: 0, title: 'Doğan Güneş! 🌅', body: 'Hürgeneral! Vatan borcu bitti, geçmiş olsun.' },
];

function at(day: Date, hour: number): Date {
  const d = startOfDay(day);
  d.setHours(hour, 0, 0, 0);
  return d;
}

/**
 * Şu andan itibaren planlanacak bildirimler. Uygulama her açıldığında yeniden
 * çağrılır, böylece 30 günlük söz penceresi hep ileri kayar.
 */
export function buildNotificationPlan(
  setup: SetupInfo,
  now: Date,
  pickQuote: () => string,
): PlannedNotification[] {
  const end = endDateOf(setup);
  const plan: PlannedNotification[] = [];

  for (let i = 1; i <= QUOTE_DAYS; i++) {
    const date = at(addDays(now, i), QUOTE_HOUR);
    if (date > at(end, 23)) break;
    plan.push({ kind: 'quote', date, title: 'Günün Sözü 🇹🇷', body: pickQuote() });
  }

  for (const m of MILESTONES) {
    const date = at(addDays(end, -m.daysLeft), MILESTONE_HOUR);
    if (date > now) plan.push({ kind: 'milestone', date, title: m.title, body: m.body });
  }

  return plan;
}
