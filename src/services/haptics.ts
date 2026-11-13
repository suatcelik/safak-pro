import * as Haptics from 'expo-haptics';

const safe = (p: Promise<void>) => p.catch(() => {});

/** Buton dokunuşu */
export const tapHaptic = () => safe(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
/** Gün boyama, seçim değişimi */
export const selectHaptic = () => safe(Haptics.selectionAsync());
/** Kilometre taşı tamamlandı */
export const successHaptic = () =>
  safe(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
