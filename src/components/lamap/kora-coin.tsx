import { FONT_WEIGHTS } from "@/design";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

interface LamapKoraCoinProps {
  size?: "sm" | "md" | "lg";
  style?: ViewStyle | ViewStyle[];
}

const DIM = { sm: 24, md: 40, lg: 64 } as const;

/**
 * Gold radial-gradient disc with the "K" monogram. Used by the wallet hero,
 * the shop balance chip, and any place that needs to refer to the Kora token.
 */
export function LamapKoraCoin({ size = "md", style }: LamapKoraCoinProps) {
  const d = DIM[size];
  const fontSize = d * 0.45;
  return (
    <View
      style={[
        styles.coin,
        {
          width: d,
          height: d,
          borderRadius: d / 2,
          borderWidth: size === "lg" ? 3 : size === "md" ? 2 : 1,
        },
        ...(Array.isArray(style) ? style : style ? [style] : []),
      ]}
    >
      <Svg width={d} height={d} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id={`coin-${size}`} cx="30%" cy="30%" rx="70%" ry="70%">
            <Stop offset="0%" stopColor="#F2DA9A" stopOpacity={1} />
            <Stop offset="50%" stopColor="#C9A876" stopOpacity={1} />
            <Stop offset="100%" stopColor="#6E5536" stopOpacity={1} />
          </RadialGradient>
        </Defs>
        <Rect width={d} height={d} rx={d / 2} ry={d / 2} fill={`url(#coin-${size})`} />
      </Svg>
      <Text
        style={{
          fontFamily: FONT_WEIGHTS.display.extrabold,
          fontSize,
          color: "#1F1810",
          letterSpacing: -fontSize * 0.04,
        }}
      >
        K
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  coin: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#6E5536",
    overflow: "hidden",
    shadowColor: "#E8C879",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
});
