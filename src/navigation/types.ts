import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
    Home: undefined;
    Calendar: undefined;
    Settings: undefined;
};

export type RootStackParamList = {
    Splash: undefined;
    Onboarding: undefined;
    Setup: undefined;
    MainTabs: NavigatorScreenParams<MainTabParamList>;
    Premium: undefined; // <-- Bunu yeni ekledik
};