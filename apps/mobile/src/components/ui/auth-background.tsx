import { GoldDust } from "@/components/lamap";
import { COLORS } from "@/design";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

const SUIT_IMAGES = {
  spades: require("@assets/images/suit_spade.svg"),
  clubs: require("@assets/images/suit_club.svg"),
  hearts: require("@assets/images/suit_heart.svg"),
  diamonds: require("@assets/images/suit_diamond.svg"),
};

/**
 * Welcome / landing backdrop — Hero classique variant.
 *
 * Deep nuit base + soft terre/or radial highlights, large faded suit motifs,
 * and a layer of gold-dust particles.
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
      <Image
        source={SUIT_IMAGES.hearts}
        style={[styles.suit, { top: 80, left: -40, width: 220, height: 220, opacity: 0.05 }]}
        contentFit="contain"
        tintColor="#F5F2ED"
      />
      <Image
        source={SUIT_IMAGES.diamonds}
        style={[styles.suit, { top: 220, right: -60, width: 260, height: 260, opacity: 0.04 }]}
        contentFit="contain"
        tintColor="#F5F2ED"
      />
      <Image
        source={SUIT_IMAGES.spades}
        style={[styles.suit, { top: 380, left: 40, width: 90, height: 90, opacity: 0.06 }]}
        contentFit="contain"
        tintColor="#F5F2ED"
      />
      <Image
        source={SUIT_IMAGES.clubs}
        style={[styles.suit, { bottom: 240, right: 50, width: 70, height: 70, opacity: 0.05 }]}
        contentFit="contain"
        tintColor="#F5F2ED"
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
