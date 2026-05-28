import { GoldDust } from "@/components/lamap";
import { COLORS } from "@/design";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

const SUIT_IMAGES = {
  spades: require("@assets/images/suit_spade.svg"),
  clubs: require("@assets/images/suit_club.svg"),
  hearts: require("@assets/images/suit_heart.svg"),
  diamonds: require("@assets/images/suit_diamond.svg"),
};

interface SuitProps {
  source: number;
  pos: ViewStyle;
  size: number;
  baseOpacity: number;
  delay: number;
  dur: number;
  amp: number;
  rot: number;
}

/** A single faded suit motif that drifts + breathes very gently, on a loop. */
function AnimatedSuit({
  source,
  pos,
  size,
  baseOpacity,
  delay,
  dur,
  amp,
  rot,
}: SuitProps) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: dur, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      ),
    );
  }, [delay, dur, t]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [baseOpacity * 0.7, baseOpacity * 1.2]),
    transform: [
      { translateY: interpolate(t.value, [0, 1], [amp, -amp]) },
      { rotate: `${interpolate(t.value, [0, 1], [-rot, rot])}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.suit, pos, style]} pointerEvents="none">
      <Image
        source={source}
        style={{ width: size, height: size }}
        contentFit="contain"
        tintColor="#F5F2ED"
      />
    </Animated.View>
  );
}

/**
 * Welcome / landing backdrop — Hero classique variant.
 *
 * Deep nuit base + soft terre/or radial highlights, large faded suit motifs
 * (now gently animated), and a layer of gold-dust particles.
 */
export function AuthBackground() {
  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="bg-terre" cx="30%" cy="15%" rx="80%" ry="70%">
            <Stop offset="0%" stopColor={COLORS.terre} stopOpacity={0.1} />
            <Stop offset="50%" stopColor={COLORS.terre} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="bg-or" cx="80%" cy="85%" rx="80%" ry="70%">
            <Stop offset="0%" stopColor={COLORS.or} stopOpacity={0.08} />
            <Stop offset="50%" stopColor={COLORS.or} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={COLORS.bg} />
        <Rect width="100%" height="100%" fill="url(#bg-terre)" />
        <Rect width="100%" height="100%" fill="url(#bg-or)" />
      </Svg>

      {/* Oversized faded suit motifs — same assets as the playing cards. */}
      <AnimatedSuit
        source={SUIT_IMAGES.hearts}
        pos={{ top: 80, left: -40 }}
        size={220}
        baseOpacity={0.05}
        delay={0}
        dur={7000}
        amp={10}
        rot={3}
      />
      <AnimatedSuit
        source={SUIT_IMAGES.diamonds}
        pos={{ top: 220, right: -60 }}
        size={260}
        baseOpacity={0.04}
        delay={1200}
        dur={9000}
        amp={12}
        rot={2.5}
      />
      <AnimatedSuit
        source={SUIT_IMAGES.spades}
        pos={{ top: 380, left: 40 }}
        size={90}
        baseOpacity={0.06}
        delay={600}
        dur={6000}
        amp={8}
        rot={4}
      />
      <AnimatedSuit
        source={SUIT_IMAGES.clubs}
        pos={{ bottom: 240, right: 50 }}
        size={70}
        baseOpacity={0.05}
        delay={1800}
        dur={8000}
        amp={7}
        rot={4}
      />

      <GoldDust count={14} opacity={0.45} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    overflow: "hidden",
  },
  suit: {
    position: "absolute",
  },
});
