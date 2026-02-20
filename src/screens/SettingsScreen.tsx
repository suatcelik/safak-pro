import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { UserCog, Trash2, LogOut } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { clearAllData } from '../utils/storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type SettingsNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
    const navigation = useNavigation<SettingsNavProp>();

    const handleReset = () => {
        Alert.alert(
            "Sıfırla",
            "Tüm şafak ve sülüs bilgilerin silinecek. Emin misin?",
            [
                { text: "İptal", style: "cancel" },
                {
                    text: "Sil ve Sıfırla",
                    style: "destructive",
                    onPress: async () => {
                        await clearAllData();
                        navigation.replace('Splash');
                    }
                }
            ]
        );
    };

    return (
        <View className="flex-1 bg-safakDark p-6">
            <View className="mt-12 flex-row items-center mb-10">
                <UserCog size={32} color="#10b981" />
                <Text className="text-white text-3xl font-bold ml-3">Ayarlar</Text>
            </View>

            <Text className="text-gray-400 mb-4 px-2 tracking-wide text-sm font-semibold uppercase">Hesap & Veri</Text>

            <View className="bg-safakSecondary rounded-2xl border border-gray-700 overflow-hidden">
                <TouchableOpacity
                    className="flex-row items-center justify-between p-5 border-b border-gray-700"
                    onPress={() => navigation.navigate('Setup')}
                >
                    <View className="flex-row items-center">
                        <CalendarDays size={24} color="#3b82f6" />
                        <Text className="text-white text-lg font-medium ml-4">Bilgileri Güncelle</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-row items-center justify-between p-5"
                    onPress={handleReset}
                >
                    <View className="flex-row items-center">
                        <Trash2 size={24} color="#ef4444" />
                        <Text className="text-red-400 text-lg font-medium ml-4">Tüm Verileri Sıfırla</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View className="flex-1 justify-end items-center mb-8">
                <Text className="text-gray-600 text-sm">Şafak Sayar Pro v1.0.0</Text>
            </View>
        </View>
    );
}

// Kalendar ikonu Settings içinde de olsun
import { CalendarDays } from 'lucide-react-native';
