import { COLORS } from "@/design";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MancheDots } from "./manche-dots";

interface LamapGameTopBarProps {
  current: number;
  total: number;
  won?: number[];
  onConcede?: () => void;
  rightSlot?: React.ReactNode;
}

/**
 * In-game top bar — manche pips on the left, optional concede flag (or a
 * caller-supplied right slot for chat/timer) on the right. Sits flush with
 * the safe-area top inset over the table backdrop.
 */
export function LamapGameTopBar({
  current,
  total,
  won = [],
  onConcede,
  rightSlot,
}: LamapGameTopBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      <LinearGradient
        colors={["rgba(15,22,32,0.9)", "rgba(15,22,32,0.5)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.row}>
        <MancheDots current={current} total={total} won={won} />
        <View style={styles.right}>
          {rightSlot}
          {onConcede ? (
            <Pressable
              onPress={onConcede}
              style={styles.flagBtn}
              accessibilityRole="button"
              accessibilityLabel="Abandonner"
              hitSlop={6}
            >
              <Svg width={14} height={16} viewBox="0 0 14 16">
                <Path d="M2 1 V 15 H 3 V 9 L 12 9 L 10 5 L 12 1 Z" fill={COLORS.cream} />
              </Svg>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(201, 168, 118, 0.12)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  flagBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8E2F2A",
    borderWidth: 1,
    borderColor: "rgba(201, 168, 118, 0.3)",
  },
});
