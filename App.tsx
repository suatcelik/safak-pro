import "./global.css";
import React, { useEffect } from "react";
import { AppState, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { requestNotificationPermissions } from "./src/utils/notifications";

// Ads / ATT
import { initAds } from "./src/services/ads";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";

// IAP
import { initIAP, restorePurchases, endIAP } from "./src/services/iapService";

// Local premium hydrate
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
        // iOS ATT (hata fırlatabilir, sessizce geçilebilir)
        if (Platform.OS === "ios") {
          try {
            await requestTrackingPermissionsAsync();
          } catch (e: any) {
            console.log("[ATT] Permission request skipped:", e?.message || e);
          }
        }

        // AdMob init
        await initAds();

        // Local premium hızlı yükle (app açılır açılmaz reklamı saklamak için)
        try {
          const localPremium = await getPremiumLocal();
          if (localPremium) setIsPremium(true);
        } catch (e: any) {
          console.log("[Premium] Local premium load error:", e?.message || e);
        }

        // IAP init + restore (asıl doğrulama)
        await initIAP();
        await restorePurchases();
      } catch (e) {
        console.log("[App] Init error:", e);
      }
    })();

    // H-4: Uygulama arka plana geçince IAP bağlantısını kapat
    const appStateSub = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background" || nextState === "inactive") {
        endIAP().catch((e: any) =>
          console.log("[IAP] endIAP on background error:", e?.message || e)
        );
      }
    });

    return () => {
      appStateSub.remove();
    };
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
