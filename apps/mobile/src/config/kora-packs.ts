export type KoraPackId =
  | "kora_pack_small"
  | "kora_pack_medium"
  | "kora_pack_large"
  | "kora_pack_xlarge";

export interface KoraPack {
  id: KoraPackId;
  amount: number;
  priceLabel: string;
  badge?: "popular" | "best-value";
}

export const KORA_PACKS: KoraPack[] = [
  { id: "kora_pack_small", amount: 500, priceLabel: "0,99 €" },
  { id: "kora_pack_medium", amount: 1500, priceLabel: "2,99 €", badge: "popular" },
  { id: "kora_pack_large", amount: 5000, priceLabel: "9,99 €" },
  { id: "kora_pack_xlarge", amount: 15000, priceLabel: "24,99 €", badge: "best-value" },
];

export const KORA_SKUS = KORA_PACKS.map((p) => p.id);
