import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Settings, CalendarDays } from 'lucide-react-native';
// AdEventType importunu buraya ekledik:
import { RewardedAd, RewardedAdEventType, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { useStore } from '../store/useStore';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Canlıya çıkarken kendi Rewarded Ad ID'nizi ekleyeceksiniz.
const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx';
const rewarded = RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
});

export default function TabNavigator() {
    const isPremium = useStore((state) => state.isPremium);
    const [isAdLoaded, setIsAdLoaded] = useState(false);

    useEffect(() => {
        // Reklam yüklendiğinde
        const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
            setIsAdLoaded(true);
        });

        // Reklam kapatıldığında
        const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
            // Kullanıcı reklamı kapattığında bir sonraki sefer için yenisini yükle
            rewarded.load();
        });

        // İlk reklamı yükle
        rewarded.load();

        return () => {
            unsubscribeLoaded();
            unsubscribeClosed();
        };
    }, []);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0f172a',
                    borderTopColor: '#334155',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#10b981',
                tabBarInactiveTintColor: '#94a3b8',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Ana Sayfa',
                    tabBarIcon: ({ color, size }) => (
                        <Home color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarLabel: 'Takvim',
                    tabBarIcon: ({ color, size }) => (
                        <CalendarDays color={color} size={size} />
                    ),
                    tabBarStyle: { display: 'none' }
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault(); // Varsayılan geçişi engelle

                        if (isPremium) {
                            navigation.navigate('Calendar');
                        } else {
                            if (isAdLoaded) {
                                // Kullanıcı reklamı sonuna kadar izleyip ödülü kazandığında takvime geçiş yap
                                const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
                                    navigation.navigate('Calendar');
                                    unsubscribeEarned(); // Sadece 1 kez tetiklenmesi için kendini temizle
                                });
                                rewarded.show();
                            } else {
                                Alert.alert(
                                    "Yükleniyor",
                                    "Reklam henüz hazır değil, lütfen birkaç saniye sonra tekrar deneyin.",
                                    [{ text: "Tamam" }]
                                );
                            }
                        }
                    },
                })}
            />

            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarLabel: 'Ayarlar',
                    tabBarIcon: ({ color, size }) => (
                        <Settings color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}