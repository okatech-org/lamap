import { COLORS, FONT_WEIGHTS } from "@/design";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MancheDotsProps {
  current?: number;
  total?: number;
  won?: number[];
}

export function MancheDots({
  current = 1,
  total = 5,
  won = [],
}: MancheDotsProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>MANCHE</Text>
      {Array.from({ length: total }).map((_, i) => {
        const isWon = won.includes(i);
        const isCurrent = i === current;
        const isPast = i < current;
        const bg = isWon
          ? COLORS.or2
          : isCurrent
            ? COLORS.terre
            : isPast
              ? "rgba(245,242,237,0.5)"
              : "rgba(245,242,237,0.18)";
        return (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: bg },
              isCurrent && styles.dotGlow,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 10,
    color: "rgba(245, 242, 237, 0.55)",
    letterSpacing: 1.8,
    marginRight: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotGlow: {
    shadowColor: "#B4443E",
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
});
