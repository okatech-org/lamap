import { Spacing } from "@/constants/spacing";
import { Typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";

interface BadgeProps {
  label: string;
  variant?: "kora" | "default" | "success" | "warning";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  label,
  variant = "default",
  style,
  textStyle,
}: BadgeProps) {
  const colors = useColors();
  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingVertical: 4,     // Slightly larger for better readability
      paddingHorizontal: 12,  // Wider padding
      borderRadius: Spacing.radius.pill,  // Pill-shaped
      alignItems: "center",
      justifyContent: "center",
    };

    const variantStyles: Record<string, ViewStyle> = {
      kora: {
        backgroundColor: '#F6AD55',  // Orange/gold (reference: Kora color)
      },
      default: {
        backgroundColor: '#374151',  // Muted dark gray
      },
      success: {
        backgroundColor: '#48BB78',  // Green
      },
      warning: {
        backgroundColor: '#E86C5D',  // Red coral
      },
    };

    return { ...baseStyle, ...variantStyles[variant] };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...Typography.small,   // Use new typography
      fontWeight: '600',     // Semibold for better visibility
    };

    const variantTextStyles: Record<string, TextStyle> = {
      kora: {
        color: '#1C2A3A',  // Dark text on orange background
      },
      default: {
        color: '#FFFFFF',  // White text on dark background
      },
      success: {
        color: '#FFFFFF',  // White text on green
      },
      warning: {
        color: '#FFFFFF',  // White text on red
      },
    };

    return { ...baseStyle, ...variantTextStyles[variant] };
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      <Text style={[getTextStyle(), textStyle]}>{label}</Text>
    </View>
  );
}
