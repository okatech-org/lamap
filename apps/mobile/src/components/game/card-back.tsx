import { FONT_WEIGHTS } from "@/design";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import Svg, { Defs, Line, Pattern, Rect } from "react-native-svg";
import { PAPER_TEXTURE_SOURCE } from "./paper-texture";

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
    bg: ["#7D1E32", "#5B1525", "#3A0D18"],
    accent: "rgba(201, 165, 95, 0.6)",
    diamondFill: "rgba(201, 165, 95, 0.2)",
    monogram: "#E3C77E",
    border: "rgba(0, 0, 0, 0.4)",
  },
  blue: {
    bg: ["#5B1525", "#3A0D18", "#16070B"],
    accent: "rgba(201, 165, 95, 0.55)",
    diamondFill: "rgba(201, 165, 95, 0.18)",
    monogram: "#E3C77E",
    border: "rgba(0, 0, 0, 0.45)",
  },
  gold: {
    bg: ["#E3C77E", "#C9A55F", "#8B6A31"],
    accent: "rgba(31, 24, 16, 0.55)",
    diamondFill: "rgba(31, 24, 16, 0.25)",
    monogram: "#1F1810",
    border: "rgba(0, 0, 0, 0.5)",
  },
  dark: {
    bg: ["#3A0D18", "#24090F", "#16070B"],
    accent: "rgba(201, 165, 95, 0.55)",
    diamondFill: "rgba(201, 165, 95, 0.18)",
    monogram: "#E3C77E",
    border: "rgba(0, 0, 0, 0.55)",
  },
};

export function CardBack({
  size = "medium",
  theme = "red",
  style,
}: CardBackProps) {
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
      <Image
        source={PAPER_TEXTURE_SOURCE}
        contentFit="cover"
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { opacity: 0.12 }]}
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
    backgroundColor: "#5B1525",
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
