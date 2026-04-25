import { COLORS, FONT_WEIGHTS, RADII } from "@/design";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

interface LamapModeTileProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  hot?: boolean;
  locked?: boolean;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Surface tile used in the home grid (IA / Privé / Mise / Tournoi). Supports
 * a `hot` red dot (top-right glow) and a `locked` greyed-out state. Interactive
 * when `onPress` is provided and not locked.
 */
export function LamapModeTile({
  icon,
  title,
  subtitle,
  hot = false,
  locked = false,
  onPress,
  style,
}: LamapModeTileProps) {
  const interactive = !!onPress && !locked;
  const baseStyle: ViewStyle[] = [
    styles.tile,
    ...(locked ? [{ opacity: 0.55 }] : []),
    ...(Array.isArray(style) ? style : style ? [style] : []),
  ];

  const body = (
    <>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {hot && <View style={styles.hotDot} />}
    </>
  );

  if (!interactive) {
    return <View style={baseStyle}>{body}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        ...baseStyle,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minHeight: 104,
    padding: 14,
    borderRadius: RADII.lg,
    backgroundColor: "rgba(46, 61, 77, 0.5)",
    borderWidth: 1,
    borderColor: COLORS.hairline,
    position: "relative",
  },
  icon: {
    marginBottom: 6,
    height: 28,
    justifyContent: "center",
  },
  title: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 16,
    color: COLORS.cream,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 11,
    color: "rgba(245, 242, 237, 0.5)",
    marginTop: 2,
  },
  hotDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.terre2,
    shadowColor: COLORS.terre2,
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
});
