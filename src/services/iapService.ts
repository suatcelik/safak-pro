import * as RNIap from "react-native-iap";
import { Platform } from "react-native";
import { useStore } from "../store/useStore";
import { setPremiumLocal } from "../utils/storage";

export const PRODUCT_ID = "safak_pro_premium";

let purchaseUpdateSub: any = null;
let purchaseErrorSub: any = null;
let iapInited = false;

const processedTokens = new Set<string>();
let busy = false;

function getToken(p: any) {
    return (
        p?.purchaseToken ||
        p?.transactionId ||
        p?.originalTransactionIdentifierIOS ||
        ""
    );
}

export async function initIAP() {
    if (iapInited) return true;

    try {
        const ok = await RNIap.initConnection();

        // ✅ Android flush (types yoksa bile patlamaz)
        if (Platform.OS === "android") {
            try {
                const fn = (RNIap as any).flushFailedPurchasesCachedAsPendingAndroid;
                if (typeof fn === "function") {
                    await fn();
                }
            } catch (e: any) {
                console.log("[IAP] Android flush error (ignored):", e?.message || e);
            }
        }

        purchaseUpdateSub?.remove?.();
        purchaseErrorSub?.remove?.();

        purchaseUpdateSub = RNIap.purchaseUpdatedListener(async (purchase: any) => {
            try {
                if (!purchase) return;

                const token = getToken(purchase);
                if (token && processedTokens.has(token)) return;
                if (token) processedTokens.add(token);

                if (purchase.productId === PRODUCT_ID) {
                    useStore.getState().setIsPremium(true);
                    await setPremiumLocal(true);
                }

                await RNIap.finishTransaction({ purchase, isConsumable: false });
            } catch (e: any) {
                console.log("[IAP] purchase update error:", e?.message || e);
            }
        });

        purchaseErrorSub = RNIap.purchaseErrorListener((err: any) => {
            console.log("[IAP] purchase error:", err?.message || err);
        });

        iapInited = true;
        return ok;
    } catch (e: any) {
        console.log("[IAP] initIAP failed:", e?.message || e);
        iapInited = false;
        throw new Error("Market bağlantısı kurulamadı.");
    }
}

export async function buyPremium() {
    if (busy) return false;
    busy = true;

    try {
        if (!iapInited) await initIAP();

        await RNIap.requestPurchase({
            request: {
                apple: { sku: PRODUCT_ID },
                google: { skus: [PRODUCT_ID] },
            },
            type: "in-app",
        });

        return true;
    } catch (e: any) {
        const msg = (e?.message || "").toLowerCase();
        if (e?.code === "E_USER_CANCELLED" || msg.includes("cancel")) return false;
        throw new Error(e?.message || "Satın alma başlatılamadı.");
    } finally {
        busy = false;
    }
}

export async function restorePurchases() {
    try {
        if (!iapInited) await initIAP();

        const purchases = await RNIap.getAvailablePurchases();

        const hasPremium = (purchases || []).some(
            (p: any) => p.productId === PRODUCT_ID
        );

        if (hasPremium) {
            useStore.getState().setIsPremium(true);
            await setPremiumLocal(true);
        }

        return hasPremium;
    } catch (e: any) {
        console.log("[IAP] restorePurchases failed:", e?.message || e);
        throw new Error("Geri yükleme başarısız.");
    }
}

export async function endIAP() {
    purchaseUpdateSub?.remove?.();
    purchaseErrorSub?.remove?.();
    processedTokens.clear();

    try {
        await RNIap.endConnection();
    } catch (e: any) {
        console.log("[IAP] endConnection error (ignored):", e?.message || e);
    }

    iapInited = false;
}