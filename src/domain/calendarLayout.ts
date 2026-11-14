import type { MilitaryType } from './service';

/**
 * Takvim, askerlik süresinin rakamlarını (28 / 180 / 365) hücrelerden çizer.
 * Rakamlar 7 segmentli şablonlardan üretilir; her düzenin hücre toplamı
 * tam olarak süre kadardır (testle doğrulanır).
 */

type Segment = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';

const SEGMENTS: Record<string, Segment[]> = {
  '0': ['a', 'b', 'c', 'd', 'e', 'f'],
  '1': ['b', 'c'],
  '2': ['a', 'b', 'g', 'e', 'd'],
  '3': ['a', 'b', 'g', 'c', 'd'],
  '5': ['a', 'f', 'g', 'c', 'd'],
  '6': ['a', 'f', 'g', 'e', 'c', 'd'],
  '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
};

interface DigitTemplate {
  char: string;
  width: number;
  height: number;
  stroke: number;
  /** Şablondan çıkarılan [satır, sütun] hücreleri (yuvarlatma / bel daraltma) */
  remove?: [number, number][];
}

/** Askerlik süresine göre rakam şablonları. */
export const DIGIT_TEMPLATES: Record<28 | 180 | 365, DigitTemplate[]> = {
  28: [
    { char: '2', width: 4, height: 5, stroke: 1 },
    {
      char: '8',
      width: 4,
      height: 5,
      stroke: 1,
      remove: [
        [2, 0],
        [2, 3],
      ],
    },
  ],
  180: [
    { char: '1', width: 8, height: 14, stroke: 2 },
    { char: '8', width: 8, height: 14, stroke: 2 },
    { char: '0', width: 8, height: 14, stroke: 2 },
  ],
  365: [
    { char: '3', width: 10, height: 18, stroke: 3 },
    { char: '6', width: 10, height: 18, stroke: 3 },
    { char: '5', width: 10, height: 18, stroke: 3, remove: [[17, 0]] },
  ],
};

/** Şablonu 0/1 matrisine çevirir; boş sütunları kırpar ("1" dar kalır). */
export function renderDigitMask(t: DigitTemplate): boolean[][] {
  const segs = SEGMENTS[t.char];
  const has = (s: Segment) => segs.includes(s);
  const mid = Math.floor((t.height - t.stroke) / 2);
  const removed = new Set((t.remove ?? []).map(([r, c]) => `${r}:${c}`));

  const mask: boolean[][] = [];
  for (let r = 0; r < t.height; r++) {
    const row: boolean[] = [];
    const top = r < t.stroke;
    const middle = r >= mid && r < mid + t.stroke;
    const bottom = r >= t.height - t.stroke;
    const upper = r < mid + t.stroke;
    const lower = r >= mid;
    for (let c = 0; c < t.width; c++) {
      const left = c < t.stroke;
      const right = c >= t.width - t.stroke;
      const on =
        (has('a') && top) ||
        (has('g') && middle) ||
        (has('d') && bottom) ||
        (has('f') && left && upper) ||
        (has('b') && right && upper) ||
        (has('e') && left && lower) ||
        (has('c') && right && lower);
      row.push(on && !removed.has(`${r}:${c}`));
    }
    mask.push(row);
  }

  const usedCols = mask[0].map((_, c) => mask.some((row) => row[c]));
  return mask.map((row) => row.filter((_, c) => usedCols[c]));
}

export interface CalendarDigit {
  char: string;
  /** Gün numaraları; 0 boş hücre */
  rows: number[][];
}

export interface CalendarLayout {
  digits: CalendarDigit[];
  /** Temel sürenin dışında kalan (ceza / izin) günler */
  extraDays: number[];
}

export function baseDaysFor(type: MilitaryType): 28 | 180 | 365 {
  if (type === 'paid') return 28;
  if (type === 'short') return 180;
  return 365;
}

function templateKey(baseDays: number): 28 | 180 | 365 {
  if (baseDays <= 28) return 28;
  if (baseDays <= 180) return 180;
  return 365;
}

/**
 * @param baseDays askerlik türünün temel süresi
 * @param effectiveTotal temel süre + izin + ceza; fazlası `extraDays` olur
 */
export function buildCalendarLayout(baseDays: number, effectiveTotal: number): CalendarLayout {
  let next = 1;
  const digits = DIGIT_TEMPLATES[templateKey(baseDays)].map((t) => ({
    char: t.char,
    rows: renderDigitMask(t).map((row) => row.map((on) => (on ? next++ : 0))),
  }));
  const capacity = next - 1;
  const extraDays = Array.from(
    { length: Math.max(0, effectiveTotal - capacity) },
    (_, i) => capacity + i + 1,
  );
  return { digits, extraDays };
}
