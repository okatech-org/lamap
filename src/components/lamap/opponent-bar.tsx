import { CardBack } from "@/components/game/card-back";
import { COLORS, FONT_WEIGHTS } from "@/design";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "./avatar";

interface LamapOpponentBarProps {
  name: string;
  cardsRemaining: number;
  hasHand?: boolean;
  initials?: string;
}

/**
 * Opponent identity row shown above the play area: avatar + name + optional
 * "À LA MAIN" gold chip + face-down fanned hand of remaining cards.
 */
export function LamapOpponentBar({
  name,
  cardsRemaining,
  hasHand = false,
  initials,
}: LamapOpponentBarProps) {
  const computedInitials =
    initials ??
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const cards = Math.max(0, Math.min(cardsRemaining, 5));

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Avatar initials={computedInitials} size={36} />
        <View>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {hasHand ? (
            <View style={styles.chip}>
              <Text style={styles.chipGlyph}>♔</Text>
              <Text style={styles.chipText}>À LA MAIN</Text>
            </View>
          ) : null}
        </View>
      </View>
      <View style={styles.hand}>
        {Array.from({ length: cards }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.handCard,
              {
                marginLeft: i === 0 ? 0 : -22,
                transform: [{ rotate: `${(i - (cards - 1) / 2) * 4}deg` }],
              },
            ]}
          >
            <CardBack size="small" />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  name: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 14,
    color: COLORS.cream,
    letterSpacing: -0.2,
  },
  chip: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "rgba(166, 130, 88, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(201, 168, 118, 0.35)",
  },
  chipGlyph: {
    fontSize: 10,
    color: COLORS.or2,
  },
  chipText: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 9,
    color: COLORS.or2,
    letterSpacing: 1,
  },
  hand: {
    flexDirection: "row",
    alignItems: "center",
  },
  handCard: {
    // CardBack(small) renders 32x44.8 — slight overlap via marginLeft above.
  },
});
