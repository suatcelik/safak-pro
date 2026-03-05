import "./global.css";
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Purchases from 'react-native-purchases';
import { useStore } from './src/store/useStore';

import AppNavigator from './src/navigation/AppNavigator';
import { requestNotificationPermissions } from './src/utils/notifications';

// Kendi RevenueCat API Key'lerinizi buraya gireceksiniz.
const APIKeys = {
  apple: "appl_xTclTpqhmKcMxVOeHJqjyHhLpnb",
  google: "goog_PhscjNhbChKzbpUHtmCIxCwBguR"
};

export default function App() {
  const setIsPremium = useStore((state) => state.setIsPremium);

  useEffect(() => {
    requestNotificationPermissions();

    const setupRevenueCat = async () => {
      try {
        if (Platform.OS === "android") {
          Purchases.configure({ apiKey: APIKeys.google });
        } else if (Platform.OS === "ios") {
          Purchases.configure({ apiKey: APIKeys.apple });
        }

        const customerInfo = await Purchases.getCustomerInfo();

        // RevenueCat tarafında oluşturduğunuz Entitlement ID'sini buraya girin (Örn: "premium")
        if (typeof customerInfo.entitlements.active["premium"] !== "undefined") {
          setIsPremium(true);
        } else {
          setIsPremium(false);
        }
      } catch (e) {
        console.warn("RevenueCat Setup Error:", e);
      }
    };

    setupRevenueCat();
  }, [setIsPremium]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}