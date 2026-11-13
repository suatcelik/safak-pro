import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { SetupInfo } from '../domain/service';
import { createMigratingStorage } from './legacyStorage';

export type PaintedDaysMap = Record<number, string>;

const STORE_VERSION = 1;
const DEFAULT_COLOR = '#10b981';

interface PersistedState {
  hasOnboarded: boolean;
  setup: SetupInfo | null;
  paintedDays: PaintedDaysMap;
  lastColor: string;
}

interface AppState extends PersistedState {
  completeOnboarding: () => void;
  /** Askerlik türü değişirse boyalı günler sıfırlanır. */
  saveSetup: (setup: SetupInfo) => void;
  togglePaintedDay: (day: number, color: string) => void;
  setLastColor: (color: string) => void;
  reset: () => void;
}

const initialState: PersistedState = {
  hasOnboarded: false,
  setup: null,
  paintedDays: {},
  lastColor: DEFAULT_COLOR,
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
      reset: () => set(initialState),
    }),
    {
      name: 'safak-sayar-store',
      version: STORE_VERSION,
      storage: createJSONStorage(() => createMigratingStorage(STORE_VERSION)),
      partialize: ({ hasOnboarded, setup, paintedDays, lastColor }) => ({
        hasOnboarded,
        setup,
        paintedDays,
        lastColor,
      }),
    },
  ),
);
