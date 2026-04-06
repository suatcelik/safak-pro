import { Platform, Alert } from 'react-native'
import mobileAds, {
    RewardedAd,
    RewardedAdEventType,
    AdEventType,
    TestIds
} from 'react-native-google-mobile-ads'

const ANDROID_REWARDED_ID = 'ca-app-pub-7780845735147349/3198871068'
const IOS_REWARDED_ID = 'ca-app-pub-7780845735147349/2080066793'

const REWARDED_ID =
    __DEV__
        ? TestIds.REWARDED
        : Platform.select({
            ios: IOS_REWARDED_ID,
            android: ANDROID_REWARDED_ID
        }) as string

// Reklam yüklemesi 30 saniye içinde tamamlanmazsa busy flag sıfırlanır
const BUSY_TIMEOUT_MS = 30_000

let busy = false
let busyTimeout: ReturnType<typeof setTimeout> | null = null

export async function initAds() {
    await mobileAds().initialize()
}

export async function showRewardedGate(): Promise<boolean> {

    if (busy) return false
    busy = true

    // H-5: Takılma koruması — 30 saniye sonra busy'yi zorla sıfırla
    busyTimeout = setTimeout(() => {
        console.log('[Ads] Rewarded gate busy timeout — sıfırlanıyor')
        busy = false
        busyTimeout = null
    }, BUSY_TIMEOUT_MS)

    // ✅ FIX: Her seferinde yeni bir RewardedAd instance oluştur
    // Eski instance tekrar load() edildiğinde Android'de çalışmayabiliyor
    const ad = RewardedAd.createForAdRequest(REWARDED_ID, {
        requestNonPersonalizedAdsOnly: true
    })

    return new Promise((resolve) => {

        let earned = false
        let resolved = false

        function safeResolve(value: boolean) {
            if (resolved) return
            resolved = true
            cleanup()
            resolve(value)
        }

        // ✅ FIX: RewardedAd v16+ requires RewardedAdEventType.LOADED
        const subLoaded = ad.addAdEventListener(
            RewardedAdEventType.LOADED,
            () => {
                try {
                    ad.show()
                } catch (e: any) {
                    console.log('[Ads] ad.show() error:', e?.message || e)
                    safeResolve(false)
                }
            }
        )

        const subEarned = ad.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            () => {
                earned = true
            }
        )

        const subClosed = ad.addAdEventListener(
            AdEventType.CLOSED,
            () => {
                safeResolve(earned)
            }
        )

        const subError = ad.addAdEventListener(
            AdEventType.ERROR,
            (error: any) => {
                console.log('[Ads] Rewarded ad error:', error?.message || error)
                cleanup()
                Alert.alert(
                    "Reklam yüklenemedi",
                    "Yine de takvime girmek ister misin?",
                    [
                        { text: "Vazgeç", style: "cancel", onPress: () => { resolved = true; resolve(false) } },
                        { text: "Devam Et", onPress: () => { resolved = true; resolve(true) } }
                    ]
                )
            }
        )

        function cleanup() {
            if (busyTimeout) {
                clearTimeout(busyTimeout)
                busyTimeout = null
            }
            try { subLoaded() } catch { }
            try { subEarned() } catch { }
            try { subClosed() } catch { }
            try { subError() } catch { }
            busy = false
        }

        ad.load()
    })
}