import { FONT_WEIGHTS } from "@/design";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import Svg, { Defs, Line, Pattern, Rect } from "react-native-svg";

export type CardBackTheme = "red" | "blue" | "gold" | "dark";

interface CardBackProps {
  size?: "small" | "medium" | "large" | "xl" | "xxl";
  /** Optional cosmetic skin id. Defaults to the original red leather. */
  theme?: CardBackTheme;
  style?: ViewStyle;
}

const CARD_ASPECT_RATIO = 5 / 7;

const CARD_WIDTHS = {
  small: 32,
  medium: 60,
  large: 90,
  xl: 100,
  xxl: 140,
};

const INSET = {
  small: 3,
  medium: 5,
  large: 6,
  xl: 7,
  xxl: 10,
};

const OUTER_RADIUS = {
  small: 5,
  medium: 8,
  large: 10,
  xl: 12,
  xxl: 14,
};

interface ThemeSpec {
  /** Background gradient (top-left → bottom-right). */
  bg: readonly [string, string, string];
  /** Lozenge pattern stroke + diamond border + monogram color. */
  accent: string;
  /** Diamond fill behind the LM monogram. */
  diamondFill: string;
  /** Monogram text color (overrides accent if set). */
  monogram?: string;
  /** Outer card border. */
  border: string;
}

const THEMES: Record<CardBackTheme, ThemeSpec> = {
  red: {
    bg: ["#B4443E", "#8E2F2A", "#6E2520"],
    accent: "rgba(201, 168, 118, 0.6)",
    diamondFill: "rgba(201, 168, 118, 0.2)",
    monogram: "#C9A876",
    border: "rgba(0, 0, 0, 0.4)",
  },
  blue: {
    bg: ["#5A7A96", "#465D74", "#1F2C3B"],
    accent: "rgba(201, 168, 118, 0.55)",
    diamondFill: "rgba(201, 168, 118, 0.18)",
    monogram: "#C9A876",
    border: "rgba(0, 0, 0, 0.45)",
  },
  gold: {
    bg: ["#D9B780", "#A68258", "#6E5536"],
    accent: "rgba(31, 24, 16, 0.55)",
    diamondFill: "rgba(31, 24, 16, 0.25)",
    monogram: "#1F1810",
    border: "rgba(0, 0, 0, 0.5)",
  },
  dark: {
    bg: ["#2A1F1A", "#150D0B", "#0A0807"],
    accent: "rgba(157, 91, 210, 0.55)",
    diamondFill: "rgba(157, 91, 210, 0.18)",
    monogram: "#C898E5",
    border: "rgba(0, 0, 0, 0.55)",
  },
};

export function CardBack({ size = "medium", theme = "red", style }: CardBackProps) {
  const cardWidth = CARD_WIDTHS[size];
  const cardHeight = cardWidth / CARD_ASPECT_RATIO;
  const inset = INSET[size];
  const outerRadius = OUTER_RADIUS[size];
  const innerRadius = Math.max(2, outerRadius - 4);
  const monogramSize = Math.max(8, cardWidth * 0.22);
  const showMonogram = cardWidth >= 60;
  const t = THEMES[theme];
  const lozengeStroke = t.accent.replace(/0\.\d+\)/, "0.18)");

  return (
    <View
      style={[
        styles.card,
        {
          width: cardWidth,
          height: cardHeight,
          borderRadius: outerRadius,
          borderColor: t.border,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={t.bg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: outerRadius }]}
      />

      <View
        style={[
          styles.inner,
          {
            top: inset,
            left: inset,
            right: inset,
            bottom: inset,
            borderRadius: innerRadius,
            borderColor: t.accent,
          },
        ]}
      >
        <Svg
          width="100%"
          height="100%"
          style={[StyleSheet.absoluteFill, { borderRadius: innerRadius }]}
        >
          <Defs>
            <Pattern
              id={`lz-${size}-${theme}`}
              patternUnits="userSpaceOnUse"
              width={12}
              height={12}
            >
              <Line
                x1={0}
                y1={0}
                x2={12}
                y2={12}
                stroke={lozengeStroke}
                strokeWidth={1}
              />
              <Line
                x1={12}
                y1={0}
                x2={0}
                y2={12}
                stroke={lozengeStroke}
                strokeWidth={1}
              />
            </Pattern>
          </Defs>
          <Rect
            x={0}
            y={0}
            width="100%"
            height="100%"
            fill={`url(#lz-${size}-${theme})`}
          />
        </Svg>

        {showMonogram && (
          <View style={styles.diamondWrap}>
            <View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  transform: [{ rotate: "45deg" }],
                  borderWidth: 1,
                  borderColor: t.accent,
                  backgroundColor: t.diamondFill,
                },
              ]}
            />
            <Text
              style={{
                fontFamily: FONT_WEIGHTS.display.bold,
                color: t.monogram ?? t.accent,
                fontSize: monogramSize,
                letterSpacing: -monogramSize * 0.04,
              }}
            >
              LM
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderWidth: 1.5,
    backgroundColor: "#8E2F2A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  inner: {
    position: "absolute",
    overflow: "hidden",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  diamondWrap: {
    width: "50%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
