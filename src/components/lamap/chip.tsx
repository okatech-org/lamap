import { COLORS, FONT_WEIGHTS } from "@/design";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface LamapChipProps {
  children: string;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Gold-tinted pill — ports `tokens.css .chip`. Used for small uppercase mono
 * labels (taglines like "GARAME · DUEL · KORA", category badges, etc.).
 */
export function LamapChip({ children, style }: LamapChipProps) {
  return (
    <View
      style={[
        styles.chip,
        ...(Array.isArray(style) ? style : style ? [style] : []),
      ]}
    >
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 26,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(166, 130, 88, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(166, 130, 88, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 12,
    color: COLORS.or2,
    letterSpacing: 1.8,
  },
});
