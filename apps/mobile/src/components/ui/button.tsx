import { Spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/use-colors";
import { getButtonShadow, getButtonShadowHover } from "@/utils/shadows";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "oauth";
  size?: "sm" | "default" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const BUTTON_SIZES = {
  sm: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 40,
    fontSize: 14,
  },
  default: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    minHeight: 48,
    fontSize: 16,
  },
  lg: {
    paddingVertical: 16,  // Reference: Welcome screen buttons
    paddingHorizontal: 24,
    minHeight: 56,        // Reference: 56px height
    fontSize: 16,
  },
};

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "default",
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle: customTextStyle,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const colors = useColors();
  const [isPressed, setIsPressed] = useState(false);

  const getButtonStyles = (): ViewStyle[] => {
    const shouldHaveShadow = variant !== "outline" && variant !== "ghost";

    const baseStyle: ViewStyle = {
      paddingVertical: BUTTON_SIZES[size].paddingVertical,
      paddingHorizontal: BUTTON_SIZES[size].paddingHorizontal,
      borderRadius: Spacing.radius.pill,  // Pill-shaped (999)
      alignItems: "center",
      justifyContent: "center",
      minHeight: BUTTON_SIZES[size].minHeight,
      ...typography.button,  // Use button typography
      ...(shouldHaveShadow ? getButtonShadow() : {}),
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: '#E86C5D',  // Red coral (reference: Facebook button)
      },
      secondary: {
        backgroundColor: '#FFFFFF',  // White (reference: Google button)
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 2,              // Thicker border
        borderColor: '#E86C5D',      // Red coral border
      },
      ghost: {
        backgroundColor: "transparent",
      },
      destructive: {
        backgroundColor: colors.destructive,
      },
      oauth: {
        backgroundColor: "#FFFFFF",
      },
    };

    return [
      baseStyle,
      variantStyles[variant] || variantStyles.primary,
      ...(disabled ? [{ opacity: 0.5 }] : []),
      ...(isPressed && shouldHaveShadow ? [getButtonShadowHover()] : []),
    ];
  };

  const getTextStyles = (): TextStyle[] => {
    const baseStyle: TextStyle = {
      ...typography.button,  // Use button typography
    };

    const variantTextStyles: Record<string, TextStyle> = {
      primary: {
        color: '#FFFFFF',  // White text on red button
      },
      secondary: {
        color: '#1C2A3A',  // Dark text on white button
      },
      outline: {
        color: '#E86C5D',  // Red text for outline button
      },
      ghost: {
        color: colors.foreground,
      },
      destructive: {
        color: colors.destructiveForeground,
      },
      oauth: {
        color: "#1A1A1A",
      },
    };

    return [
      baseStyle,
      variantTextStyles[variant] || variantTextStyles.primary,
      ...(disabled ? [{ opacity: 0.6 }] : []),
    ];
  };

  const buttonStyle = [
    ...getButtonStyles(),
    ...(Array.isArray(style) ? style
    : style ? [style]
    : []),
  ];

  const textStyle = [
    ...getTextStyles(),
    ...(Array.isArray(customTextStyle) ? customTextStyle
    : customTextStyle ? [customTextStyle]
    : []),
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
    >
      {loading ?
        <ActivityIndicator
          color={
            (
              variant === "primary" ||
              variant === "destructive" ||
              variant === "secondary"
            ) ?
              colors.primaryForeground
            : colors.primary
          }
        />
      : <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {icon}
          <Text style={textStyle}>{title}</Text>
        </View>
      }
    </TouchableOpacity>
  );
}
