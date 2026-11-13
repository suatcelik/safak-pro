import './global.css';
import React, { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { useStore } from './src/store/useStore';
import { rescheduleNotifications } from './src/services/notifications';

SplashScreen.preventAutoHideAsync().catch(() => {});

function useHydrated() {
  const [hydrated, setHydrated] = useState(() => useStore.persist.hasHydrated());
  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useStore.persist.hasHydrated());
    return unsub;
  }, []);
  return hydrated;
}

export default function App() {
  const hydrated = useHydrated();
  const setup = useStore((s) => s.setup);

  useEffect(() => {
    if (hydrated) SplashScreen.hideAsync().catch(() => {});
  }, [hydrated]);

  // Günlük söz penceresini her açılışta ve uygulama öne geldiğinde 30 gün ileri taşı
  useEffect(() => {
    if (!hydrated || !setup) return;
    rescheduleNotifications(setup);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') rescheduleNotifications(setup);
    });
    return () => sub.remove();
  }, [hydrated, setup]);

  if (!hydrated) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
