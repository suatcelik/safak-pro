import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking, ScrollView, Switch } from 'react-native';
import { UserCog, Trash2, CalendarDays, ShieldCheck, ExternalLink, Star, Palmtree, Moon, Sun } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { clearAllData, getThemeLocal, setThemeLocal } from '../utils/storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import AdBanner from '../components/AdBanner';
import { useStore } from '../store/useStore';

type SettingsNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
    const navigation = useNavigation<SettingsNavProp>();
    const isPremium = useStore((state) => state.isPremium);
    const theme = useStore((state) => state.theme);
    const setTheme = useStore((state) => state.setTheme);

    const PRIVACY_POLICY_URL = 'https://suatcelik.github.io/-afak-Sayar-privacy-policy/';

    // Tema tercihini AsyncStorage'dan yükle
    useEffect(() => {
        getThemeLocal().then((saved) => setTheme(saved));
    }, []);

    const handleOpenPrivacyPolicy = async () => {
        try {
            const supported = await Linking.canOpenURL(PRIVACY_POLICY_URL);
            if (supported) {
                await Linking.openURL(PRIVACY_POLICY_URL);
            } else {
                Alert.alert('Hata', 'Gizlilik politikası sayfası şu an açılamıyor.');
            }
        } catch (error) {
            Alert.alert('Hata', 'Bağlantı açılırken bir sorun oluştu.');
        }
    };

    const handleReset = () => {
        Alert.alert('Sıfırla', 'Tüm şafak ve sülüs bilgilerin silinecek. Emin misin?', [
            { text: 'İptal', style: 'cancel' },
            {
                text: 'Sil ve Sıfırla',
                style: 'destructive',
                onPress: async () => {
                    await clearAllData();
                    navigation.replace('Splash');
                },
            },
        ]);
    };

    const handleRemoveAdsPress = () => {
        if (isPremium) {
            Alert.alert('Premium Aktif', 'Reklamlar zaten kaldırılmış. ✅');
            return;
        }
        navigation.navigate('Premium');
    };

    // Y-4: Tema toggle işleyicisi
    const handleThemeToggle = async (value: boolean) => {
        const newTheme = value ? 'light' : 'dark';
        setTheme(newTheme);
        await setThemeLocal(newTheme);
        // Not: tam light tema renk uygulaması gelecek sürümde
        if (newTheme === 'light') {
            Alert.alert(
                'Açık Tema',
                'Açık tema tercihiniz kaydedildi. Tam açık tema desteği yakında gelecek.',
                [{ text: 'Tamam' }]
            );
        }
    };

    return (
        <View className="flex-1 bg-safakDark">
            <ScrollView
                className="flex-1 bg-safakDark"
                contentContainerStyle={{ paddingBottom: 170 }}
            >
                <View className="p-6">
                    {/* Başlık */}
                    <View className="mt-12 flex-row items-center mb-10">
                        <UserCog size={32} color="#10b981" />
                        <Text className="text-white text-3xl font-bold ml-3">Ayarlar</Text>
                    </View>

                    {/* Hesap & Veri */}
                    <Text className="text-gray-400 mb-4 px-2 tracking-wide text-sm font-semibold uppercase">
                        Hesap & Veri
                    </Text>

                    <View className="bg-safakSecondary rounded-2xl border border-gray-700 overflow-hidden mb-8">
                        <TouchableOpacity
                            className="flex-row items-center justify-between p-5 border-b border-gray-700"
                            onPress={() => navigation.navigate('Setup')}
                            accessibilityLabel="Askerlik bilgilerini güncelle"
                            accessibilityRole="button"
                        >
                            <View className="flex-row items-center">
                                <CalendarDays size={24} color="#3b82f6" />
                                <Text className="text-white text-lg font-medium ml-4">Bilgileri Güncelle</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Y-5: İzin Hesaplama linki */}
                        <TouchableOpacity
                            className="flex-row items-center justify-between p-5 border-b border-gray-700"
                            onPress={() => navigation.navigate('LeaveCalculator')}
                            accessibilityLabel="İzin hesabını görüntüle"
                            accessibilityRole="button"
                        >
                            <View className="flex-row items-center">
                                <Palmtree size={24} color="#10b981" />
                                <View className="ml-4">
                                    <Text className="text-white text-lg font-medium">İzin Hesabı</Text>
                                    <Text className="text-gray-400 text-xs mt-0.5">Hak edilen ve kalan izinler</Text>
                                </View>
                            </View>
                            <Text className="text-gray-400 text-sm">{'>'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center justify-between p-5"
                            onPress={handleReset}
                            accessibilityLabel="Tüm verileri sıfırla"
                            accessibilityRole="button"
                        >
                            <View className="flex-row items-center">
                                <Trash2 size={24} color="#ef4444" />
                                <Text className="text-red-400 text-lg font-medium ml-4">Tüm Verileri Sıfırla</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Uygulama */}
                    <Text className="text-gray-400 mb-4 px-2 tracking-wide text-sm font-semibold uppercase">Uygulama</Text>

                    <View className="bg-safakSecondary rounded-2xl border border-gray-700 overflow-hidden">
                        {/* Premium / Reklam kaldır */}
                        <TouchableOpacity
                            className="flex-row items-center justify-between p-5 border-b border-gray-700"
                            onPress={handleRemoveAdsPress}
                            accessibilityLabel={isPremium ? 'Premium aktif' : 'Reklamları kaldır'}
                            accessibilityRole="button"
                        >
                            <View className="flex-row items-center">
                                <Star size={24} color={isPremium ? '#10b981' : '#f59e0b'} />
                                <View className="ml-4">
                                    <Text className="text-white text-lg font-medium">
                                        {isPremium ? 'Premium Aktif' : 'Reklamları Kaldır'}
                                    </Text>
                                    <Text className="text-gray-400 text-xs mt-0.5">
                                        {isPremium ? 'Reklamsız kullanım açık ✅' : 'Tek seferlik satın alma'}
                                    </Text>
                                </View>
                            </View>
                            <Text className={`text-sm font-bold ${isPremium ? 'text-emerald-400' : 'text-gray-400'}`}>
                                {isPremium ? '✅' : '>'}
                            </Text>
                        </TouchableOpacity>

                        {/* Y-4: Tema toggle */}
                        <View
                            className="flex-row items-center justify-between p-5 border-b border-gray-700"
                            accessibilityLabel={`Açık tema ${theme === 'light' ? 'aktif' : 'kapalı'}`}
                        >
                            <View className="flex-row items-center">
                                {theme === 'light' ? (
                                    <Sun size={24} color="#f59e0b" />
                                ) : (
                                    <Moon size={24} color="#94a3b8" />
                                )}
                                <View className="ml-4">
                                    <Text className="text-white text-lg font-medium">Açık Tema</Text>
                                    <Text className="text-gray-400 text-xs mt-0.5">Yakında tam destek</Text>
                                </View>
                            </View>
                            <Switch
                                value={theme === 'light'}
                                onValueChange={handleThemeToggle}
                                trackColor={{ false: '#334155', true: '#10b981' }}
                                thumbColor={theme === 'light' ? '#fff' : '#94a3b8'}
                                accessibilityLabel="Açık tema toggle"
                            />
                        </View>

                        {/* Gizlilik Politikası */}
                        <TouchableOpacity
                            className="flex-row items-center justify-between p-5"
                            onPress={handleOpenPrivacyPolicy}
                            accessibilityLabel="Gizlilik politikasını aç"
                            accessibilityRole="link"
                        >
                            <View className="flex-row items-center">
                                <ShieldCheck size={24} color="#10b981" />
                                <Text className="text-white text-lg font-medium ml-4">Gizlilik Politikası</Text>
                            </View>
                            <ExternalLink size={20} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    {/* Versiyon */}
                    <View className="mt-12 items-center mb-10">
                        <Text className="text-gray-600 text-sm italic">Şafak Sayar v1.0.0</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Sabit Banner */}
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                <AdBanner />
            </View>
        </View>
    );
}
