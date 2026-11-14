import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import { MainTabParamList } from './types';
import { FloatingTabBar } from './FloatingTabBar';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Şafak' }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Takvim' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ayarlar' }} />
    </Tab.Navigator>
  );
}
