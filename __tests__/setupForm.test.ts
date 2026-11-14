import {
  canContinue,
  draftFromSetup,
  emptyDraft,
  setupFromDraft,
  stepError,
} from '../src/domain/setupForm';

const filled = {
  ...emptyDraft('2026-01-01'),
  userName: '  Mehmet ',
  militaryType: 'long' as const,
  hometown: 'Trabzon',
  militaryCity: 'Uşak',
};

describe('setupForm', () => {
  it('ad adımı en az 2 karakter ister', () => {
    expect(stepError('name', { ...filled, userName: ' a ' })).toMatch(/2 karakter/);
    expect(canContinue('name', filled)).toBe(true);
  });

  it('tarih adımı iki şehri de ister', () => {
    expect(canContinue('date', { ...filled, militaryCity: '' })).toBe(false);
    expect(stepError('date', { ...filled, hometown: '' })).toMatch(/Memleket/);
    expect(canContinue('date', filled)).toBe(true);
  });

  it('tür ve ek adımlar her zaman geçilebilir', () => {
    expect(canContinue('type', filled)).toBe(true);
    expect(canContinue('extras', filled)).toBe(true);
  });

  it('SetupInfo üretir: ad kırpılır, gün sayısı türden gelir, sayılar sınırlanır', () => {
    const s = setupFromDraft({ ...filled, roadLeave: 99, usedLeave: -3, penalty: 12 });
    expect(s).toEqual({
      militaryType: 'long',
      startDate: '2026-01-01',
      totalDays: 365,
      userName: 'Mehmet',
      hometown: 'Trabzon',
      militaryCity: 'Uşak',
      roadLeave: 10,
      usedLeave: 0,
      penalty: 12,
    });
  });

  it('mevcut kurulumdan taslak üretir (güncelleme akışı)', () => {
    const s = setupFromDraft(filled);
    expect(setupFromDraft(draftFromSetup(s))).toEqual(s);
  });
});
