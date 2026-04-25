import { COLORS, FONT_WEIGHTS, RADII } from "@/design";
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

export type LamapButtonVariant = "primary" | "light" | "ghost";

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
 * LaMap pill button — ports `tokens.css` btn-primary / btn-light / btn-ghost.
 *
 * Primary variant carries a sweeping shine highlight (`lamap-shine`): a soft
 * white band travels from left to right across the button every 4s with a
 * 1.5s initial delay, mirroring the CSS keyframes in tokens.css:75-78.
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
  const isPrimary = variant === "primary";
  const isLight = variant === "light";
  const isGhost = variant === "ghost";

  const labelColor = isLight ? COLORS.ink : COLORS.cream;
  const wrapStyles: ViewStyle[] = [styles.wrap];

  if (isPrimary) wrapStyles.push(styles.wrapPrimary);
  if (isLight) wrapStyles.push(styles.wrapLight);
  if (isGhost) wrapStyles.push(styles.wrapGhost);

  const [width, setWidth] = useState(0);
  const shineProgress = useSharedValue(0);

  useEffect(() => {
    if (!isPrimary || width === 0) return;
    shineProgress.value = withDelay(
      1500,
      withRepeat(
        withTiming(1, { duration: 4000, easing: Easing.linear }),
        -1,
        false,
      ),
    );
  }, [isPrimary, width, shineProgress]);

  const shineStyle = useAnimatedStyle(() => {
    // 0 → 0.6 of the cycle: sweep from off-left to off-right; remainder holds.
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
      onLayout={isPrimary ? onLayout : undefined}
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
      {isPrimary && (
        <LinearGradient
          colors={["#C95048", "#A93934"]}
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
      {isPrimary && width > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, shineStyle]}
        >
          <LinearGradient
            colors={[
              "transparent",
              "rgba(255,255,255,0.35)",
              "transparent",
            ]}
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
