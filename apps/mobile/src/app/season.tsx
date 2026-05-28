import { AppBackdrop, AppBar, Chip, LamapButton, SectionHeader } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Placeholder season data — the season backend doesn't exist yet.
const TIERS = [
  { tier: 24, label: "Dos « Cendre »", sub: "Variante émeraude · 1 dos", current: true, xp: 5000 },
  { tier: 25, label: "500 K · Kora bonus", sub: "Récompense monétaire", xp: 5500 },
  { tier: 26, label: "Cadre « Lauriers »", sub: "Cosmétique d'avatar", xp: 6000 },
  { tier: 30, label: "Titre « Phénix »", sub: "Surnom légendaire de saison", xp: 8000, hot: true },
];

export default function SeasonScreen() {
  const theme = useTheme();
  const s = makeStyles(theme);
  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop dust={12} embers={8} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AppBar title="Passe de saison" />
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={s.hero}>
            <LinearGradient
              colors={[theme.goldA(0.22), theme.surfA(0.6)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={s.eyebrow}>SAISON 04</Text>
            <Text style={s.heroTitle}>Cercle de Feu</Text>
            <Text style={s.heroSub}>17 jours restants · palier 23 / 50</Text>
            <View style={s.track}>
              <View style={s.fill} />
            </View>
            <View style={s.xpRow}>
              <Text style={s.xpMono}>2 150 / 5 000 XP</Text>
              <Text style={[s.xpMono, { color: theme.gold }]}>+580 XP cette semaine</Text>
            </View>
          </View>

          <SectionHeader title="Tes prochaines récompenses" />
          <View style={s.list}>
            {TIERS.map((t) => (
              <View
                key={t.tier}
                style={[
                  s.tierRow,
                  {
                    backgroundColor: t.current ? theme.goldA(0.14) : theme.surface,
                    borderColor: t.current ? theme.goldA(0.4) : theme.goldA(0.1),
                  },
                ]}
              >
                <View
                  style={[
                    s.tierBadge,
                    {
                      backgroundColor: t.current ? theme.gold : theme.surfA(0.6),
                      borderColor: t.current ? theme.goldBright : theme.goldA(0.15),
                    },
                  ]}
                >
                  <Text style={[s.tierNum, { color: t.current ? "#1F1810" : theme.creamA(0.45) }]}>
                    {t.tier}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={s.tierLabel}>{t.label}</Text>
                    {t.hot ? <Chip tone="ember">Final</Chip> : null}
                  </View>
                  <Text style={s.tierSub}>{t.sub}</Text>
                </View>
                <Text style={[s.tierXp, { color: t.current ? theme.goldBright : theme.creamA(0.4) }]}>
                  {t.current ? "↑ ICI" : `${t.xp.toLocaleString("fr-FR")} XP`}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            <LamapButton title="⭐ Passer au Passe Or — 4 500 K" variant="gold" onPress={() => {}} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    hero: {
      margin: 20,
      marginTop: 8,
      padding: 20,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.goldA(0.4),
      overflow: "hidden",
    },
    eyebrow: {
      fontFamily: FONT_WEIGHTS.mono.semibold,
      fontSize: 10,
      letterSpacing: 2.4,
      color: theme.gold,
      marginBottom: 8,
    },
    heroTitle: {
      fontFamily: FONT_WEIGHTS.display.extrabold,
      fontSize: 30,
      letterSpacing: -0.7,
      color: theme.cream,
    },
    heroSub: {
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 13,
      color: theme.creamA(0.6),
      marginTop: 8,
    },
    track: {
      height: 6,
      borderRadius: 99,
      backgroundColor: theme.goldA(0.15),
      marginTop: 14,
      overflow: "hidden",
    },
    fill: { height: "100%", width: "46%", borderRadius: 99, backgroundColor: theme.gold },
    xpRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
    xpMono: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 9, color: theme.creamA(0.6) },
    list: { paddingHorizontal: 20, gap: 10, paddingTop: 4 },
    tierRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
    tierBadge: {
      width: 44,
      height: 44,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    tierNum: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 14 },
    tierLabel: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 14, color: theme.cream },
    tierSub: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 11, color: theme.creamA(0.55), marginTop: 2 },
    tierXp: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 9 },
  });
}
