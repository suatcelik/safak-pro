import * as Notifications from 'expo-notifications';
import { buildNotificationPlan } from '../domain/notificationPlan';
import { getRandomQuote } from '../domain/quotes';
import type { SetupInfo } from '../domain/service';

// Uygulama açıkken de bildirimler üstten düşsün
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export type PermissionState = 'granted' | 'denied' | 'undetermined';

export async function getNotificationPermission(): Promise<PermissionState> {
  const { status } = await Notifications.getPermissionsAsync();
  return status as PermissionState;
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Planlanmış tüm bildirimleri silip bugünden itibaren yeniden kurar.
 * İzin istemez; izin yoksa hiçbir şey yapmaz.
 */
export async function rescheduleNotifications(setup: SetupInfo): Promise<void> {
  try {
    if ((await getNotificationPermission()) !== 'granted') return;
    await cancelAllNotifications();
    const plan = buildNotificationPlan(setup, new Date(), getRandomQuote);
    for (const n of plan) {
      await Notifications.scheduleNotificationAsync({
        content: { title: n.title, body: n.body, sound: true },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: n.date },
      });
    }
  } catch (e) {
    console.warn('[notifications] reschedule failed', e);
  }
}
