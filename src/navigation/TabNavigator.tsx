import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Settings, CalendarDays } from 'lucide-react-native'; // CalendarDays eklendi
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CalendarScreen from '../screens/CalendarScreen'; // Takvim sayfası eklendi
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0f172a', // safakDark
                    borderTopColor: '#334155', // safakSecondary
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#10b981', // safakPrimary
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

            {/* --- YENİ EKLENEN TAKVİM SEKMESİ --- */}
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarLabel: 'Takvim',
                    tabBarIcon: ({ color, size }) => (
                        <CalendarDays color={color} size={size} />
                    ),
                }}
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