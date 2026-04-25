import { COLORS, FONT_WEIGHTS } from "@/design";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Suit = "hearts" | "diamonds" | "clubs" | "spades";

const SUIT_GLYPH: Record<Suit, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const SUIT_COLOR: Record<Suit, string> = {
  hearts: COLORS.terre,
  diamonds: COLORS.terre,
  clubs: COLORS.cream,
  spades: COLORS.cream,
};

interface LamapLeadSuitChipProps {
  suit: Suit | undefined;
}

/**
 * Small "Carte demandée ♥" chip shown above the play area when a lead suit
 * has been set this turn. Fades + rises in on suit change.
 */
export function LamapLeadSuitChip({ suit }: LamapLeadSuitChipProps) {
  const t = useSharedValue(0);

  useEffect(() => {
    if (!suit) {
      t.value = 0;
      return;
    }
    t.value = 0;
    t.value = withTiming(1, {
      duration: 320,
      easing: Easing.out(Easing.ease),
    });
  }, [suit, t]);

  const animated = useAnimatedStyle(() => ({
    opacity: t.value,
    transform: [{ translateY: 8 * (1 - t.value) }],
  }));

  if (!suit) return null;

  return (
    <Animated.View style={[styles.wrap, animated]} pointerEvents="none">
      <View style={styles.chip}>
        <Text style={styles.label}>Carte demandée</Text>
        <Text style={[styles.glyph, { color: SUIT_COLOR[suit] }]}>
          {SUIT_GLYPH[suit]}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(15, 22, 32, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(201, 168, 118, 0.25)",
  },
  label: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 12,
    color: "rgba(245, 242, 237, 0.85)",
  },
  glyph: {
    fontSize: 14,
  },
});
