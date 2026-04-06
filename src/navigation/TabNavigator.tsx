import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Settings, CalendarDays } from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import { MainTabParamList } from './types';

import { useStore } from '../store/useStore';
import { showRewardedGate } from '../services/ads';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigator() {
    const isPremium = useStore((s) => s.isPremium);
    const [gatingAd, setGatingAd] = useState(false);

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
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
            />

            {/* --- TAKVİM (Rewarded Gate) --- */}
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarLabel: 'Takvim',
                    tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} />,
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        // Premium ise direkt geçsin
                        if (isPremium) return;

                        // Zaten reklam gösteriliyorsa tekrar tetikleme
                        if (gatingAd) {
                            e.preventDefault();
                            return;
                        }

                        // ÖNEMLİ: preventDefault SENKRON çağrılmalı
                        e.preventDefault();

                        // Sonra async reklam akışını başlat
                        setGatingAd(true);
                        showRewardedGate()
                            .then((ok) => {
                                if (ok) {
                                    navigation.navigate('Calendar');
                                }
                            })
                            .catch((err) => {
                                console.log('[TabNavigator] Rewarded gate error:', err);
                            })
                            .finally(() => {
                                setGatingAd(false);
                            });
                    },
                })}
            />

            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarLabel: 'Ayarlar',
                    tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
}