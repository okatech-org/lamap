import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";
import { useAction } from "convex/react";
import { api } from "@lamap/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import type { KoraPackId } from "@/config/kora-packs";

// react-native-iap is loaded lazily so the JS bundle still works in Expo Go
// where the native module isn't linked. The actual binding is resolved by
// the dev-client / EAS build that includes the native module.
type RnIap = typeof import("react-native-iap");
let rnIap: RnIap | null = null;

function loadRnIap(): RnIap | null {
  if (rnIap) return rnIap;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    rnIap = require("react-native-iap") as RnIap;
    return rnIap;
  } catch {
    return null;
  }
}

export function useIap() {
  const { convexUser } = useAuth();
  const validatePurchase = useAction(api.iap.validateIosPurchase);
  const [purchasing, setPurchasing] = useState<KoraPackId | null>(null);

  const buy = useCallback(
    async (sku: KoraPackId) => {
      if (Platform.OS !== "ios") {
        Alert.alert(
          "Bientôt disponible",
          "Les achats Kora ne sont pour l'instant disponibles que sur iOS.",
        );
        return;
      }
      const iap = loadRnIap();
      if (!iap) {
        Alert.alert(
          "Achat indisponible",
          "Le module d'achat n'est pas chargé. Réessayez après mise à jour de l'app.",
        );
        return;
      }
      if (!convexUser?._id) {
        Alert.alert("Erreur", "Vous devez être connecté pour acheter du Kora.");
        return;
      }

      setPurchasing(sku);
      try {
        await iap.initConnection();
        const result = await iap.requestPurchase({
          type: "in-app",
          request: {
            ios: {
              sku,
              andDangerouslyFinishTransactionAutomatically: false,
            },
          },
        });
        const purchase = Array.isArray(result) ? result[0] : result;
        if (!purchase) throw new Error("Achat non finalisé");

        // Backend uses Apple's legacy /verifyReceipt endpoint, which expects the
        // base64 App Store receipt — not StoreKit 2's JWS. getReceiptIOS returns
        // the legacy receipt for the device.
        const receipt = await iap.getReceiptIOS();
        if (!receipt) throw new Error("Reçu Apple introuvable");

        const validation = await validatePurchase({
          userId: convexUser._id,
          receipt,
          productId: sku,
        });

        await iap.finishTransaction({
          purchase,
          isConsumable: true,
        });

        Alert.alert(
          "Achat confirmé",
          `+${validation.koraCredited.toLocaleString("fr-FR")} Kora ajoutés à votre solde.`,
        );
      } catch (err: unknown) {
        const code = (err as { code?: string } | null)?.code;
        if (code === "user-cancelled" || code === "E_USER_CANCELLED") return;
        console.error("IAP purchase failed:", err);
        const message =
          err instanceof Error ? err.message : "Une erreur est survenue. Réessayez.";
        Alert.alert("Achat échoué", message);
      } finally {
        setPurchasing(null);
      }
    },
    [convexUser?._id, validatePurchase],
  );

  const restore = useCallback(async () => {
    if (Platform.OS !== "ios") return;
    const iap = loadRnIap();
    if (!iap || !convexUser?._id) return;
    try {
      await iap.initConnection();
      const purchases = await iap.getAvailablePurchases();
      // The legacy receipt covers all of the user's non-finished transactions
      // for this app on this device, so we validate it once per matching SKU.
      const receipt = await iap.getReceiptIOS();
      if (!receipt) {
        Alert.alert("Achats restaurés", "Aucun achat à restaurer.");
        return;
      }
      let restored = 0;
      for (const purchase of purchases) {
        const productId = purchase?.productId;
        if (!productId) continue;
        try {
          await validatePurchase({
            userId: convexUser._id,
            receipt,
            productId,
          });
          restored += 1;
        } catch {
          // ignore individual failures, continue with the rest
        }
      }
      Alert.alert(
        "Achats restaurés",
        restored > 0
          ? `${restored} achat(s) re-validé(s).`
          : "Aucun achat à restaurer.",
      );
    } catch (err: unknown) {
      console.error("IAP restore failed:", err);
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue.";
      Alert.alert("Restauration échouée", message);
    }
  }, [convexUser?._id, validatePurchase]);

  return { buy, restore, purchasing };
}
