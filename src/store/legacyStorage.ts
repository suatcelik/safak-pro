import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';
import { normalizeCityName } from '../domain/cities';
import type { SetupInfo } from '../domain/service';

/** 1.0 sürümünün ayrı ayrı tuttuğu anahtarlar */
export const LEGACY_KEYS = [
  'isFirstLaunch',
  'userSetupInfo',
  'paintedDaysInfo',
  'lastSelectedColor',
  'IS_PREMIUM_V1',
  'APP_THEME_V1',
];

const DEFAULT_COLOR = '#10b981';

function parse<T>(raw: string | null): T | null {
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Eski anahtarlardan store şeklinde bir durum üretir; eski veri yoksa null. */
export async function readLegacyState() {
  const entries = Object.fromEntries(await AsyncStorage.multiGet(LEGACY_KEYS));
  const firstLaunch = parse<boolean>(entries.isFirstLaunch);
  const setup = parse<SetupInfo>(entries.userSetupInfo);
  const painted = parse<Record<string, string> | number[]>(entries.paintedDaysInfo);
  if (firstLaunch == null && setup == null && painted == null) return null;

  const paintedDays: Record<number, string> = {};
  if (Array.isArray(painted)) painted.forEach((d) => (paintedDays[d] = DEFAULT_COLOR));
  else if (painted) Object.entries(painted).forEach(([d, c]) => (paintedDays[Number(d)] = c));

  return {
    hasOnboarded: firstLaunch === false || setup != null,
    setup: setup?.startDate
      ? {
          ...setup,
          startDate: setup.startDate.slice(0, 10),
          hometown: normalizeCityName(setup.hometown),
          militaryCity: normalizeCityName(setup.militaryCity),
        }
      : null,
    paintedDays,
    lastColor: entries.lastSelectedColor || DEFAULT_COLOR,
  };
}

/**
 * AsyncStorage sarmalayıcısı: yeni anahtar yoksa eski anahtarlardan taşır,
 * ilk yazmada eski anahtarları siler.
 */
export function createMigratingStorage(version: number): StateStorage {
  return {
    async getItem(name) {
      const current = await AsyncStorage.getItem(name);
      if (current != null) return current;
      const legacy = await readLegacyState();
      return legacy ? JSON.stringify({ state: legacy, version }) : null;
    },
    async setItem(name, value) {
      await AsyncStorage.setItem(name, value);
      await AsyncStorage.multiRemove(LEGACY_KEYS);
    },
    async removeItem(name) {
      await AsyncStorage.removeItem(name);
    },
  };
}
