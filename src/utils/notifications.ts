import * as Notifications from 'expo-notifications';
import { addDays, parseISO } from 'date-fns';
import { getRandomQuote } from './quotes';
import { SetupInfo } from './storage';

// Uygulama açıkken de bildirimlerin üstten düşmesini sağlar
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true, // shouldShowAlert yerine geldi
        shouldShowList: true,   // shouldShowAlert yerine geldi
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// İzinleri İsteme Fonksiyonu
export async function requestNotificationPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    return finalStatus === 'granted';
}

// Tüm Bildirimleri Temizleyip Yeniden Kurma Ana Fonksiyonu
export async function setupAllNotifications(setup: SetupInfo) {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    // Çakışmaları önlemek için eski planlanmış bildirimleri iptal et
    await Notifications.cancelAllScheduledNotificationsAsync();

    await scheduleDailyQuotes();
    await scheduleMilestones(setup);
}

// 1. Günün Sözü Bildirimleri (Önümüzdeki 30 gün için her sabah 08:00)
async function scheduleDailyQuotes() {
    const today = new Date();

    for (let i = 1; i <= 30; i++) {
        const targetDate = addDays(today, i);
        targetDate.setHours(8, 0, 0, 0); // Sabah 08:00

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Günün Sözü 🇹🇷",
                body: getRandomQuote(),
                sound: true,
            },
            // YENİ TETİKLEYİCİ YAPISI
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: targetDate
            },
        });
    }
}

// 2. Kilometre Taşı Bildirimleri
async function scheduleMilestones(setup: SetupInfo) {
    const start = parseISO(setup.startDate);
    const effectiveTotalDays = setup.totalDays + (setup.usedLeave || 0) + (setup.penalty || 0);
    const end = addDays(start, effectiveTotalDays - (setup.roadLeave || 0));

    // Tanımlı kilometre taşları
    const milestones = [
        { daysLeft: 100, title: "Dalya! 💯", body: "Şafak 100'den düştü, yüzler bitiyor! Dayan az kaldı." },
        { daysLeft: 81, title: "Plakalara Düştük! 🗺️", body: "Artık il il sayma vakti. Şafak 81 Düzce!" },
        { daysLeft: 0, title: "Doğan Güneş! 🌅", body: "Hürgeneral! Vatan borcu bitti, geçmiş olsun." }
    ];

    for (const m of milestones) {
        // Bitiş tarihinden hedeflenen gün kadar geriye git
        const targetDate = addDays(end, -m.daysLeft);
        targetDate.setHours(9, 0, 0, 0); // Sabah 09:00'da müjdeyi ver

        // Sadece tarih bugünden ilerideyse planla
        if (targetDate > new Date()) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: m.title,
                    body: m.body,
                    sound: true,
                },
                // YENİ TETİKLEYİCİ YAPISI
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: targetDate
                },
            });
        }
    }
}