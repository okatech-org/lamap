import { TextStyle } from "react-native";

/**
 * Typography System - Based on Reference Screens
 * Welcome Screen & Playing Board design
 */
export const Typography = {
  // Display - Ultra large (Welcome screen title)
  display: {
    fontSize: 48,
    lineHeight: 58,
    fontWeight: "900" as TextStyle["fontWeight"],
  },

  // Headings
  h1: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700" as TextStyle["fontWeight"],
  },
  h2: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "700" as TextStyle["fontWeight"],
  },
  h3: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "600" as TextStyle["fontWeight"],
  },
  h4: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "600" as TextStyle["fontWeight"],
  },

  // Body text
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as TextStyle["fontWeight"],
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as TextStyle["fontWeight"],
  },
  bodyBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as TextStyle["fontWeight"],
  },

  // Secondary text
  caption: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "400" as TextStyle["fontWeight"],
  },
  captionBold: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600" as TextStyle["fontWeight"],
  },

  // Small text
  small: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400" as TextStyle["fontWeight"],
  },

  // Button text
  button: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "600" as TextStyle["fontWeight"],
  },
};

