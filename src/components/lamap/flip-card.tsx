import { CardBack } from "@/components/game/card-back";
import { PlayingCard } from "@/components/game/playing-card";
import { useActiveCardBackTheme } from "@/hooks/use-active-card-back";
import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Suit = "hearts" | "diamonds" | "clubs" | "spades";
type Rank = "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
type Size = "small" | "medium" | "large" | "xl" | "xxl";

interface FlipCardProps {
  rank: Rank;
  suit: Suit;
  size?: Size;
  flipped?: boolean;
  duration?: number;
  style?: ViewStyle;
}

/**
 * Wraps the existing PlayingCard + CardBack in a 3D flip transition. Tap-handlers
 * stay on the consumer — this just controls the rotateY interpolation.
 *
 * Note: the existing CardBack has narrower widths than PlayingCard for some
 * sizes (small=32 vs 60). Pass the size that matches the visible footprint
 * you want; the wrapper does not unify them.
 */
export function FlipCard({
  rank,
  suit,
  size = "medium",
  flipped = false,
  duration = 600,
  style,
}: FlipCardProps) {
  const progress = useSharedValue(flipped ? 1 : 0);
  const theme = useActiveCardBackTheme();

  useEffect(() => {
    progress.value = withTiming(flipped ? 1 : 0, {
      duration,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [flipped, duration, progress]);

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${progress.value * 180}deg` },
    ],
  }));

  const faceStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${progress.value * 180 - 180}deg` },
    ],
  }));

  return (
    <View style={[styles.wrap, style]}>
      <Animated.View style={[styles.face, backStyle]}>
        <CardBack size={size} theme={theme} />
      </Animated.View>
      <Animated.View style={[styles.face, styles.front, faceStyle]}>
        <PlayingCard rank={rank} suit={suit} state="played" size={size} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "flex-start",
  },
  face: {
    backfaceVisibility: "hidden",
  },
  front: {
    ...StyleSheet.absoluteFillObject,
  },
});
