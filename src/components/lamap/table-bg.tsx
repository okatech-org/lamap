import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Svg, {
  Defs,
  Ellipse,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { GoldDust } from "./gold-dust";

interface TableBgProps {
  children?: React.ReactNode;
  dust?: boolean;
  style?: ViewStyle;
}

/**
 * Card-table backdrop: blue radial gradient + concentric arena rings + optional
 * gold-dust particles. Designed to fill an absolute-positioned area.
 */
export function TableBg({ children, dust = true, style }: TableBgProps) {
  return (
    <View style={[styles.layer, style]}>
      <LinearGradient
        colors={["#3F5567", "#2C3D4F", "#1F2C3B"]}
        locations={[0, 0.6, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Radial highlights — RN doesn't have radial gradients on Views; SVG fills the gap. */}
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="tg-top" cx="50%" cy="35%" rx="70%" ry="60%">
            <Stop offset="0%" stopColor="#5A7A96" stopOpacity={0.45} />
            <Stop offset="60%" stopColor="#5A7A96" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="tg-bottom" cx="50%" cy="100%" rx="70%" ry="50%">
            <Stop offset="0%" stopColor="#2E3D4D" stopOpacity={0.8} />
            <Stop offset="70%" stopColor="#2E3D4D" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#tg-top)" />
        <Rect width="100%" height="100%" fill="url(#tg-bottom)" />
        {/* Arena rings — drawn as ellipses so they scale with the bg at any aspect ratio. */}
        <Ellipse
          cx="50%"
          cy="50%"
          rx="42%"
          ry="42%"
          stroke="rgba(201, 168, 118, 0.10)"
          strokeWidth={1}
          fill="none"
        />
        <Ellipse
          cx="50%"
          cy="50%"
          rx="30%"
          ry="30%"
          stroke="rgba(201, 168, 118, 0.08)"
          strokeWidth={1}
          fill="none"
        />
      </Svg>
      {dust && <GoldDust />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
});
