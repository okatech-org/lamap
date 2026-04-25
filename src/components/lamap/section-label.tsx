import { COLORS, FONT_WEIGHTS } from "@/design";
import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

interface LamapSectionLabelProps {
  children: string;
  tone?: "or" | "muted";
  style?: TextStyle | TextStyle[];
}

/**
 * Small uppercase mono section header — `MODES DE JEU`, `PARTIE RAPIDE`, etc.
 * Matches the `font-mono · letter-spacing 0.25em` pattern recurring across the
 * Refonte HTML.
 */
export function LamapSectionLabel({
  children,
  tone = "or",
  style,
}: LamapSectionLabelProps) {
  return (
    <Text
      style={[
        styles.base,
        tone === "or" ? styles.or : styles.muted,
        ...(Array.isArray(style) ? style : style ? [style] : []),
      ]}
    >
      {children.toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 10,
    letterSpacing: 2.2,
  },
  or: {
    color: COLORS.or2,
  },
  muted: {
    color: "rgba(245, 242, 237, 0.5)",
  },
});
