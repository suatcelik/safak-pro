import { baseDaysFor } from './calendarLayout';
import type { MilitaryType, SetupInfo } from './service';

export const LIMITS = { name: 50, roadLeave: 10, usedLeave: 60, penalty: 365 } as const;

export const SETUP_STEPS = ['name', 'type', 'date', 'extras', 'notify'] as const;
export type SetupStep = (typeof SETUP_STEPS)[number];

export interface SetupDraft {
  userName: string;
  militaryType: MilitaryType;
  startDate: string;
  hometown: string;
  militaryCity: string;
  roadLeave: number;
  usedLeave: number;
  penalty: number;
}

export function emptyDraft(today: string): SetupDraft {
  return {
    userName: '',
    militaryType: 'short',
    startDate: today,
    hometown: '',
    militaryCity: '',
    roadLeave: 0,
    usedLeave: 0,
    penalty: 0,
  };
}

export function draftFromSetup(s: SetupInfo): SetupDraft {
  return {
    userName: s.userName ?? '',
    militaryType: s.militaryType,
    startDate: s.startDate,
    hometown: s.hometown ?? '',
    militaryCity: s.militaryCity ?? '',
    roadLeave: s.roadLeave ?? 0,
    usedLeave: s.usedLeave ?? 0,
    penalty: s.penalty ?? 0,
  };
}

export function clampDays(value: number, max: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(Math.floor(value), max);
}

/** Adımı geçmeye engel bir hata varsa mesajını döner. */
export function stepError(step: SetupStep, d: SetupDraft): string | null {
  if (step === 'name' && d.userName.trim().length < 2) return 'Adın en az 2 karakter olmalı.';
  if (step === 'date') {
    if (!d.startDate) return 'Başlangıç tarihini seç.';
    if (!d.hometown) return 'Memleketini seç.';
    if (!d.militaryCity) return 'Birlik şehrini seç.';
  }
  return null;
}

export function canContinue(step: SetupStep, d: SetupDraft): boolean {
  return stepError(step, d) === null;
}

export function setupFromDraft(d: SetupDraft): SetupInfo {
  return {
    militaryType: d.militaryType,
    startDate: d.startDate,
    totalDays: baseDaysFor(d.militaryType),
    userName: d.userName.trim().slice(0, LIMITS.name),
    hometown: d.hometown,
    militaryCity: d.militaryCity,
    roadLeave: clampDays(d.roadLeave, LIMITS.roadLeave),
    usedLeave: clampDays(d.usedLeave, LIMITS.usedLeave),
    penalty: clampDays(d.penalty, LIMITS.penalty),
  };
}
