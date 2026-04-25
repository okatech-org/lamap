import { FONT_WEIGHTS } from "@/design";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import Svg, { Defs, Line, Pattern, Rect } from "react-native-svg";

interface CardBackProps {
  size?: "small" | "medium" | "large" | "xl" | "xxl";
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

export function CardBack({ size = "medium", style }: CardBackProps) {
  const cardWidth = CARD_WIDTHS[size];
  const cardHeight = cardWidth / CARD_ASPECT_RATIO;
  const inset = INSET[size];
  const outerRadius = OUTER_RADIUS[size];
  const innerRadius = Math.max(2, outerRadius - 4);
  const monogramSize = Math.max(8, cardWidth * 0.22);
  const showMonogram = cardWidth >= 60;

  return (
    <View
      style={[
        styles.card,
        {
          width: cardWidth,
          height: cardHeight,
          borderRadius: outerRadius,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={["#B4443E", "#8E2F2A", "#6E2520"]}
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
              id={`lz-${size}`}
              patternUnits="userSpaceOnUse"
              width={12}
              height={12}
            >
              <Line
                x1={0}
                y1={0}
                x2={12}
                y2={12}
                stroke="rgba(201,168,118,0.18)"
                strokeWidth={1}
              />
              <Line
                x1={12}
                y1={0}
                x2={0}
                y2={12}
                stroke="rgba(201,168,118,0.18)"
                strokeWidth={1}
              />
            </Pattern>
          </Defs>
          <Rect x={0} y={0} width="100%" height="100%" fill={`url(#lz-${size})`} />
        </Svg>

        {showMonogram && (
          <View style={styles.diamondWrap}>
            <View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  transform: [{ rotate: "45deg" }],
                  borderWidth: 1,
                  borderColor: "rgba(201,168,118,0.6)",
                  backgroundColor: "rgba(201,168,118,0.2)",
                },
              ]}
            />
            <Text
              style={{
                fontFamily: FONT_WEIGHTS.display.bold,
                color: "#C9A876",
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
    borderColor: "rgba(0,0,0,0.4)",
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
    borderColor: "rgba(201, 168, 118, 0.55)",
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
