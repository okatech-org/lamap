import { COLORS, FONT_WEIGHTS } from "@/design";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

interface LamapTabPillRowProps<T extends string> {
  options: readonly { id: T; label: string; disabled?: boolean }[];
  selected: T;
  onSelect: (id: T) => void;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Horizontal row of pill tabs. Selected = terre filled, others = surface +
 * gold hairline. Used by leaderboard filters and shop tabs.
 */
export function LamapTabPillRow<T extends string>({
  options,
  selected,
  onSelect,
  style,
}: LamapTabPillRowProps<T>) {
  return (
    <View
      style={[
        styles.row,
        ...(Array.isArray(style) ? style : style ? [style] : []),
      ]}
    >
      {options.map((opt) => {
        const isSelected = opt.id === selected;
        const interactive = !opt.disabled && !isSelected;
        const Wrap: React.ElementType = interactive ? Pressable : View;
        return (
          <Wrap
            key={opt.id}
            onPress={interactive ? () => onSelect(opt.id) : undefined}
            style={({ pressed }: { pressed?: boolean }) => [
              styles.pill,
              isSelected ? styles.pillSelected : styles.pillIdle,
              opt.disabled && { opacity: 0.5 },
              pressed && interactive && { transform: [{ scale: 0.98 }] },
            ]}
            accessibilityRole={interactive ? "button" : undefined}
            accessibilityLabel={opt.label}
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              style={[
                styles.label,
                isSelected ? styles.labelSelected : styles.labelIdle,
              ]}
            >
              {opt.label}
            </Text>
          </Wrap>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pillSelected: {
    backgroundColor: COLORS.terre,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  pillIdle: {
    backgroundColor: "rgba(46, 61, 77, 0.5)",
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  label: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 12,
  },
  labelSelected: {
    color: COLORS.cream,
  },
  labelIdle: {
    color: "rgba(245, 242, 237, 0.65)",
  },
});
