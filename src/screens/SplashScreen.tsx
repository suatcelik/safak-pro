import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirstLaunch, getUserSetup } from '../utils/storage';
import { Shield } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
    const navigation = useNavigation<SplashScreenNavigationProp>();

    useEffect(() => {
        const checkAppStatus = async () => {
            try {
                const isFirstLaunch = await getFirstLaunch();
                if (isFirstLaunch) {
                    navigation.replace('Onboarding');
                    return;
                }

                const userSetup = await getUserSetup();
                if (!userSetup || !userSetup.startDate) {
                    navigation.replace('Setup');
                    return;
                }

                navigation.replace('MainTabs');

            } catch (error) {
                console.error("Hata Splash Screen kontrolü", error);
                navigation.replace('Setup');
            }
        };

        // Biraz yapay bekleme süresi, logoyu göstermek için
        setTimeout(checkAppStatus, 2000);
    }, [navigation]);

    return (
        <View className="flex-1 items-center justify-center bg-safakDark">
            <Shield size={100} color="#10b981" />
            <Text className="text-white text-3xl font-bold mt-6 tracking-widest">
                ŞAFAK SAYAR
            </Text>
            <Text className="text-gray-400 text-lg mt-2 font-medium">
                Vatan Borcu
            </Text>
            <View className="absolute bottom-20">
                <ActivityIndicator size="large" color="#10b981" />
            </View>
        </View>
    );
}
