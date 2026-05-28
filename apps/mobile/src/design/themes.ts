/**
 * LaMap Arcade — runtime theme model.
 *
 * Ports the four `[data-theme]` palettes from the Claude Design handoff
 * (`docs/lamap-design/project/arcade/tokens.css`) into TypeScript so the app
 * can switch palettes at runtime (the CSS used `var()` + `data-theme`, which
 * has no React Native equivalent).
 *
 * Each theme is declared as a compact `ThemeSpec` (named hexes + a few base RGB
 * triples + gradient stops). `buildTheme()` expands that into a `Theme` object
 * with alpha-step helpers (`goldA`, `accentA`, …) so screens don't hard-code
 * `rgba()` strings the way the prototype did.
 */

export type ThemeId = "esmeralda" | "ember-royal" | "onyx" | "amethyste";

type RGB = readonly [number, number, number];

const rgba = (rgb: RGB, a: number) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;

/** Compact per-theme declaration — everything else is derived in buildTheme(). */
interface ThemeSpec {
  // Surfaces (solid)
  abyss: string;
  night: string;
  night2: string;
  night3: string;
  velvet: string;

  // Accent family (the "jade" slot — emerald / red / champagne / purple)
  accent: string;
  accentBright: string;
  accentGlow: string;
  accentDeep: string;
  accentText: string;
  accentBase: RGB;

  // Premium metal (gold / champagne / rose gold)
  gold: string;
  goldBright: string;
  goldDeep: string;
  goldBase: RGB;

  // Ember (alerts, defeat) — constant base across themes
  ember: string;
  emberBright: string;
  emberDeep: string;

  // Neutrals
  cream: string;
  creamBase: RGB;

  // Translucent surfaces
  surfaceBase: RGB;

  // Backgrounds
  bgAppStops: [string, string, string];
  bgAppGlowTop: string;
  bgAppGlowBottom: string;
  bgTableStops: [string, string, string];
  bgTableGlow: string;
  bgVelvetStops: [string, string];
}

// Ember base RGB is shared by every theme (the prototype only set it in :root).
const EMBER_BASE: RGB = [212, 80, 72];
const BONE = "#C9BDA6";
const ASH = "#8A8170";

const SPECS: Record<ThemeId, ThemeSpec> = {
  esmeralda: {
    abyss: "#060E0C",
    night: "#0A1814",
    night2: "#0E2620",
    night3: "#14342B",
    velvet: "#051A14",
    accent: "#1B4A3A",
    accentBright: "#2C7A5C",
    accentGlow: "#3FA877",
    accentDeep: "#0C2A20",
    accentText: "#6FD4A8",
    accentBase: [63, 168, 119],
    gold: "#E8C879",
    goldBright: "#F5D88B",
    goldDeep: "#8B6E40",
    goldBase: [232, 200, 121],
    ember: "#D4574F",
    emberBright: "#E8765C",
    emberDeep: "#7B2520",
    cream: "#F6EFDF",
    creamBase: [246, 239, 223],
    surfaceBase: [14, 38, 32],
    bgAppStops: ["#0E2620", "#0A1814", "#060E0C"],
    bgAppGlowTop: "rgba(63,168,119,0.10)",
    bgAppGlowBottom: "rgba(27,74,58,0.25)",
    bgTableStops: ["#14342B", "#0A1814", "#060E0C"],
    bgTableGlow: "rgba(63,168,119,0.20)",
    bgVelvetStops: ["#0E2620", "#060E0C"],
  },

  "ember-royal": {
    abyss: "#0A0F1A",
    night: "#10182A",
    night2: "#1A2438",
    night3: "#243245",
    velvet: "#2A1014",
    accent: "#8E2F2A",
    accentBright: "#C04A44",
    accentGlow: "#D4574F",
    accentDeep: "#4F1814",
    accentText: "#FFB39F",
    accentBase: [180, 68, 62],
    gold: "#E8C879",
    goldBright: "#F5D88B",
    goldDeep: "#8B6E40",
    goldBase: [232, 200, 121],
    ember: "#D4574F",
    emberBright: "#E8765C",
    emberDeep: "#7B2520",
    cream: "#F5F2ED",
    creamBase: [245, 242, 237],
    surfaceBase: [26, 36, 56],
    bgAppStops: ["#1A2438", "#10182A", "#0A0F1A"],
    bgAppGlowTop: "rgba(180,68,62,0.20)",
    bgAppGlowBottom: "rgba(70,93,116,0.22)",
    bgTableStops: ["#3A1D1F", "#1E1018", "#0B0710"],
    bgTableGlow: "rgba(180,68,62,0.35)",
    bgVelvetStops: ["#1A1014", "#0E0A0F"],
  },

  onyx: {
    abyss: "#020202",
    night: "#0A0A0A",
    night2: "#141414",
    night3: "#1E1E1E",
    velvet: "#0F0F10",
    accent: "#2A2A2C",
    accentBright: "#44443E",
    accentGlow: "#6A6660",
    accentDeep: "#0E0E10",
    accentText: "#EAC880",
    accentBase: [212, 175, 94],
    gold: "#D4AF5E",
    goldBright: "#EAC880",
    goldDeep: "#7A6536",
    goldBase: [212, 175, 94],
    ember: "#C95048",
    emberBright: "#E8765C",
    emberDeep: "#6E2520",
    cream: "#F6EFDF",
    creamBase: [246, 239, 223],
    surfaceBase: [20, 20, 20],
    bgAppStops: ["#141414", "#0A0A0A", "#020202"],
    bgAppGlowTop: "rgba(212,175,94,0.10)",
    bgAppGlowBottom: "rgba(40,40,40,0.4)",
    bgTableStops: ["#1E1E1E", "#0A0A0A", "#020202"],
    bgTableGlow: "rgba(212,175,94,0.18)",
    bgVelvetStops: ["#141414", "#020202"],
  },

  amethyste: {
    abyss: "#0A0518",
    night: "#16102A",
    night2: "#221A40",
    night3: "#2E2455",
    velvet: "#180C2E",
    accent: "#3A2A6B",
    accentBright: "#5C4396",
    accentGlow: "#8A6BC9",
    accentDeep: "#1F1542",
    accentText: "#B79FD8",
    accentBase: [138, 107, 201],
    gold: "#E5B5C0",
    goldBright: "#F2C9D5",
    goldDeep: "#A37381",
    goldBase: [229, 181, 192],
    ember: "#D4574F",
    emberBright: "#E8765C",
    emberDeep: "#7B2520",
    cream: "#F6EFDF",
    creamBase: [246, 239, 223],
    surfaceBase: [34, 26, 64],
    bgAppStops: ["#221A40", "#16102A", "#0A0518"],
    bgAppGlowTop: "rgba(138,107,201,0.14)",
    bgAppGlowBottom: "rgba(34,26,64,0.3)",
    bgTableStops: ["#2E2455", "#16102A", "#0A0518"],
    bgTableGlow: "rgba(138,107,201,0.22)",
    bgVelvetStops: ["#16102A", "#0A0518"],
  },
};

export interface Theme {
  id: ThemeId;

  // Surfaces (solid)
  abyss: string;
  night: string;
  night2: string;
  night3: string;
  velvet: string;
  ink: string;

  // Accent family
  accent: string;
  accentBright: string;
  accentGlow: string;
  accentDeep: string;
  accentText: string;

  // Gold family
  gold: string;
  goldBright: string;
  goldDeep: string;

  // Ember family
  ember: string;
  emberBright: string;
  emberDeep: string;

  // Neutrals
  cream: string;
  bone: string;
  ash: string;

  // Translucent surfaces (precomputed common steps)
  surface: string;
  surfaceElev: string;
  surfaceDeep: string;
  hairline: string;
  hairlineStrong: string;

  // Chips
  chipGoldBg: string;
  chipGoldBorder: string;
  chipGoldColor: string;
  chipAccentBg: string;
  chipAccentBorder: string;
  chipAccentColor: string;
  chipEmberBg: string;
  chipEmberBorder: string;
  chipEmberColor: string;

  // Alpha-step helpers (replace the prototype's --gold-NN / --accent-NN vars)
  goldA: (a: number) => string;
  accentA: (a: number) => string;
  emberA: (a: number) => string;
  surfA: (a: number) => string;
  creamA: (a: number) => string;

  // Background gradient inputs (consumed by DeepBg / TableBg / velvet bg)
  bgApp: { stops: [string, string, string]; glowTop: string; glowBottom: string };
  bgTable: { stops: [string, string, string]; glow: string };
  bgVelvet: { stops: [string, string] };

  // Glow colors (RN shadowColor)
  glowGold: string;
  glowAccent: string;
}

function buildTheme(id: ThemeId, s: ThemeSpec): Theme {
  const goldA = (a: number) => rgba(s.goldBase, a);
  const accentA = (a: number) => rgba(s.accentBase, a);
  const emberA = (a: number) => rgba(EMBER_BASE, a);
  const surfA = (a: number) => rgba(s.surfaceBase, a);
  const creamA = (a: number) => rgba(s.creamBase, a);

  return {
    id,
    abyss: s.abyss,
    night: s.night,
    night2: s.night2,
    night3: s.night3,
    velvet: s.velvet,
    ink: s.abyss,

    accent: s.accent,
    accentBright: s.accentBright,
    accentGlow: s.accentGlow,
    accentDeep: s.accentDeep,
    accentText: s.accentText,

    gold: s.gold,
    goldBright: s.goldBright,
    goldDeep: s.goldDeep,

    ember: s.ember,
    emberBright: s.emberBright,
    emberDeep: s.emberDeep,

    cream: s.cream,
    bone: BONE,
    ash: ASH,

    surface: surfA(0.55),
    surfaceElev: surfA(0.85),
    surfaceDeep: surfA(0.92),
    hairline: goldA(0.1),
    hairlineStrong: goldA(0.35),

    chipGoldBg: goldA(0.1),
    chipGoldBorder: goldA(0.28),
    chipGoldColor: s.gold,
    chipAccentBg: accentA(0.14),
    chipAccentBorder: accentA(0.4),
    chipAccentColor: s.accentText,
    chipEmberBg: emberA(0.12),
    chipEmberBorder: emberA(0.4),
    chipEmberColor: "#FFA89F",

    goldA,
    accentA,
    emberA,
    surfA,
    creamA,

    bgApp: { stops: s.bgAppStops, glowTop: s.bgAppGlowTop, glowBottom: s.bgAppGlowBottom },
    bgTable: { stops: s.bgTableStops, glow: s.bgTableGlow },
    bgVelvet: { stops: s.bgVelvetStops },

    glowGold: goldA(0.55),
    glowAccent: accentA(0.45),
  };
}

export const THEMES: Record<ThemeId, Theme> = {
  esmeralda: buildTheme("esmeralda", SPECS.esmeralda),
  "ember-royal": buildTheme("ember-royal", SPECS["ember-royal"]),
  onyx: buildTheme("onyx", SPECS.onyx),
  amethyste: buildTheme("amethyste", SPECS.amethyste),
};

export const DEFAULT_THEME_ID: ThemeId = "ember-royal";

/** Picker metadata — mirrors THEMES_META in `LaMap Arcade.html`. */
export const THEME_META: {
  id: ThemeId;
  label: string;
  sub: string;
  swatches: [string, string, string];
}[] = [
  { id: "esmeralda", label: "Esmeralda", sub: "émeraude + or", swatches: ["#1B4A3A", "#E8C879", "#F6EFDF"] },
  { id: "ember-royal", label: "Ember Royal", sub: "rouge + or + bleu nuit", swatches: ["#B4443E", "#E8C879", "#465D74"] },
  { id: "onyx", label: "Onyx Noir", sub: "charbon + champagne", swatches: ["#1A1A1A", "#D4AF5E", "#F6EFDF"] },
  { id: "amethyste", label: "Améthyste", sub: "aubergine + or rose", swatches: ["#3A2A6B", "#E5B5C0", "#F6EFDF"] },
];
