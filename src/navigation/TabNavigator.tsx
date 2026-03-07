import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Settings, CalendarDays } from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import { MainTabParamList } from './types';

// ✅ EKLENDİ
import { useStore } from '../store/useStore';
import { showRewardedGate } from '../services/ads';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigator() {
    const isPremium = useStore((s) => s.isPremium);

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
                    tabBarStyle: { display: 'none' }, // senin tasarımın: aynen
                }}
                listeners={({ navigation }) => ({
                    tabPress: async (e) => {
                        // ✅ Premium ise direkt geçsin
                        if (isPremium) return;

                        // ✅ Premium değilse: önce geçişi durdur
                        e.preventDefault();

                        // ✅ Rewarded izle -> ödül alınırsa Calendar'a geçir
                        const ok = await showRewardedGate();
                        if (ok) {
                            navigation.navigate('Calendar');
                        }
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