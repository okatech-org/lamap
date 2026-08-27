export const AVATAR_ASSETS = {
  la_stratege: require("@assets/images/avatars/la_stratege.png"),
  le_bandi: require("@assets/images/avatars/le_bandi.png"),
  la_gardienne: require("@assets/images/avatars/la_gardienne.png"),
  le_tacticien: require("@assets/images/avatars/le_tacticien.png"),
  maitresse_cartes: require("@assets/images/avatars/maitresse_cartes.png"),
  la_legende: require("@assets/images/avatars/la_legende.png"),
} as const;

export type PortraitAvatarId = keyof typeof AVATAR_ASSETS;
