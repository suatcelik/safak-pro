import React, { useEffect, useSyncExternalStore } from 'react';
import { AppState } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as ScreenOrientation from 'expo-screen-orientation';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import AppNavigator from './src/navigation/AppNavigator';
import { useStore } from './src/store/useStore';
import { cancelAllNotifications, rescheduleNotifications } from './src/services/notifications';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { colors } from './src/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});
// Uygulama dikey çalışır; yalnızca Takvim kendini yataya kilitler.
ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});

const navTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.bg, card: colors.bg, primary: colors.accent },
};

/** Kalıcı store AsyncStorage'dan yüklendi mi? */
function useHydrated() {
  return useSyncExternalStore(
    (onChange) => useStore.persist.onFinishHydration(onChange),
    () => useStore.persist.hasHydrated(),
  );
}

export default function App() {
  const hydrated = useHydrated();
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const ready = hydrated && (fontsLoaded || !!fontError);
  const setup = useStore((s) => s.setup);
  const notificationsEnabled = useStore((s) => s.notificationsEnabled);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  // Günlük söz penceresini her açılışta ve uygulama öne geldiğinde 30 gün ileri taşı
  useEffect(() => {
    if (!hydrated || !setup) return;
    if (!notificationsEnabled) {
      cancelAllNotifications().catch(() => {});
      return;
    }
    rescheduleNotifications(setup);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') rescheduleNotifications(setup);
    });
    return () => sub.remove();
  }, [hydrated, setup, notificationsEnabled]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <NavigationContainer theme={navTheme}>
          <AppNavigator />
        </NavigationContainer>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
