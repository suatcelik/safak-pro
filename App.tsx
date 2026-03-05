import "./global.css";
import React, { useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { requestNotificationPermissions } from './src/utils/notifications';

// Uygulamada navigation hatası gibi genel hataları çözmek için varsayılan bir navigasyon kapsayıcısı
export default function App() {

  useEffect(() => {
    // Uygulama ilk açıldığında bildirim izinlerini kontrol et ve iste
    requestNotificationPermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}