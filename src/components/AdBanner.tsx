import React, { useMemo } from 'react'
import { Platform, View } from 'react-native'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'
import { useStore } from '../store/useStore'

const ANDROID_BANNER_ID = 'ca-app-pub-7780845735147349/9794905283'
const IOS_BANNER_ID = 'ca-app-pub-7780845735147349/8837046833'

export default function AdBanner() {
    const isPremium = useStore((s: any) => s.isPremium)

    const unitId = useMemo(() => {
        if (__DEV__) return TestIds.BANNER

        return Platform.select({
            ios: IOS_BANNER_ID,
            android: ANDROID_BANNER_ID
        }) || TestIds.BANNER
    }, [])

    if (isPremium) return null

    return (
        <View style={{ alignItems: 'center' }}>
            <BannerAd
                unitId={unitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            />
        </View>
    )
}