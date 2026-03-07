import "./global.css";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { requestNotificationPermissions } from "./src/utils/notifications";

// Ads / ATT
import { initAds } from "./src/services/ads";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";

// IAP
import { initIAP, restorePurchases } from "./src/services/iapService";

// Local premium hydrate (opsiyonel ama hızlı açılış için önerilir)
import { getPremiumLocal } from "./src/utils/storage";
import { useStore } from "./src/store/useStore";

export default function App() {
  const setIsPremium = useStore((s) => s.setIsPremium);

  useEffect(() => {
    // 1) Bildirim izinleri
    requestNotificationPermissions();

    // 2) Ads + ATT + IAP başlangıç
    (async () => {
      try {
        // iOS ATT (isterse sorar)
        if (Platform.OS === "ios") {
          try {
            await requestTrackingPermissionsAsync();
          } catch { }
        }

        // AdMob init
        await initAds();

        // Local premium hızlı yükle (app açılır açılmaz reklamı saklamak için)
        try {
          const localPremium = await getPremiumLocal();
          if (localPremium) setIsPremium(true);
        } catch { }

        // IAP init + restore (asıl doğrulama)
        await initIAP();
        await restorePurchases();
      } catch (e) {
        console.log("App init error:", e);
      }
    })();
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