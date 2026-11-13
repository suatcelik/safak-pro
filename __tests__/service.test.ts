import { computeService, SetupInfo } from '../src/domain/service';

const day = (iso: string, hour = 12) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d, hour, 0, 0);
};

const base = (over: Partial<SetupInfo> = {}): SetupInfo => ({
  militaryType: 'short',
  startDate: '2026-01-01',
  totalDays: 180,
  ...over,
});

describe('computeService', () => {
  it('kısa dönem (180): ilk gün 0 geçti, 180 kaldı, terhis 180 gün sonra', () => {
    const s = computeService(base(), day('2026-01-01'));
    expect(s.status).toBe('active');
    expect(s.effectiveTotal).toBe(180);
    expect(s.passed).toBe(0);
    expect(s.remaining).toBe(180);
    expect(s.percentage).toBe(0);
    expect(s.endDate).toEqual(day('2026-06-30', 0));
  });

  it('kısa dönem: 100 gün sonra 100 geçti, 80 kaldı', () => {
    const s = computeService(base(), day('2026-04-11'));
    expect(s.passed).toBe(100);
    expect(s.remaining).toBe(80);
    expect(s.percentage).toBeCloseTo((100 / 180) * 100);
  });

  it('saat farkı gün sayısını değiştirmez (gece 23:59 ve 00:01)', () => {
    const late = computeService(base(), new Date(2026, 0, 10, 23, 59));
    const early = computeService(base(), new Date(2026, 0, 10, 0, 1));
    expect(late.passed).toBe(9);
    expect(early.passed).toBe(9);
  });

  it('uzun dönem (365)', () => {
    const s = computeService(
      base({ militaryType: 'long', totalDays: 365 }),
      day('2026-07-01'),
    );
    expect(s.effectiveTotal).toBe(365);
    expect(s.passed).toBe(181);
    expect(s.remaining).toBe(184);
    expect(s.endDate).toEqual(day('2027-01-01', 0));
  });

  it('bedelli (28)', () => {
    const s = computeService(base({ militaryType: 'paid', totalDays: 28 }), day('2026-01-15'));
    expect(s.passed).toBe(14);
    expect(s.remaining).toBe(14);
    expect(s.endDate).toEqual(day('2026-01-29', 0));
  });

  it('ceza ve kullanılan izin toplam süreyi ve terhisi uzatır', () => {
    const s = computeService(base({ penalty: 7, usedLeave: 3 }), day('2026-01-01'));
    expect(s.effectiveTotal).toBe(190);
    expect(s.remaining).toBe(190);
    expect(s.endDate).toEqual(day('2026-07-10', 0));
  });

  it('yol izni terhisi öne çeker ve geçen güne eklenir', () => {
    const s = computeService(base({ roadLeave: 4 }), day('2026-01-01'));
    expect(s.passed).toBe(4);
    expect(s.remaining).toBe(176);
    expect(s.endDate).toEqual(day('2026-06-26', 0));
  });

  it('başlangıç gelecekte: notStarted, geçen 0, başlangıca kalan gün', () => {
    const s = computeService(base({ roadLeave: 2 }), day('2025-12-22'));
    expect(s.status).toBe('notStarted');
    expect(s.daysUntilStart).toBe(10);
    expect(s.passed).toBe(0);
    expect(s.remaining).toBe(178);
    expect(s.percentage).toBe(0);
  });

  it('terhis günü: kalan 0, done', () => {
    const s = computeService(base(), day('2026-06-30'));
    expect(s.status).toBe('done');
    expect(s.remaining).toBe(0);
    expect(s.passed).toBe(180);
    expect(s.percentage).toBe(100);
  });

  it('terhis geçmiş: değerler sınırda kalır', () => {
    const s = computeService(base(), day('2027-03-01'));
    expect(s.status).toBe('done');
    expect(s.remaining).toBe(0);
    expect(s.passed).toBe(180);
  });

  it('son 81 günde plaka ili döner', () => {
    expect(computeService(base(), day('2026-04-10')).plateCity).toBe('Düzce'); // 81 kaldı
    expect(computeService(base(), day('2026-06-29')).plateCity).toBe('Adana'); // 1 kaldı
    expect(computeService(base(), day('2026-04-09')).plateCity).toBeNull(); // 82 kaldı
    expect(computeService(base(), day('2026-06-30')).plateCity).toBeNull(); // 0 kaldı
  });
});

describe('kilometre taşları', () => {
  it('180 günde geçerli taşlar sıralı ve süre içinde', () => {
    const s = computeService(base(), day('2026-01-01'));
    const at = s.milestones.map((m) => m.passedAt);
    expect(at).toEqual([...at].sort((a, b) => a - b));
    expect(at.every((p) => p >= 1 && p <= 180)).toBe(true);
    expect(s.milestones.map((m) => m.id)).not.toContain('200ler');
    expect(s.milestones[s.milestones.length - 1].id).toBe('dogan-gunes');
  });

  it('bedelli: aynı güne düşen taşlardan sonuncusu kalır', () => {
    const s = computeService(base({ militaryType: 'paid', totalDays: 28 }), day('2026-01-01'));
    const ids = s.milestones.map((m) => m.id);
    expect(ids).toContain('dogan-gunes');
    expect(ids).not.toContain('acemi-bitti');
    expect(new Set(s.milestones.map((m) => m.passedAt)).size).toBe(s.milestones.length);
  });

  it('durumlar: tamamlanan, mevcut ve sıradaki', () => {
    const s = computeService(base(), day('2026-01-15')); // 14 geçti
    const byId = Object.fromEntries(s.milestones.map((m) => [m.id, m]));
    expect(byId['acemi-basladi'].status).toBe('done');
    expect(byId['acemi-basladi'].progress).toBe(1);
    expect(byId['acemi-bitti'].status).toBe('current');
    expect(byId['acemi-bitti'].progress).toBeCloseTo(13 / 27);
    expect(byId['ikinci-ay'].status).toBe('upcoming');
    expect(byId['ikinci-ay'].progress).toBe(0);
    expect(byId['plakalar'].remainingAt).toBe(81);
  });
});
