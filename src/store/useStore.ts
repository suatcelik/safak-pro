import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { SetupInfo } from '../domain/service';
import { createMigratingStorage } from './legacyStorage';
import { colors } from '../theme/tokens';

export type PaintedDaysMap = Record<number, string>;

const STORE_VERSION = 1;
const DEFAULT_COLOR = colors.accent;

interface PersistedState {
  hasOnboarded: boolean;
  setup: SetupInfo | null;
  paintedDays: PaintedDaysMap;
  lastColor: string;
  notificationsEnabled: boolean;
  /** Haptik kutlaması yapılmış tamamlanan kilometre taşı sayısı */
  celebratedMilestones: number;
}

interface AppState extends PersistedState {
  completeOnboarding: () => void;
  /** Askerlik türü değişirse boyalı günler sıfırlanır. */
  saveSetup: (setup: SetupInfo) => void;
  togglePaintedDay: (day: number, color: string) => void;
  setLastColor: (color: string) => void;
  setNotificationsEnabled: (v: boolean) => void;
  setCelebratedMilestones: (n: number) => void;
  reset: () => void;
}

const initialState: PersistedState = {
  hasOnboarded: false,
  setup: null,
  paintedDays: {},
  lastColor: DEFAULT_COLOR,
  notificationsEnabled: true,
  celebratedMilestones: 0,
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      completeOnboarding: () => set({ hasOnboarded: true }),
      saveSetup: (setup) =>
        set((s) => ({
          setup,
          paintedDays: s.setup && s.setup.militaryType !== setup.militaryType ? {} : s.paintedDays,
        })),
      togglePaintedDay: (day, color) =>
        set((s) => {
          const paintedDays = { ...s.paintedDays };
          if (paintedDays[day] === color) delete paintedDays[day];
          else paintedDays[day] = color;
          return { paintedDays };
        }),
      setLastColor: (lastColor) => set({ lastColor }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setCelebratedMilestones: (celebratedMilestones) => set({ celebratedMilestones }),
      reset: () => set(initialState),
    }),
    {
      name: 'safak-sayar-store',
      version: STORE_VERSION,
      storage: createJSONStorage(() => createMigratingStorage(STORE_VERSION)),
      partialize: (s) => ({
        hasOnboarded: s.hasOnboarded,
        setup: s.setup,
        paintedDays: s.paintedDays,
        lastColor: s.lastColor,
        notificationsEnabled: s.notificationsEnabled,
        celebratedMilestones: s.celebratedMilestones,
      }),
    },
  ),
);
