import React, { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface GoldDustProps {
  count?: number;
  opacity?: number;
}

interface Dot {
  x: number;
  y: number;
  size: number;
  delay: number;
  dur: number;
}

// Same deterministic seed as the design's ui.jsx so dot positions match.
function seed(i: number) {
  return ((i * 9301 + 49297) % 233280) / 233280;
}

function Particle({ dot, opacity }: { dot: Dot; opacity: number }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      dot.delay * 1000,
      withRepeat(
        withTiming(1, {
          duration: dot.dur * 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    );
  }, [dot.delay, dot.dur, t]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: -12 * t.value },
      { translateX: 4 * t.value },
    ],
    opacity: 0.4 + 0.5 * t.value,
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          left: `${dot.x}%`,
          top: `${dot.y}%`,
          width: dot.size,
          height: dot.size,
          borderRadius: dot.size / 2,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function GoldDust({ count = 18, opacity = 0.6 }: GoldDustProps) {
  const dots = useMemo<Dot[]>(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        x: seed(i + 1) * 100,
        y: seed(i + 7) * 100,
        size: 2 + seed(i + 13) * 4,
        delay: seed(i + 19) * 6,
        dur: 5 + seed(i + 23) * 5,
      })),
    [count],
  );

  return (
    <View style={styles.layer} pointerEvents="none">
      {dots.map((d, i) => (
        <Particle key={i} dot={d} opacity={opacity} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  dot: {
    position: "absolute",
    backgroundColor: "rgba(201, 168, 118, 0.9)",
  },
});
