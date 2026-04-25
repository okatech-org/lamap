import { COLORS, FONT_WEIGHTS, RADII } from "@/design";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { LamapSectionLabel } from "./section-label";

interface LamapHeroCardProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Big terre-gradient hero card. Two-layer build: an outer shadow wrapper (NOT
 * clipped) and an inner card with `overflow: hidden` for the gradient + halo.
 * Without that split, iOS clips the drop-shadow ("gloss") because RN couples
 * shadow rendering to layer masking.
 *
 * The inner top-right corner carries a soft gold halo SVG; the outer wrapper
 * carries the warm terre drop-shadow that bleeds onto the surrounding bg.
 */
export function LamapHeroCard({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  onPress,
  style,
}: LamapHeroCardProps) {
  const wrapperStyle: ViewStyle[] = [
    styles.shadowWrap,
    ...(Array.isArray(style) ? style : style ? [style] : []),
  ];

  const inner = (
    <View style={styles.card}>
      <LinearGradient
        colors={["#C95048", "#6E2520"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: RADII.xl }]}
      />
      <View style={styles.halo} pointerEvents="none">
        <Svg width={180} height={180}>
          <Defs>
            <RadialGradient id="hero-halo" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor={COLORS.or2} stopOpacity={0.32} />
              <Stop offset="70%" stopColor={COLORS.or2} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect width={180} height={180} fill="url(#hero-halo)" />
        </Svg>
      </View>
      <View style={styles.content}>
        {eyebrow ? (
          <LamapSectionLabel
            tone="muted"
            style={{ color: "rgba(245,242,237,0.7)" }}
          >
            {eyebrow}
          </LamapSectionLabel>
        ) : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {ctaLabel ? (
          <View style={styles.cta}>
            <Text style={styles.ctaText}>{ctaLabel}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  if (!onPress) {
    return <View style={wrapperStyle}>{inner}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        ...wrapperStyle,
        pressed && { transform: [{ scale: 0.99 }] },
      ]}
    >
      {inner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: RADII.xl,
    backgroundColor: COLORS.terreDeep,
    shadowColor: COLORS.terre,
    shadowOpacity: 0.32,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  card: {
    position: "relative",
    padding: 22,
    borderRadius: RADII.xl,
    overflow: "hidden",
  },
  halo: {
    position: "absolute",
    top: -40,
    right: -30,
    width: 180,
    height: 180,
  },
  content: {
    gap: 6,
  },
  title: {
    fontFamily: FONT_WEIGHTS.display.extrabold,
    fontSize: 32,
    color: COLORS.cream,
    letterSpacing: -1,
    lineHeight: 34,
    marginTop: 4,
  } as TextStyle,
  subtitle: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 13,
    color: "rgba(245,242,237,0.85)",
    marginTop: 4,
  } as TextStyle,
  cta: {
    alignSelf: "flex-start",
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: COLORS.cream,
  },
  ctaText: {
    fontFamily: FONT_WEIGHTS.body.bold,
    fontSize: 14,
    color: "#6E2520",
    letterSpacing: -0.1,
  } as TextStyle,
});
