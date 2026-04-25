import { COLORS } from "@/design";
import React from "react";
import { StyleSheet, View } from "react-native";

interface OnboardingProgressDotsProps {
  current: number;
  total: number;
}

/** Top-of-screen step indicator — N short bars, current+past = terre, future = muted. */
export function OnboardingProgressDots({
  current,
  total,
}: OnboardingProgressDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => {
        const filled = i <= current;
        return (
          <View
            key={i}
            style={[styles.bar, filled ? styles.barFilled : styles.barEmpty]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 6,
  },
  bar: {
    width: 24,
    height: 4,
    borderRadius: 2,
  },
  barFilled: {
    backgroundColor: COLORS.terre,
  },
  barEmpty: {
    backgroundColor: "rgba(245, 242, 237, 0.2)",
  },
});
