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
        ok ? 'Premium tekrar aktif edildi. ✅' : 'Bu hesaba ait satın alma bulunamadı.',
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
      <View className="mb-8 mt-12 flex-row items-center">
        <Star size={32} color="#f59e0b" />
        <Text className="ml-3 text-3xl font-bold text-white">Premium</Text>
      </View>

      <View className="mb-6 rounded-2xl border border-gray-700 bg-safakSecondary p-5">
        <View className="mb-3 flex-row items-center">
          <ShieldCheck size={22} color="#10b981" />
          <Text className="ml-3 text-lg font-semibold text-white">Reklamları Kaldır</Text>
        </View>

        <Text className="leading-6 text-gray-300">
          • Ana sayfa banner kaldırılır{'\n'}• Ayarlar banner kaldırılır{'\n'}• Takvim girişindeki
          ödüllü reklam kaldırılır
        </Text>

        <View className="my-5 h-[1px] bg-gray-700" />

        <Text className="text-sm text-gray-400">
          Durum:{' '}
          <Text className={`${isPremium ? 'text-emerald-400' : 'text-gray-200'} font-bold`}>
            {isPremium ? 'Premium Aktif ✅' : 'Ücretsiz'}
          </Text>
        </Text>
      </View>

      <TouchableOpacity
        disabled={loading}
        onPress={onBuy}
        className={`items-center rounded-2xl p-5 ${
          isPremium ? 'border border-[#10b98150] bg-[#10b98115]' : 'bg-safakPrimary'
        }`}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text className={`text-lg font-bold ${isPremium ? 'text-emerald-400' : 'text-white'}`}>
            {isPremium ? 'Premium Aktif' : 'Satın Al (Remove Ads)'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        disabled={loading}
        onPress={onRestore}
        className="mt-4 items-center rounded-2xl border border-gray-700 bg-safakSecondary p-5"
      >
        <Text className="font-semibold text-white">Satın Almayı Geri Yükle</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} className="mt-6 items-center">
        <Text className="text-gray-400">Geri dön</Text>
      </TouchableOpacity>
    </View>
  );
}
