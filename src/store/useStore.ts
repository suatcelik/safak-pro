import { create } from 'zustand';
import { SetupInfo } from '../utils/storage';

interface AppState {
    setup: SetupInfo | null;
    setSetup: (data: SetupInfo) => void;
    isPremium: boolean;
    setIsPremium: (status: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
    setup: null,
    setSetup: (data) => set({ setup: data }),
    isPremium: false,
    setIsPremium: (status) => set({ isPremium: status }),
}));