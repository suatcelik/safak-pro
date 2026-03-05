import React from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useStore } from '../store/useStore';

// Canlıya çıkarken buraya kendi AdMob Banner Reklam ID'nizi gireceksiniz.
const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx';

export default function CustomBannerAd() {
    const isPremium = useStore((state) => state.isPremium);

    // Eğer kullanıcı premium ise reklam alanını hiç render etme (Boş döner)
    if (isPremium) return null;

    return (
        <View className="items-center justify-center py-2 bg-safakDark w-full border-t border-gray-800">
            <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
            />
        </View>
    );
}