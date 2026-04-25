import { COLORS, FONT_WEIGHTS, RANKS, type RankTier } from "@/design";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
} from "react-native-svg";

interface RankBadgeProps {
  rank?: string;
  size?: number;
  showName?: boolean;
  points?: number;
}

export function RankBadge({
  rank = "Initié",
  size = 56,
  showName = false,
  points,
}: RankBadgeProps) {
  const tier: RankTier =
    RANKS.find((r) => r.name === rank) ?? RANKS[1];
  const id = `rk-${tier.short}`;

  return (
    <View style={styles.wrap}>
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 60 64" style={StyleSheet.absoluteFill}>
          <Defs>
            <SvgLinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={tier.color} stopOpacity={1} />
              <Stop offset="100%" stopColor={tier.color} stopOpacity={0.55} />
            </SvgLinearGradient>
          </Defs>
          <Path
            d="M30 2 L56 16 L56 48 L30 62 L4 48 L4 16 Z"
            fill={`url(#${id})`}
            stroke={tier.color}
            strokeWidth={1.5}
          />
          <Path
            d="M30 6 L52 18 L52 46 L30 58 L8 46 L8 18 Z"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={0.8}
          />
        </Svg>
        <Text
          style={{
            fontFamily: FONT_WEIGHTS.display.bold,
            fontSize: size * 0.42,
            color: "rgba(20,26,34,0.85)",
          }}
        >
          {tier.short}
        </Text>
      </View>
      {showName && (
        <View style={styles.label}>
          <Text style={styles.name}>{tier.name}</Text>
          {points != null && (
            <Text style={[styles.points, { color: tier.color }]}>
              {points} PR
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: 6,
  },
  label: {
    alignItems: "center",
  },
  name: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 13,
    color: COLORS.cream,
    letterSpacing: -0.13,
  },
  points: {
    fontFamily: FONT_WEIGHTS.mono.regular,
    fontSize: 10,
    marginTop: 2,
  },
});
