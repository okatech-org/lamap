import { useTheme } from "@/design";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface EmbersProps {
  count?: number;
  /** How far up an ember travels before fading out. */
  rise?: number;
}

interface Spark {
  x: number;
  delay: number;
  dur: number;
  size: number;
  dx: number;
  warm: boolean;
}

// Same deterministic seed as the prototype's hud.jsx so positions are stable.
function seed(i: number) {
  return ((i * 9301 + 49297) % 233280) / 233280;
}

function Ember({
  spark,
  rise,
  gold,
  ember,
}: {
  spark: Spark;
  rise: number;
  gold: string;
  ember: string;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      spark.delay * 1000,
      withRepeat(
        withTiming(1, { duration: spark.dur * 1000, easing: Easing.linear }),
        -1,
        false,
      ),
    );
  }, [spark.delay, spark.dur, t]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 0.1, 1], [0, 1, 0]),
    transform: [
      { translateY: -rise * t.value },
      { translateX: spark.dx * t.value },
      { scale: interpolate(t.value, [0, 1], [1, 0.4]) },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.spark,
        {
          left: `${spark.x}%`,
          width: spark.size,
          height: spark.size,
          borderRadius: spark.size / 2,
          backgroundColor: spark.warm ? gold : ember,
        },
        style,
      ]}
    />
  );
}

/**
 * Small embers rising from the bottom edge — ports the `la-ember` keyframe
 * from `tokens.css`. Warm gold + ember tones pulled from the active theme.
 */
export function Embers({ count = 14, rise = 150 }: EmbersProps) {
  const theme = useTheme();
  const sparks = useMemo<Spark[]>(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        x: seed(i + 1) * 100,
        delay: seed(i + 5) * 6,
        dur: 3 + seed(i + 11) * 4,
        size: 2 + seed(i + 17) * 3,
        dx: (seed(i + 23) - 0.5) * 40,
        warm: seed(i + 29) < 0.5,
      })),
    [count],
  );

  return (
    <View style={styles.layer} pointerEvents="none">
      {sparks.map((s, i) => (
        <Ember
          key={i}
          spark={s}
          rise={rise}
          gold={theme.goldBright}
          ember={theme.emberBright}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  spark: {
    position: "absolute",
    bottom: -8,
  },
});
