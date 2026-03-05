import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Crown, X, CheckCircle2, ShieldCheck } from 'lucide-react-native';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../store/useStore';

export default function PremiumScreen() {
    const navigation = useNavigation();
    const setIsPremium = useStore((state) => state.setIsPremium);

    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [isPurchasing, setIsPurchasing] = useState(false);

    useEffect(() => {
        const fetchOfferings = async () => {
            try {
                const offerings = await Purchases.getOfferings();
                if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                    setPackages(offerings.current.availablePackages);
                }
            } catch (e: any) {
                console.warn("Offerings fetch error:", e);
                Alert.alert("Hata", "Paketler yüklenirken bir sorun oluştu.");
            } finally {
                setIsFetching(false);
            }
        };

        fetchOfferings();
    }, []);

    const handlePurchase = async (pkg: PurchasesPackage) => {
        setIsPurchasing(true);
        try {
            const { customerInfo } = await Purchases.purchasePackage(pkg);
            // RevenueCat paneli üzerinden oluşturduğunuz Entitlement ID'si "premium" olmalıdır.
            if (typeof customerInfo.entitlements.active["premium"] !== "undefined") {
                setIsPremium(true);
                Alert.alert("Tebrikler!", "Premium sürüme geçtiniz. Reklamlar kaldırıldı.", [
                    { text: "Tamam", onPress: () => navigation.goBack() }
                ]);
            }
        } catch (e: any) {
            if (!e.userCancelled) {
                Alert.alert("Satın Alma Hatası", e.message);
            }
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleRestore = async () => {
        setIsPurchasing(true);
        try {
            const customerInfo = await Purchases.restorePurchases();
            if (typeof customerInfo.entitlements.active["premium"] !== "undefined") {
                setIsPremium(true);
                Alert.alert("Başarılı", "Satın alımlarınız başarıyla geri yüklendi.", [
                    { text: "Tamam", onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert("Bilgi", "Mevcut bir satın alımınız bulunamadı.");
            }
        } catch (e: any) {
            Alert.alert("Hata", "Geri yükleme işlemi başarısız oldu.");
        } finally {
            setIsPurchasing(false);
        }
    };

    return (
        <View className="flex-1 bg-safakDark p-6 pt-16">
            {/* Kapat Butonu */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute top-12 right-6 z-10 p-2 bg-safakSecondary rounded-full border border-gray-700"
            >
                <X size={24} color="#94a3b8" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View className="bg-amber-500/20 p-6 rounded-full mb-6 border border-amber-500/30">
                    <Crown size={64} color="#f59e0b" />
                </View>

                <Text className="text-white text-3xl font-black mb-2 text-center">Şafak Pro</Text>
                <Text className="text-gray-400 text-center text-base mb-10">
                    Uygulamayı reklamsız ve kesintisiz kullanın. Bir kez alın, ömür boyu sizin olsun.
                </Text>

                <View className="w-full bg-safakSecondary p-6 rounded-3xl border border-gray-700 mb-8">
                    <View className="flex-row items-center mb-4">
                        <CheckCircle2 size={20} color="#10b981" className="mr-3" />
                        <Text className="text-white text-base">Banner Reklamları Kaldır</Text>
                    </View>
                    <View className="flex-row items-center mb-4">
                        <CheckCircle2 size={20} color="#10b981" className="mr-3" />
                        <Text className="text-white text-base">Takvim Geçiş Reklamlarını Kaldır</Text>
                    </View>
                    <View className="flex-row items-center">
                        <CheckCircle2 size={20} color="#10b981" className="mr-3" />
                        <Text className="text-white text-base">Ömür Boyu Erişim</Text>
                    </View>
                </View>

                {isFetching ? (
                    <ActivityIndicator size="large" color="#f59e0b" />
                ) : packages.length > 0 ? (
                    packages.map((pkg) => (
                        <TouchableOpacity
                            key={pkg.identifier}
                            onPress={() => handlePurchase(pkg)}
                            disabled={isPurchasing}
                            className={`w-full bg-amber-500 p-4 rounded-2xl items-center flex-row justify-between mb-4 ${isPurchasing ? 'opacity-50' : ''}`}
                        >
                            <Text className="text-white font-bold text-lg">Premium Al</Text>
                            <Text className="text-white font-black text-xl">{pkg.product.priceString}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text className="text-gray-400 text-center">Şu an satın alınabilir paket bulunmuyor.</Text>
                )}

                <TouchableOpacity onPress={handleRestore} disabled={isPurchasing} className="mt-6 flex-row items-center">
                    <ShieldCheck size={18} color="#94a3b8" className="mr-2" />
                    <Text className="text-gray-400 font-medium underline">Satın Alımları Geri Yükle (Restore)</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}