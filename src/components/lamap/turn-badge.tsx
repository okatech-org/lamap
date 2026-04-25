import { COLORS, FONT_WEIGHTS } from "@/design";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface LamapTurnBadgeProps {
  visible: boolean;
  label?: string;
  glyph?: string;
}

/**
 * Pulsing pill shown over the play area when it is the player's turn.
 * Terre gradient + cream label + slow scale/opacity pulse, matching the
 * design's "À vous de jouer" badge.
 */
export function LamapTurnBadge({
  visible,
  label = "À vous de jouer",
  glyph = "♛",
}: LamapTurnBadgeProps) {
  const enter = useSharedValue(visible ? 1 : 0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    enter.value = withTiming(visible ? 1 : 0, {
      duration: 240,
      easing: Easing.out(Easing.ease),
    });
  }, [visible, enter]);

  useEffect(() => {
    if (!visible) return;
    pulse.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [visible, pulse]);

  const wrapStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ scale: 0.96 + 0.04 * enter.value + 0.04 * pulse.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.wrap, wrapStyle]}>
      <LinearGradient
        colors={["#C95048", "#A93934"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
      />
      <View style={styles.inner}>
        <Text style={styles.glyph}>{glyph}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    borderRadius: 999,
    shadowColor: COLORS.terre,
    shadowOpacity: 0.32,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  glyph: {
    fontSize: 16,
    color: COLORS.cream,
  },
  label: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 14,
    color: COLORS.cream,
    letterSpacing: -0.1,
  },
});
