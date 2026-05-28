import { PlayingCard } from "@/components/game/playing-card";
import { AppBackdrop, AppBar, Chip, LamapButton } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Stub gallery — cosmetic card variants. Wiring to owned cosmetics comes later.
const VARIANTS = [
  { id: 0, label: "Standard", sub: "Base", rarity: "COMMUN", glow: "#8A95A3", owned: true },
  { id: 1, label: "Holographique", sub: "Foil", rarity: "RARE", glow: "#5AA3C9", owned: true },
  { id: 2, label: "Or fauve", sub: "24K", rarity: "ÉPIQUE", glow: "#E8C879", owned: true },
  { id: 3, label: "Maison Bandi", sub: "Légende", rarity: "LÉGENDAIRE", glow: "#B58BE2", owned: false },
];

export default function InspectScreen() {
  const theme = useTheme();
  const s = makeStyles(theme);
  const [variant, setVariant] = useState(2);
  const v = VARIANTS[variant];

  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop variant="velvet" dust={14} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AppBar title="7 de Cœurs" right={<Chip tone="gold">★ {v.rarity}</Chip>} />

        <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          <View style={s.cardStage}>
            <View style={[s.glow, { backgroundColor: `${v.glow}30` }]} />
            <View style={[s.cardShadow, { shadowColor: v.glow, opacity: v.owned ? 1 : 0.5 }]}>
              <PlayingCard rank="7" suit="hearts" state="selected" size="2xl" />
            </View>
            <Text style={s.label}>{v.label}</Text>
            <Text style={s.sub}>« {v.sub} »</Text>
          </View>

          <View style={s.variantsHeader}>
            <Text style={s.variantsTitle}>Variantes</Text>
            <Text style={s.variantsCount}>
              {VARIANTS.filter((x) => x.owned).length} / {VARIANTS.length}
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.variantsRow}>
            {VARIANTS.map((vv, i) => {
              const selected = i === variant;
              return (
                <Pressable
                  key={vv.id}
                  onPress={() => setVariant(i)}
                  style={[
                    s.variantCard,
                    {
                      backgroundColor: selected ? `${vv.glow}25` : theme.surfA(0.6),
                      borderColor: selected ? vv.glow : theme.goldA(0.12),
                    },
                  ]}
                >
                  <View style={{ opacity: vv.owned ? 1 : 0.4 }}>
                    <PlayingCard rank="7" suit="hearts" state="played" size="small" />
                  </View>
                  <Text style={[s.variantRarity, { color: vv.glow }]}>{vv.rarity}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </ScrollView>

        <View style={s.footer}>
          <LamapButton
            title={v.owned ? "✓ Équiper" : "Acheter · ◆ 1 200 K"}
            variant={v.owned ? "accent" : "gold"}
            onPress={() => {}}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    cardStage: { alignItems: "center", paddingTop: 20, gap: 14 },
    glow: { position: "absolute", top: 30, width: 240, height: 300, borderRadius: 30 },
    cardShadow: {
      shadowOpacity: 0.5,
      shadowRadius: 40,
      shadowOffset: { width: 0, height: 20 },
      elevation: 16,
    },
    label: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 22, color: theme.cream, marginTop: 8 },
    sub: { fontFamily: FONT_WEIGHTS.body.regular, fontStyle: "italic", fontSize: 12, color: theme.creamA(0.55) },
    variantsHeader: {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      marginTop: 28,
      marginBottom: 10,
    },
    variantsTitle: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 15, color: theme.cream },
    variantsCount: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 9, color: theme.creamA(0.5) },
    variantsRow: { paddingHorizontal: 20, gap: 8 },
    variantCard: { padding: 8, borderRadius: 12, borderWidth: 1, alignItems: "center", gap: 4, width: 84 },
    variantRarity: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 7, letterSpacing: 1 },
    footer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 28,
    },
  });
}
