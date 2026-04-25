import { COLORS } from "@/design";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { GoldDust } from "./gold-dust";

interface DeepBgProps {
  dust?: boolean;
  dustCount?: number;
  dustOpacity?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}

/**
 * Reusable `bg-deep` backdrop — `tokens.css:64-69`. Sits behind any screen
 * that needs the night-blue base + soft terre/or radial highlights and an
 * optional gold-dust particle layer.
 */
export function DeepBg({
  dust = true,
  dustCount = 10,
  dustOpacity = 0.35,
  style,
  children,
}: DeepBgProps) {
  return (
    <View style={[styles.root, style]} pointerEvents="box-none">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="deep-terre" cx="30%" cy="15%" rx="80%" ry="70%">
            <Stop offset="0%" stopColor={COLORS.terre} stopOpacity={0.1} />
            <Stop offset="50%" stopColor={COLORS.terre} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="deep-or" cx="80%" cy="85%" rx="80%" ry="70%">
            <Stop offset="0%" stopColor={COLORS.or} stopOpacity={0.08} />
            <Stop offset="50%" stopColor={COLORS.or} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={COLORS.bg} />
        <Rect width="100%" height="100%" fill="url(#deep-terre)" />
        <Rect width="100%" height="100%" fill="url(#deep-or)" />
      </Svg>
      {dust && <GoldDust count={dustCount} opacity={dustOpacity} />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
});
