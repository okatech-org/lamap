import {
  CardHandSkia,
  type Card,
} from "@/components/game/card-hand-skia";
import { TableBg } from "@/components/lamap";
import { COLORS, FONT_WEIGHTS } from "@/design";
import { type CardLayout } from "@/hooks/use-settings";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LAYOUTS: { key: CardLayout; label: string }[] = [
  { key: "fan", label: "Éventail" },
  { key: "linear", label: "Linéaire" },
  { key: "compact", label: "Compact" },
];

const INITIAL_HAND: Card[] = [
  { id: "c1", suit: "hearts", rank: "7", playable: true },
  { id: "c2", suit: "spades", rank: "3", playable: true },
  { id: "c3", suit: "diamonds", rank: "10", playable: false },
  { id: "c4", suit: "clubs", rank: "5", playable: true },
  { id: "c5", suit: "hearts", rank: "8", playable: true },
];

export default function CardPocHandScreen() {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [layout, setLayout] = useState<CardLayout>("fan");

  // Live fan tuning
  const [fanSpacing, setFanSpacing] = useState(0.6);
  const [fanTilt, setFanTilt] = useState(5);

  // Mirrors the match screen: tap selects, tap-on-selected (or double-tap or
  // drag-to-zone) plays.
  const handleCardSelect = useCallback((card: Card) => {
    setSelectedCard(card);
  }, []);

  const handleCardPlay = useCallback((card: Card) => {
    setLastPlayed(card.id);
    setSelectedCard(null);
  }, []);

  const reset = useCallback(() => {
    setSelectedCard(null);
    setLastPlayed(null);
  }, []);

  const lastPlayedLabel = useMemo(() => {
    if (!lastPlayed) return null;
    const card = INITIAL_HAND.find((c) => c.id === lastPlayed);
    if (!card) return null;
    const suitChar = ({
      hearts: "♥",
      diamonds: "♦",
      clubs: "♣",
      spades: "♠",
    } as const)[card.suit];
    return `${card.rank} ${suitChar}`;
  }, [lastPlayed]);

  return (
    <View style={styles.root}>
      <TableBg dust />

      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={16}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.cream} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>POC #2 — Main de cartes</Text>
            <Text style={styles.subtitle}>
              Tape pour sélectionner • re-tape ou glisse pour jouer
            </Text>
          </View>
          <Pressable
            onPress={reset}
            hitSlop={16}
            style={styles.resetButton}
          >
            <Ionicons name="refresh" size={20} color={COLORS.cream} />
          </Pressable>
        </View>

        {/* Status pill + turn toggle */}
        <View style={styles.statusBar}>
          {lastPlayedLabel ? (
            <View style={styles.statusPill}>
              <Ionicons name="checkmark-circle" size={14} color={COLORS.or2} />
              <Text style={styles.statusText}>
                Dernière jouée : {lastPlayedLabel}
              </Text>
            </View>
          ) : selectedCard ? (
            <View style={styles.statusPill}>
              <Ionicons name="hand-left" size={14} color={COLORS.or2} />
              <Text style={styles.statusText}>
                Sélectionnée — re-tape ou glisse pour jouer
              </Text>
            </View>
          ) : (
            <View style={[styles.statusPill, styles.statusPillIdle]}>
              <Ionicons
                name="information-circle"
                size={14}
                color="rgba(245, 242, 237, 0.65)"
              />
              <Text style={[styles.statusText, styles.statusTextIdle]}>
                Tape une carte pour la sélectionner
              </Text>
            </View>
          )}

          <Pressable
            onPress={() => setIsMyTurn((v) => !v)}
            style={[styles.turnToggle, !isMyTurn && styles.turnToggleOff]}
          >
            <Ionicons
              name={isMyTurn ? "play" : "pause"}
              size={12}
              color={isMyTurn ? COLORS.or2 : "rgba(245,242,237,0.6)"}
            />
            <Text
              style={[
                styles.turnToggleText,
                !isMyTurn && styles.turnToggleTextOff,
              ]}
            >
              {isMyTurn ? "Mon tour" : "Pas mon tour"}
            </Text>
          </Pressable>
        </View>

        {/* Hand canvas — fills the rest */}
        <View style={styles.handContainer}>
          <CardHandSkia
            cards={INITIAL_HAND}
            isMyTurn={isMyTurn}
            onCardSelect={handleCardSelect}
            onCardDoubleTap={handleCardPlay}
            selectedCard={selectedCard}
            layout={layout}
            height={420}
            fanSpacingFactor={fanSpacing}
            fanTiltDeg={fanTilt}
          />
        </View>

        {/* Layout selector */}
        <View style={styles.layoutRow}>
          {LAYOUTS.map((l) => (
            <Pressable
              key={l.key}
              onPress={() => setLayout(l.key)}
              style={[
                styles.layoutChip,
                layout === l.key && styles.layoutChipActive,
              ]}
            >
              <Text
                style={[
                  styles.layoutChipText,
                  layout === l.key && styles.layoutChipTextActive,
                ]}
              >
                {l.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Live fan tuning (fan layout only) */}
        {layout === "fan" && (
          <View style={styles.tuneBar}>
            <Stepper
              label="Espace"
              value={fanSpacing.toFixed(2)}
              onMinus={() => setFanSpacing((v) => Math.max(0.4, +(v - 0.05).toFixed(2)))}
              onPlus={() => setFanSpacing((v) => Math.min(1.1, +(v + 0.05).toFixed(2)))}
            />
            <Stepper
              label="Tilt"
              value={`${fanTilt}°`}
              onMinus={() => setFanTilt((v) => Math.max(0, v - 1))}
              onPlus={() => setFanTilt((v) => Math.min(14, v + 1))}
            />
          </View>
        )}

        {/* Legend */}
        <View style={styles.legend}>
          <LegendRow
            icon="hand-left-outline"
            text="UX préservée : tap = sélection, re-tap = jouer (comme avant)"
          />
          <LegendRow
            icon="move-outline"
            text="Nouveau : glisse la carte vers la zone or pour la jouer"
          />
          <LegendRow
            icon="ban-outline"
            text="Le 10♦ est non-jouable : grisé, ni sélection ni drag"
          />
          <LegendRow
            icon="albums-outline"
            text="Layout respecté : Éventail / Linéaire / Compact (= réglage Settings)"
          />
          <LegendRow
            icon="sparkles-outline"
            text="Entrée animée en cascade + lift/glow or sur la sélection"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function LegendRow({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.legendRow}>
      <Ionicons name={icon} size={14} color={COLORS.or2} />
      <Text style={styles.legendRowText}>{text}</Text>
    </View>
  );
}

function Stepper({
  label,
  value,
  onMinus,
  onPlus,
}: {
  label: string;
  value: string;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <View style={styles.stepper}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <Pressable onPress={onMinus} hitSlop={8} style={styles.stepperBtn}>
        <Ionicons name="remove" size={18} color={COLORS.cream} />
      </Pressable>
      <Text style={styles.stepperValue}>{value}</Text>
      <Pressable onPress={onPlus} hitSlop={8} style={styles.stepperBtn}>
        <Ionicons name="add" size={18} color={COLORS.cream} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(245, 242, 237, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  resetButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(245, 242, 237, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 20,
    color: COLORS.cream,
  },
  subtitle: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 12,
    color: "rgba(245, 242, 237, 0.6)",
    marginTop: 2,
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  turnToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(166, 130, 88, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(166, 130, 88, 0.4)",
  },
  turnToggleOff: {
    backgroundColor: "rgba(245, 242, 237, 0.05)",
    borderColor: "rgba(245, 242, 237, 0.12)",
  },
  turnToggleText: {
    fontFamily: FONT_WEIGHTS.body.medium,
    fontSize: 11,
    color: COLORS.or2,
  },
  turnToggleTextOff: {
    color: "rgba(245, 242, 237, 0.6)",
  },
  statusPill: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(166, 130, 88, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(166, 130, 88, 0.4)",
  },
  statusPillIdle: {
    backgroundColor: "rgba(245, 242, 237, 0.05)",
    borderColor: "rgba(245, 242, 237, 0.12)",
  },
  statusText: {
    fontFamily: FONT_WEIGHTS.body.medium,
    fontSize: 12,
    color: COLORS.cream,
  },
  statusTextIdle: {
    color: "rgba(245, 242, 237, 0.75)",
  },
  handContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  layoutRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  layoutChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(245, 242, 237, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(245, 242, 237, 0.10)",
  },
  layoutChipActive: {
    backgroundColor: COLORS.terre,
    borderColor: COLORS.terre2,
  },
  layoutChipText: {
    fontFamily: FONT_WEIGHTS.body.medium,
    fontSize: 13,
    color: "rgba(245, 242, 237, 0.7)",
  },
  layoutChipTextActive: {
    color: COLORS.cream,
  },
  tuneBar: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(245, 242, 237, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(245, 242, 237, 0.12)",
  },
  stepperLabel: {
    fontFamily: FONT_WEIGHTS.body.medium,
    fontSize: 11,
    color: "rgba(245, 242, 237, 0.6)",
  },
  stepperBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(166, 130, 88, 0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepperValue: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 13,
    color: COLORS.cream,
    minWidth: 38,
    textAlign: "center",
  },
  legend: {
    margin: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(15, 22, 32, 0.55)",
    borderWidth: 1,
    borderColor: "rgba(166, 130, 88, 0.18)",
    gap: 8,
  },
  legendRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  legendRowText: {
    flex: 1,
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.cream,
  },
});
