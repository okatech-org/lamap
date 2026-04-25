import React, { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

interface SparksProps {
  count?: number;
  palette?: readonly string[];
  trigger?: number;
}

const DEFAULT_PALETTE = [
  "#C9A876",
  "#E8C879",
  "#B4443E",
  "#F5F2ED",
] as const;

interface Item {
  cx: number;
  cy: number;
  color: string;
  delay: number;
  size: number;
}

function Spark({ item }: { item: Item }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = 0;
    t.value = withDelay(
      item.delay * 1000,
      withTiming(1, {
        duration: 1400,
        easing: Easing.bezier(0.2, 0.7, 0.3, 1),
      }),
    );
  }, [item, t]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: item.cx * t.value },
      { translateY: -10 + (240 + 10) * t.value },
      { rotate: `${540 * t.value}deg` },
    ],
    opacity: 1 - t.value,
  }));

  return (
    <Animated.View
      style={[
        styles.spark,
        {
          width: item.size,
          height: item.size * 0.4,
          backgroundColor: item.color,
        },
        style,
      ]}
    />
  );
}

/**
 * Burst of confetti rectangles. `trigger` is an id you bump (e.g. via state)
 * to replay the burst from scratch.
 */
export function Sparks({
  count = 28,
  palette = DEFAULT_PALETTE,
  trigger = 0,
}: SparksProps) {
  const items = useMemo<Item[]>(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const r = 60 + Math.random() * 80;
        return {
          cx: Math.cos(a) * r,
          cy: Math.sin(a) * r * 0.8 - 40,
          color: palette[i % palette.length],
          delay: Math.random() * 0.2,
          size: 6 + Math.random() * 6,
        };
      }),
    // Re-roll on trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, palette, trigger],
  );

  return (
    <View style={styles.wrap} pointerEvents="none">
      {items.map((it, i) => (
        <Spark key={`${trigger}-${i}`} item={it} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  spark: {
    position: "absolute",
    borderRadius: 1,
  },
});
