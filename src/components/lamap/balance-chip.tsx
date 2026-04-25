import { COLORS, FONT_WEIGHTS } from "@/design";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

interface LamapBalanceChipProps {
  amount: number | string;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Gold-tinted pill used to display the user's Kora balance — radial gold dot
 * + mono digits. Designed to sit in headers and top bars.
 */
export function LamapBalanceChip({ amount, style }: LamapBalanceChipProps) {
  const display =
    typeof amount === "number" ? amount.toLocaleString("fr-FR") : amount;
  return (
    <View
      style={[
        styles.chip,
        ...(Array.isArray(style) ? style : style ? [style] : []),
      ]}
    >
      <View style={styles.dotWrap}>
        <Svg width={14} height={14}>
          <Defs>
            <RadialGradient id="bal-dot" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#E8C879" stopOpacity={1} />
              <Stop offset="100%" stopColor="#6E5536" stopOpacity={1} />
            </RadialGradient>
          </Defs>
          <Rect width={14} height={14} rx={7} ry={7} fill="url(#bal-dot)" />
        </Svg>
      </View>
      <Text style={styles.text}>{display}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(166, 130, 88, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(201, 168, 118, 0.3)",
  },
  dotWrap: {
    width: 14,
    height: 14,
  },
  text: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 12,
    color: COLORS.or2,
    letterSpacing: 0.2,
  },
});
