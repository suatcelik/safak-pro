import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking, ScrollView, Switch } from 'react-native';
import {
  UserCog,
  Trash2,
  CalendarDays,
  ShieldCheck,
  ExternalLink,
  Star,
  Palmtree,
  Moon,
  Sun,
} from 'lucide-react-native';
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

  return (
    <View className="flex-1 bg-safakDark">
      <ScrollView className="flex-1 bg-safakDark" contentContainerStyle={{ paddingBottom: 170 }}>
        <View className="p-6">
          {/* Başlık */}
          <View className="mb-10 mt-12 flex-row items-center">
            <UserCog size={32} color="#10b981" />
            <Text className="ml-3 text-3xl font-bold text-white">Ayarlar</Text>
          </View>

          {/* Hesap & Veri */}
          <Text className="mb-4 px-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Hesap & Veri
          </Text>

          <View className="mb-8 overflow-hidden rounded-2xl border border-gray-700 bg-safakSecondary">
            <TouchableOpacity
              className="flex-row items-center justify-between border-b border-gray-700 p-5"
              onPress={() => navigation.navigate('Setup')}
              accessibilityLabel="Askerlik bilgilerini güncelle"
              accessibilityRole="button"
            >
              <View className="flex-row items-center">
                <CalendarDays size={24} color="#3b82f6" />
                <Text className="ml-4 text-lg font-medium text-white">Bilgileri Güncelle</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-between p-5"
              onPress={handleReset}
              accessibilityLabel="Tüm verileri sıfırla"
              accessibilityRole="button"
            >
              <View className="flex-row items-center">
                <Trash2 size={24} color="#ef4444" />
                <Text className="ml-4 text-lg font-medium text-red-400">Tüm Verileri Sıfırla</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Uygulama */}
          <Text className="mb-4 px-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Uygulama
          </Text>

          <View className="overflow-hidden rounded-2xl border border-gray-700 bg-safakSecondary">
            {/* Premium / Reklam kaldır */}
            <TouchableOpacity
              className="flex-row items-center justify-between border-b border-gray-700 p-5"
              onPress={handleRemoveAdsPress}
              accessibilityLabel={isPremium ? 'Premium aktif' : 'Reklamları kaldır'}
              accessibilityRole="button"
            >
              <View className="flex-row items-center">
                <Star size={24} color={isPremium ? '#10b981' : '#f59e0b'} />
                <View className="ml-4">
                  <Text className="text-lg font-medium text-white">
                    {isPremium ? 'Premium Aktif' : 'Reklamları Kaldır'}
                  </Text>
                  <Text className="mt-0.5 text-xs text-gray-400">
                    {isPremium ? 'Reklamsız kullanım açık ✅' : 'Tek seferlik satın alma'}
                  </Text>
                </View>
              </View>
              <Text
                className={`text-sm font-bold ${isPremium ? 'text-emerald-400' : 'text-gray-400'}`}
              >
                {isPremium ? '✅' : '>'}
              </Text>
            </TouchableOpacity>

            {/* Gizlilik Politikası */}
            <TouchableOpacity
              className="flex-row items-center justify-between p-5"
              onPress={handleOpenPrivacyPolicy}
              accessibilityLabel="Gizlilik politikasını aç"
              accessibilityRole="link"
            >
              <View className="flex-row items-center">
                <ShieldCheck size={24} color="#10b981" />
                <Text className="ml-4 text-lg font-medium text-white">Gizlilik Politikası</Text>
              </View>
              <ExternalLink size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Versiyon */}
          <View className="mb-10 mt-12 items-center">
            <Text className="text-sm italic text-gray-600">Şafak Sayar v1.0.0</Text>
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
