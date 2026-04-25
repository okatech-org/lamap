import { COLORS } from "@/design";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface LamapProgressBarProps {
  /** 0..1 fill ratio. Clamped. */
  value: number;
  /** Bar height in pixels. Default 10. */
  height?: number;
  /** Override the fill gradient. Defaults to terre → or. */
  fillColors?: readonly [string, string];
  style?: ViewStyle | ViewStyle[];
}

export function LamapProgressBar({
  value,
  height = 10,
  fillColors = ["#B4443E", "#C9A876"],
  style,
}: LamapProgressBarProps) {
  const ratio = Math.max(0, Math.min(1, value));
  const radius = height / 2;
  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: radius },
        ...(Array.isArray(style) ? style : style ? [style] : []),
      ]}
    >
      <View
        style={[
          styles.fillWrap,
          {
            width: `${ratio * 100}%`,
            borderRadius: radius,
          },
        ]}
      >
        <LinearGradient
          colors={fillColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: "rgba(166, 130, 88, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(201, 168, 118, 0.25)",
    overflow: "hidden",
  },
  fillWrap: {
    height: "100%",
    overflow: "hidden",
    shadowColor: COLORS.or2,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
});
