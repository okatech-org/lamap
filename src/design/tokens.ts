/**
 * LaMap design tokens — Phase 1 Refonte foundation.
 *
 * Mirrors `tokens.css` from the Claude Design handoff bundle 1:1.
 * Lives in parallel with `src/constants/DesignTokens.ts` (legacy) so existing
 * screens stay visually identical until each is migrated.
 */
import type { TextStyle, ViewStyle } from "react-native";

export const COLORS = {
  // Brand — terre (red earth)
  terre: "#B4443E",
  terre2: "#D4635D",
  terreDeep: "#8E2F2A",

  // Brand — or (gold)
  or: "#A68258",
  or2: "#C9A876",
  orDeep: "#6E5536",

  // Brand — nuit (night blue)
  nuit: "#465D74",
  nuit2: "#5A7A96",
  nuitDeep: "#2E3D4D",
  nuitInk: "#1B2733",

  // Neutrals
  cream: "#F5F2ED",
  cream2: "#ECE6DA",
  ink: "#141A22",
  ink2: "#1A1A1A",

  // Surfaces
  bg: "#0F1620",
  bg2: "#182230",
  surface: "#1E2A3A",
  surface2: "#243245",

  // Hairlines (gold tinted)
  hairline: "rgba(166, 130, 88, 0.18)",
  hairlineStrong: "rgba(166, 130, 88, 0.42)",

  // Suit colors on card faces
  suitRed: "#B4443E",
  suitBlack: "#1A1A1A",
} as const;

export const FONT = {
  display: "BricolageGrotesque",
  body: "Inter",
  mono: "JetBrainsMono",
  card: "CrimsonPro",
} as const;

export const FONT_WEIGHTS = {
  display: {
    regular: "BricolageGrotesque_400Regular",
    semibold: "BricolageGrotesque_600SemiBold",
    bold: "BricolageGrotesque_700Bold",
    extrabold: "BricolageGrotesque_800ExtraBold",
  },
  body: {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
  },
  mono: {
    regular: "JetBrainsMono_400Regular",
    medium: "JetBrainsMono_500Medium",
    semibold: "JetBrainsMono_600SemiBold",
    bold: "JetBrainsMono_700Bold",
  },
  card: {
    medium: "CrimsonPro_500Medium",
    semibold: "CrimsonPro_600SemiBold",
    bold: "CrimsonPro_700Bold",
  },
} as const;

export const RADII = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 9999,
} as const;

// React Native shadows — closest equivalents of the design's CSS box-shadows.
export const SHADOWS: Record<
  "card" | "cardLift" | "glowOr" | "glowTerre",
  ViewStyle
> = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  cardLift: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 14,
  },
  glowOr: {
    shadowColor: "#C9A876",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 12,
  },
  glowTerre: {
    shadowColor: "#D4635D",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
};

export const ANIM = {
  fast: 150,
  normal: 300,
  slow: 500,
  flip: 600,
  // cubic-bezier control points for reanimated `Easing.bezier(...)`
  easeOutExpo: [0.16, 1, 0.3, 1] as const,
  easeInOutSmooth: [0.4, 0, 0.2, 1] as const,
  easeSpring: [0.34, 1.56, 0.64, 1] as const,
} as const;

// Elo tier ladder, ordered from low to high.
export type RankTier = {
  name: string;
  short: string;
  color: string;
  glow: string;
};

export const RANKS: readonly RankTier[] = [
  { name: "Apprenti",    short: "A", color: "#8B95A3", glow: "rgba(139,149,163,0.5)" },
  { name: "Initié",      short: "I", color: "#C9A876", glow: "rgba(201,168,118,0.6)" },
  { name: "Tacticien",   short: "T", color: "#5AA3C9", glow: "rgba(90,163,201,0.6)" },
  { name: "Maître",      short: "M", color: "#C95048", glow: "rgba(201,80,72,0.65)" },
  { name: "Grand Bandi", short: "G", color: "#E8C879", glow: "rgba(232,200,121,0.7)" },
  { name: "Légende",     short: "L", color: "#9D5BD2", glow: "rgba(157,91,210,0.7)" },
] as const;

// Common reusable text recipes (consumed by callers as `style={textStyles.displayLg}`).
export const textStyles = {
  displayXl: {
    fontFamily: FONT_WEIGHTS.display.extrabold,
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -0.6,
    color: COLORS.cream,
  } satisfies TextStyle,
  displayLg: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.4,
    color: COLORS.cream,
  } satisfies TextStyle,
  displayMd: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: COLORS.cream,
  } satisfies TextStyle,
  body: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.cream,
  } satisfies TextStyle,
  bodySm: {
    fontFamily: FONT_WEIGHTS.body.medium,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.cream,
  } satisfies TextStyle,
  mono: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.5,
    color: COLORS.or2,
  } satisfies TextStyle,
} as const;

export const DESIGN = {
  colors: COLORS,
  font: FONT,
  fontWeights: FONT_WEIGHTS,
  radii: RADII,
  shadows: SHADOWS,
  anim: ANIM,
  ranks: RANKS,
  textStyles,
} as const;

export type DesignTokens = typeof DESIGN;
