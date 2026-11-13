import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import SetupScreen from '../screens/SetupScreen';
import TabNavigator from './TabNavigator';
import ShareScreen from '../screens/ShareScreen';
import { RootStackParamList } from './types';
import { useStore } from '../store/useStore';
import { colors } from '../theme/tokens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  // Store yüklendikten sonra render edilir; ilk rota yalnızca açılışta okunur.
  const initialRouteName = useStore.getState().setup
    ? 'MainTabs'
    : useStore.getState().hasOnboarded
      ? 'Setup'
      : 'Onboarding';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Setup" component={SetupScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen
        name="Share"
        component={ShareScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}
