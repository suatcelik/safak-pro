import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';
import { setPremiumLocal } from '../utils/storage';

export const REMOVE_ADS_SKUS =
    Platform.select({
        ios: ['safak_pro_premium'],
        android: ['safak_pro_premium'],
    }) || [];

let inited = false;

export async function initIap() {
    if (inited) return;

    await RNIap.initConnection();

    if (Platform.OS === 'android') {
        try {
            await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
        } catch { }
    }

    inited = true;
}

export async function buyRemoveAds(setIsPremium: (v: boolean) => void) {
    await initIap();

    const sku = REMOVE_ADS_SKUS[0];
    if (!sku) throw new Error('Premium SKU tanımlı değil.');

    try {
        await RNIap.getProducts({ skus: REMOVE_ADS_SKUS });
    } catch { }

    const purchase = await RNIap.requestPurchase({ sku });

    if (purchase) {
        try {
            await RNIap.finishTransaction({ purchase, isConsumable: false });
        } catch { }

        setIsPremium(true);
        await setPremiumLocal(true);
    }
}

export async function restoreRemoveAds(setIsPremium: (v: boolean) => void) {
    await initIap();

    const purchases = await RNIap.getAvailablePurchases();
    const hasPremium = purchases.some((p) => REMOVE_ADS_SKUS.includes(p.productId));

    if (hasPremium) {
        setIsPremium(true);
        await setPremiumLocal(true);
        return true;
    }

    return false;
}

export async function endIap() {
    try {
        await RNIap.endConnection();
    } catch { }
    inited = false;
}