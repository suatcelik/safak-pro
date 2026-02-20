import AsyncStorage from '@react-native-async-storage/async-storage';

export const IS_FIRST_LAUNCH_KEY = 'isFirstLaunch';
export const USER_SETUP_KEY = 'userSetupInfo';

// Boyanan günleri tutmak için yeni bir anahtar
export const PAINTED_DAYS_KEY = 'paintedDaysInfo';

export interface SetupInfo {
    militaryType: 'short' | 'long' | 'paid' | 'officer';
    startDate: string;
    totalDays: number;
    // Yeni eklenen alanlar
    userName?: string;
    hometown?: string;
    militaryCity?: string;
    usedLeave?: number;
    penalty?: number;
    roadLeave?: number;
}

export const setFirstLaunch = async (isFirst: boolean) => {
    try {
        await AsyncStorage.setItem(IS_FIRST_LAUNCH_KEY, JSON.stringify(isFirst));
    } catch (e) {
        console.error("Error setting first launch status", e);
    }
};

export const getFirstLaunch = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem(IS_FIRST_LAUNCH_KEY);
        if (value === null) {
            return true;
        }
        return JSON.parse(value);
    } catch (e) {
        console.error("Error getting first launch status", e);
        return true;
    }
};

export const saveUserSetup = async (setupInfo: SetupInfo) => {
    try {
        await AsyncStorage.setItem(USER_SETUP_KEY, JSON.stringify(setupInfo));
    } catch (e) {
        console.error("Error saving user setup", e);
    }
};

export const getUserSetup = async (): Promise<SetupInfo | null> => {
    try {
        const value = await AsyncStorage.getItem(USER_SETUP_KEY);
        return value ? JSON.parse(value) : null;
    } catch (e) {
        console.error("Error fetching user setup", e);
        return null;
    }
};

export const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
    } catch (e) {
        console.error("Error clearing async storage", e);
    }
};

// Boyanan günleri getir
export const getPaintedDays = async (): Promise<number[]> => {
    try {
        const value = await AsyncStorage.getItem(PAINTED_DAYS_KEY);
        return value ? JSON.parse(value) : [];
    } catch (e) {
        console.error("Error fetching painted days", e);
        return [];
    }
};

// Bir günü boya veya boyayı kaldır
export const togglePaintedDay = async (dayNumber: number): Promise<number[]> => {
    try {
        const currentDays = await getPaintedDays();
        let updatedDays;

        if (currentDays.includes(dayNumber)) {
            // Zaten boyalıysa boyayı kaldır
            updatedDays = currentDays.filter(d => d !== dayNumber);
        } else {
            // Boyalı değilse listeye ekle
            updatedDays = [...currentDays, dayNumber];
        }

        await AsyncStorage.setItem(PAINTED_DAYS_KEY, JSON.stringify(updatedDays));
        return updatedDays;
    } catch (e) {
        console.error("Error toggling painted day", e);
        return [];
    }
};