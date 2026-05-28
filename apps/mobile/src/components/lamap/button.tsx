import { COLORS, FONT_WEIGHTS, RADII, useTheme } from "@/design";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export type LamapButtonVariant =
  | "primary"
  | "light"
  | "ghost"
  | "gold"
  | "accent"
  | "ember"
  | "dark";

interface LamapButtonProps {
  title: string;
  onPress: () => void;
  variant?: LamapButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * LaMap pill button.
 *
 * `primary` / `light` / `ghost` are the original (legacy) recipes — kept
 * byte-identical so already-approved screens (welcome) don't shift.
 * `gold` / `accent` / `ember` / `dark` are the themed Arcade variants pulled
 * from the active palette via `useTheme()`. Gradient variants (primary, gold,
 * accent, ember) carry a sweeping shine; gold & primary loop it.
 */
export function LamapButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
  style,
  accessibilityLabel,
  accessibilityHint,
}: LamapButtonProps) {
  const theme = useTheme();

  const hasGradient =
    variant === "primary" ||
    variant === "gold" ||
    variant === "accent" ||
    variant === "ember";
  const shines = variant === "primary" || variant === "gold";

  const gradientColors: [string, string, ...string[]] =
    variant === "gold"
      ? [theme.goldBright, theme.gold, theme.goldDeep]
      : variant === "accent"
        ? [theme.accentBright, theme.accent, theme.accentDeep]
        : variant === "ember"
          ? [theme.emberBright, theme.ember, theme.emberDeep]
          : ["#C95048", "#A93934"]; // primary (legacy)

  const labelColor =
    variant === "gold"
      ? "#1F1810"
      : variant === "light"
        ? COLORS.ink
        : COLORS.cream;

  const wrapStyles: ViewStyle[] = [styles.wrap];
  if (variant === "primary") wrapStyles.push(styles.wrapPrimary);
  else if (variant === "light") wrapStyles.push(styles.wrapLight);
  else if (variant === "ghost") wrapStyles.push(styles.wrapGhost);
  else if (variant === "dark")
    wrapStyles.push({
      backgroundColor: theme.surfaceDeep,
      borderWidth: 1,
      borderColor: theme.hairline,
    });
  else
    // gold / accent / ember
    wrapStyles.push({
      shadowColor: variant === "gold" ? theme.gold : "#000",
      shadowOpacity: variant === "gold" ? 0.4 : 0.35,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    });

  const [width, setWidth] = useState(0);
  const shineProgress = useSharedValue(0);

  useEffect(() => {
    if (!shines || width === 0) return;
    shineProgress.value = withDelay(
      1500,
      withRepeat(
        withTiming(1, { duration: 4000, easing: Easing.linear }),
        -1,
        false,
      ),
    );
  }, [shines, width, shineProgress]);

  const shineStyle = useAnimatedStyle(() => {
    const tx = interpolate(
      shineProgress.value,
      [0, 0.6, 1],
      [-1.1 * width, 2.2 * width, 2.2 * width],
      Extrapolation.CLAMP,
    );
    return { transform: [{ translateX: tx }, { skewX: "-15deg" }] };
  });

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w !== width) setWidth(w);
  };

  return (
    <Pressable
      onPress={onPress}
      onLayout={shines ? onLayout : undefined}
      disabled={disabled || loading}
      style={({ pressed }) => [
        ...wrapStyles,
        (pressed || disabled) && { opacity: disabled ? 0.5 : 0.92 },
        pressed && { transform: [{ scale: 0.98 }] },
        ...(Array.isArray(style) ? style : style ? [style] : []),
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
    >
      {hasGradient && (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: RADII.pill }]}
        />
      )}
      <View style={styles.inner}>
        {loading ? (
          <ActivityIndicator color={labelColor} />
        ) : (
          <>
            {icon}
            <Text style={[styles.label as TextStyle, { color: labelColor }]}>
              {title}
            </Text>
          </>
        )}
      </View>
      {shines && width > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, shineStyle]}
        >
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.35)", "transparent"]}
            locations={[0.3, 0.5, 0.7]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: RADII.pill,
    minHeight: 56,
    overflow: "hidden",
  },
  wrapPrimary: {
    shadowColor: COLORS.terre,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  wrapLight: {
    backgroundColor: COLORS.cream,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  wrapGhost: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "rgba(201, 168, 118, 0.4)",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56,
  },
  label: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 16,
    letterSpacing: -0.1,
  },
});
