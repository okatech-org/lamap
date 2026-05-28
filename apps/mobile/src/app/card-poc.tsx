import { PlayingCard } from "@/components/game/playing-card";
import { PlayingCardSkia } from "@/components/game/playing-card-skia";
import { TableBg } from "@/components/lamap";
import { COLORS, FONT_WEIGHTS } from "@/design";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Suit = "hearts" | "diamonds" | "clubs" | "spades";
type Rank = "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
type CardState = "playable" | "disabled" | "selected" | "played";

const STATES: CardState[] = ["playable", "selected", "disabled", "played"];
const SUITS: Suit[] = ["hearts", "spades", "diamonds", "clubs"];
const RANKS: Rank[] = ["3", "4", "5", "6", "7", "8", "9", "10"];

const STATE_LABELS: Record<CardState, string> = {
  playable: "Jouable",
  selected: "Sélectionnée",
  disabled: "Désactivée",
  played: "Jouée",
};

const SUIT_LABELS: Record<Suit, string> = {
  hearts: "♥",
  spades: "♠",
  diamonds: "♦",
  clubs: "♣",
};

export default function CardPocScreen() {
  const router = useRouter();
  const [state, setState] = useState<CardState>("playable");
  const [suit, setSuit] = useState<Suit>("hearts");
  const [rank, setRank] = useState<Rank>("7");
  const [face, setFace] = useState<"front" | "back">("front");

  return (
    <View style={styles.root}>
      <TableBg dust />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

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
            <Text style={styles.title}>POC — Carte Skia</Text>
            <Text style={styles.subtitle}>
              Touche la carte Skia et glisse pour tilter
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Side-by-side comparison */}
          <View style={styles.compareRow}>
            <View style={styles.cardColumn}>
              <Text style={styles.cardLabel}>Actuelle (View + SVG)</Text>
              <View style={styles.cardSlot}>
                <PlayingCard
                  suit={suit}
                  rank={rank}
                  state={state}
                  size="xl"
                  onPress={() => {}}
                />
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Rendu</Text>
                <Text style={styles.metricValue}>RN Views</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Effets</Text>
                <Text style={styles.metricValue}>scale + shadow</Text>
              </View>
            </View>

            <View style={styles.cardColumn}>
              <Text style={[styles.cardLabel, styles.cardLabelHot]}>
                Skia (GPU)
              </Text>
              <View style={styles.cardSlot}>
                <PlayingCardSkia
                  suit={suit}
                  rank={rank}
                  state={state}
                  face={face}
                  size="xl"
                />
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Rendu</Text>
                <Text style={styles.metricValue}>Skia/GPU</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Effets</Text>
                <Text style={styles.metricValue}>
                  glow • sheen • tilt 3D
                </Text>
              </View>
            </View>
          </View>

          {/* Hint */}
          <View style={styles.hint}>
            <Ionicons
              name="finger-print"
              size={16}
              color={COLORS.or2}
            />
            <Text style={styles.hintText}>
              Glisse le doigt sur la carte Skia pour voir le tilt 3D et la
              réflexion holographique bouger en parallaxe.
            </Text>
          </View>

          {/* Controls */}
          <View style={styles.controlsBlock}>
            <Text style={styles.controlsTitle}>État</Text>
            <View style={styles.chipRow}>
              {STATES.map((s) => (
                <Chip
                  key={s}
                  active={state === s}
                  label={STATE_LABELS[s]}
                  onPress={() => setState(s)}
                />
              ))}
            </View>
          </View>

          <View style={styles.controlsBlock}>
            <Text style={styles.controlsTitle}>Face</Text>
            <View style={styles.chipRow}>
              <Chip
                active={face === "front"}
                label="Face"
                onPress={() => setFace("front")}
              />
              <Chip
                active={face === "back"}
                label="Dos (flip)"
                onPress={() => setFace("back")}
              />
              <Text style={styles.faceNote}>
                (uniquement la carte Skia anime un vrai flip 3D)
              </Text>
            </View>
          </View>

          <View style={styles.controlsBlock}>
            <Text style={styles.controlsTitle}>Couleur</Text>
            <View style={styles.chipRow}>
              {SUITS.map((s) => (
                <Chip
                  key={s}
                  active={suit === s}
                  label={`${SUIT_LABELS[s]}`}
                  onPress={() => setSuit(s)}
                />
              ))}
            </View>
          </View>

          <View style={styles.controlsBlock}>
            <Text style={styles.controlsTitle}>Rang</Text>
            <View style={styles.chipRow}>
              {RANKS.map((r) => (
                <Chip
                  key={r}
                  active={rank === r}
                  label={r}
                  onPress={() => setRank(r)}
                />
              ))}
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Ce que ce POC démontre</Text>
            <LegendRow
              icon="aperture-outline"
              text="Halo lumineux pulsant autour des cartes jouables"
            />
            <LegendRow
              icon="contrast-outline"
              text="Reflet holographique qui suit le doigt"
            />
            <LegendRow
              icon="layers-outline"
              text="Dégradé crème + bordure or rendus en un seul layer GPU"
            />
            <LegendRow
              icon="sync-outline"
              text="Flip 3D avec perspective (face → dos)"
            />
            <LegendRow
              icon="scan-outline"
              text="Tilt 3D au geste, ombres dynamiques"
            />
            <Text style={styles.legendNote}>
              Si tout ça te convainc, on étend à : effets de particules à la
              levée, glow par rareté de carte (skins premium), shaders pour les
              koras, et animations Rive pour victoire/défaite.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
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
      <Ionicons name={icon} size={16} color={COLORS.or2} />
      <Text style={styles.legendRowText}>{text}</Text>
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
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 20,
  },
  compareRow: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 8,
  },
  cardColumn: {
    flex: 1,
    backgroundColor: "rgba(15, 22, 32, 0.45)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(166, 130, 88, 0.18)",
    gap: 8,
  },
  cardLabel: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "rgba(245, 242, 237, 0.55)",
  },
  cardLabelHot: {
    color: COLORS.or2,
  },
  cardSlot: {
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  metricLabel: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 11,
    color: "rgba(245, 242, 237, 0.5)",
  },
  metricValue: {
    fontFamily: FONT_WEIGHTS.body.medium,
    fontSize: 11,
    color: COLORS.cream,
  },
  hint: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    backgroundColor: "rgba(166, 130, 88, 0.10)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(166, 130, 88, 0.25)",
  },
  hintText: {
    flex: 1,
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.cream,
  },
  controlsBlock: {
    gap: 8,
  },
  controlsTitle: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "rgba(245, 242, 237, 0.55)",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(245, 242, 237, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(245, 242, 237, 0.10)",
  },
  chipActive: {
    backgroundColor: COLORS.terre,
    borderColor: COLORS.terre2,
  },
  chipText: {
    fontFamily: FONT_WEIGHTS.body.medium,
    fontSize: 13,
    color: COLORS.cream,
  },
  chipTextActive: {
    color: COLORS.cream,
  },
  faceNote: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 10,
    color: "rgba(245, 242, 237, 0.4)",
    flexShrink: 1,
  },
  legend: {
    backgroundColor: "rgba(15, 22, 32, 0.55)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(166, 130, 88, 0.18)",
    gap: 10,
  },
  legendTitle: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 14,
    color: COLORS.cream,
    marginBottom: 4,
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
    lineHeight: 18,
    color: COLORS.cream,
  },
  legendNote: {
    marginTop: 8,
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 11,
    lineHeight: 16,
    fontStyle: Platform.OS === "ios" ? "italic" : "normal",
    color: "rgba(245, 242, 237, 0.55)",
  },
});
