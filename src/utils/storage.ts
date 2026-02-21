import AsyncStorage from '@react-native-async-storage/async-storage';

export const IS_FIRST_LAUNCH_KEY = 'isFirstLaunch';
export const USER_SETUP_KEY = 'userSetupInfo';
export const PAINTED_DAYS_KEY = 'paintedDaysInfo';
export const LAST_COLOR_KEY = 'lastSelectedColor'; // Kullanıcının paletten en son seçtiği rengi hatırlamak için

export interface SetupInfo {
    militaryType: 'short' | 'long' | 'paid' | 'officer';
    startDate: string;
    totalDays: number;
    userName?: string;
    hometown?: string;
    militaryCity?: string;
    usedLeave?: number;
    penalty?: number;
    roadLeave?: number;
}

// Gün numarası ve o güne ait renk bilgisini tutan yapı
export type PaintedDaysMap = { [day: number]: string };

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
        return value === null ? true : JSON.parse(value);
    } catch (e) {
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

// Boyanan günleri objeler halinde getir
export const getPaintedDays = async (): Promise<PaintedDaysMap> => {
    try {
        const value = await AsyncStorage.getItem(PAINTED_DAYS_KEY);
        if (value) {
            const parsed = JSON.parse(value);
            // EĞER ESKİ SİSTEMDE ARRAY OLARAK KAYDEDİLMİŞSE, YENİ SİSTEME DÖNÜŞTÜR (Çökmeyi önler)
            if (Array.isArray(parsed)) {
                const newFormat: PaintedDaysMap = {};
                parsed.forEach(day => {
                    newFormat[day] = '#10b981'; // Eski boyamaları varsayılan yeşile çevir
                });
                await AsyncStorage.setItem(PAINTED_DAYS_KEY, JSON.stringify(newFormat));
                return newFormat;
            }
            return parsed;
        }
        return {};
    } catch (e) {
        console.error("Error fetching painted days", e);
        return {};
    }
};

// Bir günü belirtilen renge boya veya boyayı kaldır
export const togglePaintedDay = async (dayNumber: number, color: string): Promise<PaintedDaysMap> => {
    try {
        const currentDays = await getPaintedDays();
        const updatedDays = { ...currentDays };

        if (updatedDays[dayNumber] === color) {
            // Eğer kutu zaten SEÇİLİ RENK ile aynıysa, boyayı tamamen sil (Kutuyu boşalt)
            delete updatedDays[dayNumber];
        } else {
            // Kutu boşsa veya FARKLI BİR RENKTEYSE, yeni seçilen renge boya
            updatedDays[dayNumber] = color;
        }

        await AsyncStorage.setItem(PAINTED_DAYS_KEY, JSON.stringify(updatedDays));
        return updatedDays;
    } catch (e) {
        console.error("Error toggling painted day", e);
        return {};
    }
};

// Kullanıcının fırçada bıraktığı son rengi kaydet
export const saveLastColor = async (color: string) => {
    try {
        await AsyncStorage.setItem(LAST_COLOR_KEY, color);
    } catch (e) {
        console.error("Error saving last color", e);
    }
};

// Kaydedilen son fırça rengini getir
export const getLastColor = async (): Promise<string> => {
    try {
        const value = await AsyncStorage.getItem(LAST_COLOR_KEY);
        return value || '#10b981';
    } catch (e) {
        return '#10b981';
    }
};
// Boyanan günleri tamamen sıfırla (Askerlik tipi değiştiğinde kullanılır)
export const clearPaintedDays = async () => {
    try {
        await AsyncStorage.setItem(PAINTED_DAYS_KEY, JSON.stringify({}));
    } catch (e) {
        console.error("Error clearing painted days", e);
    }
};