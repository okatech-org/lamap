import { Spacing } from '@/constants/spacing';
import { useColors } from '@/hooks/useColors';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated';
  style?: ViewStyle | ViewStyle[];
  padding?: number;
}

/**
 * Card Component
 * Based on reference screens (Playing Board, Welcome)
 * - Background: #2D3E50
 * - Border Radius: 16px
 * - Padding: 20px
 * - Subtle shadow for depth
 */
export function Card({
  children,
  variant = 'default',
  style,
  padding = Spacing.card.horizontal,
}: CardProps) {
  const colors = useColors();

  const cardStyles: ViewStyle[] = [
    styles.base,
    {
      backgroundColor: colors.card,
      padding: padding,
    },
    variant === 'elevated' ? styles.elevated : {},
    ...(Array.isArray(style) ? style : style ? [style] : []),
  ];

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,  // Reference: Playing board cards
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
