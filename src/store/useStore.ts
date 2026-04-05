import { create } from 'zustand';
import { SetupInfo } from '../utils/storage';

export type AppTheme = 'dark' | 'light';

interface AppState {
    setup: SetupInfo | null;
    setSetup: (data: SetupInfo) => void;

    isPremium: boolean;
    setIsPremium: (v: boolean) => void;

    // Y-4: Tema tercihi
    theme: AppTheme;
    setTheme: (t: AppTheme) => void;
}

export const useStore = create<AppState>((set) => ({
    setup: null,
    setSetup: (data) => set({ setup: data }),

    isPremium: false,
    setIsPremium: (v) => set({ isPremium: v }),

    // Varsayılan: karanlık tema
    theme: 'dark',
    setTheme: (t) => set({ theme: t }),
}));
