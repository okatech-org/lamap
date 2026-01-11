/**
 * Design Tokens - Lamap App
 * 
 * Extracted from reference screens (Welcome & Playing Board)
 * All values should be used throughout the app for consistency
 */

// ============================================
// COLORS
// ============================================

export const DesignColors = {
  // Backgrounds
  background: {
    primary: '#1C2A3A',      // Bleu-gris foncé principal
    secondary: '#243447',    // Bleu-gris légèrement plus clair
    tertiary: '#2D3E50',     // Surfaces élevées (cards)
  },

  // Accents
  primary: {
    DEFAULT: '#E86C5D',      // Rouge/corail principal
    hover: '#D45A4D',        // État hover
    pressed: '#C24A3D',      // État pressed
  },

  // Texte
  text: {
    primary: '#FFFFFF',      // Blanc pur pour titres
    secondary: '#A0AEC0',    // Gris clair pour texte secondaire
    muted: '#718096',        // Gris moyen pour texte tertiaire
    inverse: '#1C2A3A',      // Texte sur fond clair
  },

  // Bordures
  border: {
    DEFAULT: '#374151',      // Bordures subtiles
    light: '#4A5568',        // Bordures légèrement visibles
    strong: '#E86C5D',       // Bordures accentuées
  },

  // États
  success: '#48BB78',        // Vert
  warning: '#F6AD55',        // Orange (badges Kora)
  error: '#FC8181',          // Rouge erreur
  info: '#63B3ED',           // Bleu info

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const Designtypography = {
  // Font Sizes
  fontSize: {
    xxxl: 48,      // "Lamap" - Titres ultra-large
    xxl: 32,       // Titres de page
    xl: 24,        // Titres de section
    lg: 20,        // Sous-titres importants
    md: 16,        // Texte normal
    sm: 14,        // Texte secondaire
    xs: 12,        // Très petit texte
  },

  // Font Weights
  fontWeight: {
    black: '900' as const,
    bold: '700' as const,
    semibold: '600' as const,
    medium: '500' as const,
    regular: '400' as const,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,      // Titres
    normal: 1.5,     // Texte normal
    relaxed: 1.75,   // Texte aéré
  },
} as const;

// ============================================
// SPACING (Système 8px)
// ============================================

export const DesignSpacing = {
  // Espacements de base
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Paddings spécifiques
  container: 24,     // Padding horizontal des écrans
  card: 20,          // Padding interne des cartes
  button: 16,        // Padding vertical des boutons
  input: 16,         // Padding des inputs
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const DesignBorderRadius = {
  sm: 8,       // Petits éléments
  md: 12,      // Cartes standard
  lg: 16,      // Grandes cartes
  xl: 20,      // Modaux
  pill: 999,   // Boutons pill-shaped (comme Welcome)
} as const;

// ============================================
// SHADOWS
// ============================================

export const DesignShadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

// ============================================
// ANIMATIONS
// ============================================

export const DesignAnimations = {
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
  easing: {
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    easeIn: 'ease-in',
  },
} as const;

// ============================================
// COMPONENT SIZES
// ============================================

export const DesignSizes = {
  // Boutons
  button: {
    sm: 40,
    md: 48,
    lg: 56,
  },

  // Icons
  icon: {
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  },

  // Inputs
  input: {
    height: 56,
  },

  // Avatars
  avatar: {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  },
} as const;

// ============================================
// HELPER TYPE EXPORTS
// ============================================

export type DesignColor = typeof DesignColors;
export type FontSize = keyof typeof Designtypography.fontSize;
export type FontWeight = keyof typeof Designtypography.fontWeight;
export type Spacing = keyof typeof DesignSpacing;
export type BorderRadius = keyof typeof DesignBorderRadius;
