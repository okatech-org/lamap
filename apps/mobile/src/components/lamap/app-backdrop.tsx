import { useTheme } from "@/design";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from "react-native-svg";
import { Embers } from "./embers";
import { GoldDust } from "./gold-dust";

interface AppBackdropProps {
  /** `app` = bg-app gradient · `velvet` = bg-velvet (cinematic). */
  variant?: "app" | "velvet";
  dust?: number;
  dustOpacity?: number;
  embers?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}

/**
 * Themed full-screen backdrop for the redesigned (Arcade) screens — ports
 * `--bg-app` / `--bg-velvet` from the handoff `tokens.css` and reads the active
 * palette via `useTheme()`, so it restyles when the player switches themes.
 *
 * New component on purpose: the legacy `DeepBg` stays untouched so already
 * approved screens don't change. Reskinned screens opt into this one.
 */
export function AppBackdrop({
  variant = "app",
  dust = 10,
  dustOpacity = 0.3,
  embers = 0,
  style,
  children,
}: AppBackdropProps) {
  const theme = useTheme();
  const id = `${theme.id}-${variant}`;
  const stops = variant === "velvet" ? theme.bgVelvet.stops : theme.bgApp.stops;

  return (
    <View style={[styles.root, style]} pointerEvents="box-none">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          {variant === "velvet" ? (
            <LinearGradient id={`bg-${id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={stops[0]} />
              <Stop offset="1" stopColor={stops[1]} />
            </LinearGradient>
          ) : (
            <LinearGradient id={`bg-${id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={stops[0]} />
              <Stop offset="0.6" stopColor={stops[1]} />
              <Stop offset="1" stopColor={stops[2]} />
            </LinearGradient>
          )}
          <RadialGradient id={`glow-top-${id}`} cx="30%" cy="6%" rx="72%" ry="55%">
            <Stop offset="0" stopColor={theme.accentGlow} stopOpacity={0.16} />
            <Stop offset="0.6" stopColor={theme.accentGlow} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id={`glow-bot-${id}`} cx="78%" cy="100%" rx="80%" ry="60%">
            <Stop offset="0" stopColor={theme.gold} stopOpacity={0.06} />
            <Stop offset="0.6" stopColor={theme.gold} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#bg-${id})`} />
        <Rect width="100%" height="100%" fill={`url(#glow-top-${id})`} />
        <Rect width="100%" height="100%" fill={`url(#glow-bot-${id})`} />
      </Svg>
      {dust > 0 && (
        <GoldDust count={dust} opacity={dustOpacity} color={theme.goldBright} />
      )}
      {embers > 0 && <Embers count={embers} />}
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
