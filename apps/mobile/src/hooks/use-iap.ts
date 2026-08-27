import { api } from "@lamap/convex/_generated/api";
import { useAction } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import type { Product, Purchase } from "react-native-iap";

export const PRODUCT_IDS = [
  "com.okatech.lamap.cosmetic.cardback.bleu_royal",
  "com.okatech.lamap.cosmetic.cardback.or_sable",
  "com.okatech.lamap.cosmetic.cardback.ombre_tribale",
  "com.okatech.lamap.cosmetic.avatar.la_stratege",
  "com.okatech.lamap.cosmetic.avatar.le_bandi",
  "com.okatech.lamap.cosmetic.avatar.la_gardienne",
  "com.okatech.lamap.cosmetic.avatar.le_tacticien",
  "com.okatech.lamap.cosmetic.avatar.maitresse_cartes",
  "com.okatech.lamap.cosmetic.avatar.la_legende",
] as const;

type IapModule = typeof import("react-native-iap");
let cachedModule: IapModule | null = null;
function iapModule() {
  if (cachedModule) return cachedModule;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cachedModule = require("react-native-iap") as IapModule;
  } catch {
    cachedModule = null;
  }
  return cachedModule;
}

export function useIap() {
  const validate = useAction(api.iap.validateIosPurchase);
  const [products, setProducts] = useState<Product[]>([]);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const validateAndFinish = useCallback(
    async (purchase: Purchase) => {
      const iap = iapModule();
      if (!iap) throw new Error("StoreKit indisponible");
      const signedTransaction =
        purchase.purchaseToken ??
        (await iap.getTransactionJwsIOS(purchase.productId));
      if (!signedTransaction) throw new Error("Transaction Apple non signée");
      await validate({ signedTransaction });
      await iap.finishTransaction({ purchase, isConsumable: false });
    },
    [validate],
  );

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    const iap = iapModule();
    if (!iap) return;
    let active = true;
    let purchaseSubscription: { remove(): void } | undefined;
    let errorSubscription: { remove(): void } | undefined;
    void iap
      .initConnection()
      .then(async () => {
        if (!active) return;
        const fetched = await iap.fetchProducts({
          skus: [...PRODUCT_IDS],
          type: "in-app",
        });
        if (active) {
          setProducts((fetched ?? []) as Product[]);
          setReady(true);
        }
        purchaseSubscription = iap.purchaseUpdatedListener((purchase) => {
          void validateAndFinish(purchase)
            .then(() =>
              Alert.alert(
                "Achat confirmé",
                "Le cosmétique est maintenant disponible.",
              ),
            )
            .catch((error) =>
              Alert.alert(
                "Validation impossible",
                error instanceof Error ? error.message : "Réessayez.",
              ),
            )
            .finally(() => setPurchasing(null));
        });
        errorSubscription = iap.purchaseErrorListener((error) => {
          setPurchasing(null);
          if (error.code !== "user-cancelled")
            Alert.alert("Achat impossible", error.message);
        });
      })
      .catch(() => setReady(false));
    return () => {
      active = false;
      purchaseSubscription?.remove();
      errorSubscription?.remove();
      void iap.endConnection();
    };
  }, [validateAndFinish]);

  const buy = useCallback(
    async (productId: string) => {
      if (Platform.OS !== "ios") return;
      const iap = iapModule();
      if (!iap || !ready) {
        Alert.alert("Achat indisponible", "La boutique Apple n’est pas prête.");
        return;
      }
      setPurchasing(productId);
      try {
        await iap.requestPurchase({
          type: "in-app",
          request: {
            apple: {
              sku: productId,
              andDangerouslyFinishTransactionAutomatically: false,
            },
          },
        });
      } catch (error) {
        setPurchasing(null);
        const code = (error as { code?: string }).code;
        if (code !== "user-cancelled") {
          Alert.alert(
            "Achat impossible",
            error instanceof Error ? error.message : "Réessayez.",
          );
        }
      }
    },
    [ready],
  );

  const restore = useCallback(async () => {
    const iap = iapModule();
    if (Platform.OS !== "ios" || !iap) return;
    try {
      const purchases = await iap.getAvailablePurchases({
        onlyIncludeActiveItemsIOS: true,
      });
      let restored = 0;
      for (const purchase of purchases) {
        if (
          !PRODUCT_IDS.includes(
            purchase.productId as (typeof PRODUCT_IDS)[number],
          )
        )
          continue;
        await validateAndFinish(purchase);
        restored += 1;
      }
      Alert.alert(
        "Restauration terminée",
        restored
          ? `${restored} achat(s) restauré(s).`
          : "Aucun achat à restaurer.",
      );
    } catch (error) {
      Alert.alert(
        "Restauration impossible",
        error instanceof Error ? error.message : "Réessayez.",
      );
    }
  }, [validateAndFinish]);

  return { products, purchasing, ready, buy, restore };
}
