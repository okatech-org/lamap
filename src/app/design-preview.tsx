/**
 * TEMPORARY route — Phase 1 foundation smoke test.
 * Delete this file (and the link from welcome.tsx) before committing the phase.
 */
import { CardBack } from "@/components/game/card-back";
import { PlayingCard } from "@/components/game/playing-card";
import {
  Avatar,
  Divider,
  FlipCard,
  GoldDust,
  MancheDots,
  RankBadge,
  Sparks,
  TableBg,
} from "@/components/lamap";
import { COLORS, FONT_WEIGHTS, RANKS } from "@/design";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Suit = "hearts" | "diamonds" | "clubs" | "spades";
type Rank = "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
type Size = "small" | "medium" | "large" | "xl" | "xxl";

const CARD_SIZES: Size[] = ["small", "medium", "large", "xl", "xxl"];
const SAMPLE_FACES: { rank: Rank; suit: Suit }[] = [
  { rank: "7", suit: "hearts" },
  { rank: "10", suit: "spades" },
  { rank: "5", suit: "diamonds" },
  { rank: "3", suit: "clubs" },
  { rank: "9", suit: "hearts" },
];

export default function DesignPreview() {
  const router = useRouter();
  const [flipped, setFlipped] = useState(false);
  const [sparkBurst, setSparkBurst] = useState(0);

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.h1}>LaMap — Foundation</Text>
            <Text style={styles.body}>Phase 1 primitives smoke test</Text>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backText}>← Retour</Text>
            </Pressable>
          </View>

          <Section label="Typography">
            <Text style={[styles.body, { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 40, color: COLORS.cream }]}>
              Bricolage 800
            </Text>
            <Text style={[styles.body, { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 24, color: COLORS.cream }]}>
              Bricolage 700
            </Text>
            <Text style={[styles.body, { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 14, color: COLORS.cream }]}>
              Inter 400 — corps de texte sobre.
            </Text>
            <Text style={[styles.body, { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 12, color: COLORS.or2, letterSpacing: 1.5 }]}>
              MONO · MANCHE · LABELS
            </Text>
            <Text style={[styles.body, { fontFamily: FONT_WEIGHTS.card.bold, fontSize: 28, color: COLORS.terre }]}>
              Crimson 7♥
            </Text>
          </Section>

          <Section label="Cartes — face (PlayingCard existant + Crimson Pro)">
            <View style={styles.row}>
              {CARD_SIZES.map((s, i) => (
                <PlayingCard
                  key={s}
                  size={s}
                  rank={SAMPLE_FACES[i % SAMPLE_FACES.length].rank}
                  suit={SAMPLE_FACES[i % SAMPLE_FACES.length].suit}
                  state="played"
                />
              ))}
            </View>
          </Section>

          <Section label="Cartes — dos (arcade : lozenges or + monogramme LM)">
            <View style={styles.row}>
              {CARD_SIZES.map((s) => (
                <CardBack key={s} size={s} />
              ))}
            </View>
          </Section>

          <Section label="FlipCard (tap pour retourner)">
            <Pressable
              onPress={() => setFlipped((f) => !f)}
              style={{ alignSelf: "flex-start" }}
            >
              <FlipCard rank="7" suit="spades" size="large" flipped={flipped} />
            </Pressable>
            <Text style={[styles.caption, { marginTop: 8 }]}>
              {flipped ? "face → tap pour cacher" : "dos → tap pour révéler"}
            </Text>
          </Section>

          <Section label="Avatars">
            <View style={styles.row}>
              <Avatar initials="LG" size={32} />
              <Avatar initials="LG" size={48} />
              <Avatar initials="OK" size={64} />
              <Avatar initials="ZX" size={88} />
            </View>
          </Section>

          <Section label="Manche dots">
            <MancheDots current={0} won={[]} />
            <MancheDots current={2} won={[0]} />
            <MancheDots current={4} won={[0, 2, 3]} />
          </Section>

          <Section label="Rangs (6 paliers)">
            <View style={[styles.row, { alignItems: "flex-start" }]}>
              {RANKS.map((r, i) => (
                <RankBadge
                  key={r.short}
                  rank={r.name}
                  size={56}
                  showName
                  points={1200 + i * 250}
                />
              ))}
            </View>
          </Section>

          <Section label="Divider">
            <Divider />
          </Section>

          <Section label="TableBg + GoldDust">
            <View style={styles.tablePreview}>
              <TableBg>
                <View style={styles.tableContent}>
                  <Avatar initials="LG" size={40} />
                  <Text style={[styles.body, { marginTop: 12, color: COLORS.cream }]}>
                    Table de jeu
                  </Text>
                </View>
              </TableBg>
            </View>
          </Section>

          <Section label="Sparks (tap pour rejouer)">
            <Pressable
              onPress={() => setSparkBurst((n) => n + 1)}
              style={styles.sparkButton}
            >
              <Text style={[styles.body, { color: COLORS.cream }]}>
                Bouffée de confettis
              </Text>
            </Pressable>
            <View style={styles.sparkArea}>
              <GoldDust count={6} opacity={0.4} />
              <Sparks trigger={sparkBurst} />
            </View>
          </Section>

          <View style={{ height: 64 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    gap: 4,
  },
  h1: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 28,
    color: COLORS.cream,
    letterSpacing: -0.5,
  },
  body: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 14,
    color: COLORS.cream,
    opacity: 0.85,
  },
  caption: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 12,
    color: COLORS.cream,
    opacity: 0.6,
  },
  backBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.hairlineStrong,
  },
  backText: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 13,
    color: COLORS.cream,
  },
  section: {
    marginBottom: 28,
  },
  label: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 11,
    letterSpacing: 1.5,
    color: COLORS.or2,
    marginBottom: 12,
  },
  sectionBody: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  tablePreview: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
  },
  tableContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: COLORS.terre,
  },
  sparkArea: {
    height: 220,
    backgroundColor: COLORS.bg2,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
});
