import React from 'react';
import { View, Text, TouchableOpacity, Alert, Linking, ScrollView } from 'react-native';
import { UserCog, Trash2, CalendarDays, ShieldCheck, ExternalLink } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { clearAllData } from '../utils/storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type SettingsNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
    const navigation = useNavigation<SettingsNavProp>();

    // GitHub Pages linkinizi buraya ekleyin
    const PRIVACY_POLICY_URL = 'https://suatcelik.github.io/-afak-Sayar-privacy-policy/';

    const handleOpenPrivacyPolicy = async () => {
        try {
            const supported = await Linking.canOpenURL(PRIVACY_POLICY_URL);
            if (supported) {
                await Linking.openURL(PRIVACY_POLICY_URL);
            } else {
                Alert.alert("Hata", "Gizlilik politikası sayfası şu an açılamıyor.");
            }
        } catch (error) {
            Alert.alert("Hata", "Bağlantı açılırken bir sorun oluştu.");
        }
    };

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
        <ScrollView className="flex-1 bg-safakDark">
            <View className="p-6">
                {/* Başlık - View olarak düzeltildi */}
                <View className="mt-12 flex-row items-center mb-10">
                    <UserCog size={32} color="#10b981" />
                    <Text className="text-white text-3xl font-bold ml-3">Ayarlar</Text>
                </View>

                {/* Hesap & Veri Bölümü */}
                <Text className="text-gray-400 mb-4 px-2 tracking-wide text-sm font-semibold uppercase">Hesap & Veri</Text>

                <View className="bg-safakSecondary rounded-2xl border border-gray-700 overflow-hidden mb-8">
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

                {/* Uygulama Hakkında Bölümü */}
                <Text className="text-gray-400 mb-4 px-2 tracking-wide text-sm font-semibold uppercase">Uygulama</Text>

                <View className="bg-safakSecondary rounded-2xl border border-gray-700 overflow-hidden">
                    <TouchableOpacity
                        className="flex-row items-center justify-between p-5"
                        onPress={handleOpenPrivacyPolicy}
                    >
                        <View className="flex-row items-center">
                            <ShieldCheck size={24} color="#10b981" />
                            <Text className="text-white text-lg font-medium ml-4">Gizlilik Politikası</Text>
                        </View>
                        <ExternalLink size={20} color="#64748b" />
                    </TouchableOpacity>
                </View>

                {/* Versiyon Bilgisi */}
                <View className="mt-12 items-center mb-10">
                    <Text className="text-gray-600 text-sm italic">Şafak Sayar v1.0.0</Text>
                </View>
            </View>
        </ScrollView>
    );
}