import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Star, ShieldCheck } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { useStore } from '../store/useStore';
import { buyPremium, restorePurchases } from '../services/iapService';

export default function PremiumScreen() {
    const navigation = useNavigation<any>();
    const isPremium = useStore((s) => s.isPremium);

    const [loading, setLoading] = useState(false);

    const onBuy = async () => {
        if (isPremium) {
            Alert.alert('Premium Aktif', 'Reklamlar zaten kaldırılmış. ✅');
            return;
        }

        try {
            setLoading(true);

            // ✅ Satın alma tetiklenir, başarılı olunca listener store'u günceller
            const started = await buyPremium();

            if (!started) {
                // kullanıcı iptal etti
                return;
            }

            Alert.alert('Satın alma başlatıldı', 'Ödeme tamamlanınca Premium otomatik aktif olacaktır.');
            navigation.goBack();
        } catch (e: any) {
            Alert.alert('Satın alma başarısız', e?.message || 'Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const onRestore = async () => {
        try {
            setLoading(true);
            const ok = await restorePurchases();

            Alert.alert(
                ok ? 'Geri Yüklendi' : 'Bulunamadı',
                ok ? 'Premium tekrar aktif edildi. ✅' : 'Bu hesaba ait satın alma bulunamadı.'
            );

            if (ok) navigation.goBack();
        } catch (e: any) {
            Alert.alert('Hata', e?.message || 'Geri yükleme başarısız.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-safakDark p-6">
            <View className="mt-12 flex-row items-center mb-8">
                <Star size={32} color="#f59e0b" />
                <Text className="text-white text-3xl font-bold ml-3">Premium</Text>
            </View>

            <View className="bg-safakSecondary rounded-2xl border border-gray-700 p-5 mb-6">
                <View className="flex-row items-center mb-3">
                    <ShieldCheck size={22} color="#10b981" />
                    <Text className="text-white text-lg font-semibold ml-3">Reklamları Kaldır</Text>
                </View>

                <Text className="text-gray-300 leading-6">
                    • Ana sayfa banner kaldırılır{'\n'}
                    • Ayarlar banner kaldırılır{'\n'}
                    • Takvim girişindeki ödüllü reklam kaldırılır
                </Text>

                <View className="h-[1px] bg-gray-700 my-5" />

                <Text className="text-gray-400 text-sm">
                    Durum:{' '}
                    <Text className={`${isPremium ? 'text-emerald-400' : 'text-gray-200'} font-bold`}>
                        {isPremium ? 'Premium Aktif ✅' : 'Ücretsiz'}
                    </Text>
                </Text>
            </View>

            <TouchableOpacity
                disabled={loading}
                onPress={onBuy}
                className={`rounded-2xl p-5 items-center ${isPremium ? 'bg-[#10b98115] border border-[#10b98150]' : 'bg-safakPrimary'
                    }`}
            >
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <Text className={`font-bold text-lg ${isPremium ? 'text-emerald-400' : 'text-white'}`}>
                        {isPremium ? 'Premium Aktif' : 'Satın Al (Remove Ads)'}
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                disabled={loading}
                onPress={onRestore}
                className="rounded-2xl p-5 items-center mt-4 border border-gray-700 bg-safakSecondary"
            >
                <Text className="text-white font-semibold">Satın Almayı Geri Yükle</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} className="mt-6 items-center">
                <Text className="text-gray-400">Geri dön</Text>
            </TouchableOpacity>
        </View>
    );
}