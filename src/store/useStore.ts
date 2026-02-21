import { create } from 'zustand';
import { SetupInfo } from '../utils/storage';

interface AppState {
    setup: SetupInfo | null;
    setSetup: (data: SetupInfo) => void;
}

export const useStore = create<AppState>((set) => ({
    setup: null,
    setSetup: (data) => set({ setup: data }),
}));