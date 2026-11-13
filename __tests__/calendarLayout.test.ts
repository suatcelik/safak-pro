import { buildCalendarLayout, baseDaysFor } from '../src/domain/calendarLayout';

const cellsOf = (layout: ReturnType<typeof buildCalendarLayout>) =>
  layout.digits.flatMap((d) => d.rows.flat()).filter((n) => n > 0);

describe('buildCalendarLayout', () => {
  it.each([
    [28, '28'],
    [180, '180'],
    [365, '365'],
  ])('%i günlük düzen tam %i hücre, 1..N her biri bir kez', (days, label) => {
    const layout = buildCalendarLayout(days, days);
    expect(layout.digits.map((d) => d.char).join('')).toBe(label);
    const cells = cellsOf(layout);
    expect(cells).toHaveLength(days);
    expect([...cells].sort((a, b) => a - b)).toEqual(Array.from({ length: days }, (_, i) => i + 1));
    expect(layout.extraDays).toEqual([]);
  });

  it('ceza ve izin günleri ekstra gün olarak eklenir', () => {
    const layout = buildCalendarLayout(180, 190);
    expect(cellsOf(layout)).toHaveLength(180);
    expect(layout.extraDays).toEqual([181, 182, 183, 184, 185, 186, 187, 188, 189, 190]);
  });

  it('rakam satırları dikdörtgen (her satır aynı genişlikte)', () => {
    for (const days of [28, 180, 365]) {
      for (const d of buildCalendarLayout(days, days).digits) {
        const w = d.rows[0].length;
        expect(d.rows.every((r) => r.length === w)).toBe(true);
      }
    }
  });

  it('askerlik türünden temel gün sayısı', () => {
    expect(baseDaysFor('paid')).toBe(28);
    expect(baseDaysFor('short')).toBe(180);
    expect(baseDaysFor('long')).toBe(365);
    expect(baseDaysFor('officer')).toBe(365);
  });
});
