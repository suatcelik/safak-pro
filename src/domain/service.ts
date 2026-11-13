import { addDays, differenceInCalendarDays } from 'date-fns';
import { cityByPlate } from './cities';
import { fromDateKey } from './dates';

export type MilitaryType = 'short' | 'long' | 'paid' | 'officer';

export interface SetupInfo {
  militaryType: MilitaryType;
  /** Sülüs (başlangıç) tarihi, `yyyy-MM-dd` */
  startDate: string;
  /** Askerlik türünün temel süresi (28 / 180 / 365) */
  totalDays: number;
  userName?: string;
  hometown?: string;
  militaryCity?: string;
  /** Kullanılan izin — süreyi uzatır */
  usedLeave?: number;
  /** Ceza — süreyi uzatır */
  penalty?: number;
  /** Yol izni — terhisi öne çeker */
  roadLeave?: number;
}

export type ServiceStatus = 'notStarted' | 'active' | 'done';
export type MilestoneStatus = 'done' | 'current' | 'upcoming';

export interface Milestone {
  id: string;
  title: string;
  /** Bu taşa ulaşılan "geçen gün" değeri */
  passedAt: number;
  /** Bu taşta kalan şafak */
  remainingAt: number;
  status: MilestoneStatus;
  /** 0..1 — önceki taştan bu taşa ilerleme */
  progress: number;
}

export interface ServiceStats {
  status: ServiceStatus;
  /** Temel süre + kullanılan izin + ceza */
  effectiveTotal: number;
  passed: number;
  remaining: number;
  /** 0..100 */
  percentage: number;
  startDate: Date;
  /** Terhis günü (yerel gece yarısı) */
  endDate: Date;
  /** Başlangıç gelecekteyse kaç gün kaldığı, değilse 0 */
  daysUntilStart: number;
  /** Son 81 günde kalan güne denk gelen il */
  plateCity: string | null;
  milestones: Milestone[];
}

const MILESTONE_DEFS: { id: string; title: string; at: (total: number) => number }[] = [
  { id: 'acemi-basladi', title: 'Acemilik Başladı', at: () => 1 },
  { id: 'acemi-bitti', title: 'Acemilik Bitiyor', at: () => 28 },
  { id: 'ikinci-ay', title: '2. Ay Hoş Geldin', at: () => 30 },
  { id: 'iki-ay-bitti', title: '2. Ay Bitiyor', at: () => 60 },
  { id: '200ler', title: "200'ler Bitiyor", at: (t) => t - 200 },
  { id: 'yarisi', title: 'Yolun Yarısı', at: (t) => Math.floor(t / 2) },
  { id: 'yuzler', title: 'Yüzler Bitiyor', at: (t) => t - 100 },
  { id: 'cift-rakam', title: 'Çift Rakamlar', at: (t) => t - 99 },
  { id: 'plakalar', title: 'Plakalar', at: (t) => t - 81 },
  { id: 'son-2-ay', title: 'Son 2 Ay', at: (t) => t - 60 },
  { id: 'son-1-ay', title: 'Son 1 Ay', at: (t) => t - 30 },
  { id: 'tek-rakam', title: 'Tek Rakamlar', at: (t) => t - 9 },
  { id: 'dogan-gunes', title: 'Doğan Güneş', at: (t) => t },
];

export function effectiveTotalOf(setup: SetupInfo): number {
  return setup.totalDays + (setup.usedLeave ?? 0) + (setup.penalty ?? 0);
}

export function endDateOf(setup: SetupInfo): Date {
  return addDays(fromDateKey(setup.startDate), effectiveTotalOf(setup) - (setup.roadLeave ?? 0));
}

function buildMilestones(total: number, passed: number): Milestone[] {
  // Aynı güne düşen taşlardan listede sonra geleni kalır.
  const byDay = new Map<number, { id: string; title: string }>();
  for (const def of MILESTONE_DEFS) {
    const at = def.at(total);
    if (at >= 1 && at <= total) byDay.set(at, { id: def.id, title: def.title });
  }
  const sorted = [...byDay.entries()].sort((a, b) => a[0] - b[0]);

  let prev = 0;
  let currentAssigned = false;
  return sorted.map(([at, def]) => {
    let status: MilestoneStatus;
    let progress: number;
    if (passed >= at) {
      status = 'done';
      progress = 1;
    } else if (!currentAssigned) {
      status = 'current';
      progress = Math.max(0, (passed - prev) / (at - prev));
      currentAssigned = true;
    } else {
      status = 'upcoming';
      progress = 0;
    }
    prev = at;
    return { ...def, passedAt: at, remainingAt: total - at, status, progress };
  });
}

/** Askerlik durumunu verilen güne göre hesaplar. Saf fonksiyon: aynı girdi → aynı çıktı. */
export function computeService(setup: SetupInfo, today: Date): ServiceStats {
  const startDate = fromDateKey(setup.startDate);
  const endDate = endDateOf(setup);
  const effectiveTotal = effectiveTotalOf(setup);
  const serviceLength = effectiveTotal - (setup.roadLeave ?? 0);

  const sinceStart = differenceInCalendarDays(today, startDate);
  const untilEnd = differenceInCalendarDays(endDate, today);

  let status: ServiceStatus;
  let remaining: number;
  let passed: number;
  if (sinceStart < 0) {
    status = 'notStarted';
    remaining = serviceLength;
    passed = 0;
  } else if (untilEnd <= 0) {
    status = 'done';
    remaining = 0;
    passed = effectiveTotal;
  } else {
    status = 'active';
    remaining = untilEnd;
    passed = effectiveTotal - remaining;
  }

  return {
    status,
    effectiveTotal,
    passed,
    remaining,
    percentage: effectiveTotal > 0 ? (passed / effectiveTotal) * 100 : 0,
    startDate,
    endDate,
    daysUntilStart: Math.max(0, -sinceStart),
    plateCity: remaining >= 1 && remaining <= 81 ? cityByPlate(remaining) : null,
    milestones: buildMilestones(effectiveTotal, passed),
  };
}
