import React, { useMemo, useState } from 'react'
import { Platform, View } from 'react-native'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'
import { useStore } from '../store/useStore'

const ANDROID_BANNER_ID = 'ca-app-pub-7780845735147349/9794905283'
const IOS_BANNER_ID = 'ca-app-pub-7780845735147349/8837046833'

export default function AdBanner() {
    const isPremium = useStore((s: any) => s.isPremium)

    // R-1: Reklam yüklenme/hata state yönetimi
    const [adLoaded, setAdLoaded] = useState(false)
    const [adFailed, setAdFailed] = useState(false)

    const unitId = useMemo(() => {
        if (__DEV__) return TestIds.BANNER

        return Platform.select({
            ios: IOS_BANNER_ID,
            android: ANDROID_BANNER_ID
        }) || TestIds.BANNER
    }, [])

    // Premium kullanıcı veya reklam yüklenemezse bileşen gösterilmez
    if (isPremium || adFailed) return null

    return (
        // Reklam yüklenene kadar yükseklik sıfır (layout kayması engellenir)
        <View style={{ alignItems: 'center', minHeight: adLoaded ? undefined : 0 }}>
            <BannerAd
                unitId={unitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                onAdLoaded={() => {
                    setAdLoaded(true)
                }}
                onAdFailedToLoad={(error) => {
                    console.log('[AdBanner] Yüklenemedi:', error?.message || error)
                    setAdFailed(true)
                }}
            />
        </View>
    )
}
