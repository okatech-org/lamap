import { createContext, useContext } from "react";
import type { Product } from "react-native-iap";

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

export type IapContextValue = {
  products: Product[];
  purchasing: string | null;
  ready: boolean;
  buy: (productId: string) => Promise<void>;
  restore: () => Promise<void>;
};

export const IapContext = createContext<IapContextValue | null>(null);

export function useIap() {
  const value = useContext(IapContext);
  if (!value) throw new Error("IapProvider manquant");
  return value;
}
