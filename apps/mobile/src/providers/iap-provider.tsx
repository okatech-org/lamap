import { IapContext, PRODUCT_IDS, type IapContextValue } from "@/hooks/use-iap";
import { api } from "@lamap/convex/_generated/api";
import { useAction } from "convex/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Alert, Platform } from "react-native";
import type { Product, Purchase } from "react-native-iap";

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

export function IapProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  const validate = useAction(api.iap.validateIosPurchase);
  const [products, setProducts] = useState<Product[]>([]);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const processing = useRef(new Set<string>());

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

  const processPurchase = useCallback(
    async (purchase: Purchase) => {
      const key = purchase.id ?? purchase.purchaseToken ?? purchase.productId;
      if (processing.current.has(key)) return false;
      processing.current.add(key);
      try {
        await validateAndFinish(purchase);
        return true;
      } finally {
        processing.current.delete(key);
      }
    },
    [validateAndFinish],
  );

  useEffect(() => {
    if (!enabled || Platform.OS !== "ios") {
      setReady(false);
      setProducts([]);
      return;
    }
    const iap = iapModule();
    if (!iap) return;

    let active = true;
    const processingTransactions = processing.current;
    const purchaseSubscription = iap.purchaseUpdatedListener((purchase) => {
      void processPurchase(purchase)
        .then((processed) => {
          if (processed) {
            Alert.alert(
              "Achat confirmé",
              "Le cosmétique est maintenant disponible.",
            );
          }
        })
        .catch((error) =>
          Alert.alert(
            "Validation impossible",
            error instanceof Error ? error.message : "Réessayez.",
          ),
        )
        .finally(() => setPurchasing(null));
    });
    const errorSubscription = iap.purchaseErrorListener((error) => {
      setPurchasing(null);
      if (error.code !== "user-cancelled") {
        Alert.alert("Achat impossible", error.message);
      }
    });

    void iap
      .initConnection()
      .then(async () => {
        if (!active) return;
        const fetched = await iap.fetchProducts({
          skus: [...PRODUCT_IDS],
          type: "in-app",
        });
        if (!active) return;
        setProducts((fetched ?? []) as Product[]);
        setReady(true);
      })
      .catch(() => {
        if (active) setReady(false);
      });

    return () => {
      active = false;
      purchaseSubscription.remove();
      errorSubscription.remove();
      processingTransactions.clear();
      setReady(false);
      void iap.endConnection();
    };
  }, [enabled, processPurchase]);

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
    if (Platform.OS !== "ios" || !iap || !ready) {
      Alert.alert(
        "Restauration indisponible",
        "La boutique Apple n’est pas prête.",
      );
      return;
    }
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
        ) {
          continue;
        }
        if (await processPurchase(purchase)) restored += 1;
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
  }, [processPurchase, ready]);

  const value = useMemo<IapContextValue>(
    () => ({ products, purchasing, ready, buy, restore }),
    [buy, products, purchasing, ready, restore],
  );

  return <IapContext.Provider value={value}>{children}</IapContext.Provider>;
}
