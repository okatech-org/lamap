import { AppBackdrop, AppBar, LamapButton, SectionHeader } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COUNTDOWN = [
  { n: "02", l: "JOURS" },
  { n: "14", l: "HEURES" },
  { n: "32", l: "MIN" },
];

const FORMAT = [
  { label: "Entrée", value: "GRATUITE", accent: true },
  { label: "Inscrits", value: "248 / 512" },
  { label: "Élimination", value: "Directe" },
  { label: "Bonus de mise", value: "Sans" },
];

export default function TournamentDetailScreen() {
  const theme = useTheme();
  const s = makeStyles(theme);
  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop dust={14} embers={10} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AppBar title="Coupe du Vendredi" />
        <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          {/* Prize hero */}
          <View style={s.hero}>
            <LinearGradient
              colors={[theme.emberA(0.2), theme.goldA(0.15), "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={s.heroEyebrow}>★ LOT FIXE · GARANTI</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
              <View style={s.prizeBox}>
                <LinearGradient
                  colors={[theme.goldBright, theme.goldDeep]}
                  style={[StyleSheet.absoluteFill, { borderRadius: 18 }]}
                />
                <Text style={{ fontSize: 38 }}>📶</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.prizeTitle}>Forfait{"\n"}data 5 000 F</Text>
                <Text style={s.prizeSub}>Crédit téléphone Airtel ou Moov, livré sous 24 h</Text>
              </View>
            </View>
          </View>

          {/* Countdown */}
          <View style={s.countdown}>
            {COUNTDOWN.map((c, i) => (
              <React.Fragment key={c.l}>
                {i > 0 ? <Text style={s.colon}>:</Text> : null}
                <View style={{ alignItems: "center" }}>
                  <Text style={s.countNum}>{c.n}</Text>
                  <Text style={s.countLabel}>{c.l}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          <SectionHeader title="Format" />
          <View style={s.formatGrid}>
            {FORMAT.map((f) => (
              <View key={f.label} style={s.formatCell}>
                <Text style={s.formatLabel}>{f.label}</Text>
                <Text style={[s.formatValue, { color: f.accent ? theme.accentText : theme.cream }]}>
                  {f.value}
                </Text>
              </View>
            ))}
          </View>

          <View style={[s.legal, { backgroundColor: theme.accentA(0.12), borderColor: theme.accentA(0.3) }]}>
            <Text style={[s.legalTag, { color: theme.accentText }]}>★ POURQUOI C'EST LÉGAL</Text>
            <Text style={s.legalBody}>
              Entrée gratuite + lot fixe à l'avance — pas de pari, pas de cagnotte alimentée par les joueurs.
            </Text>
          </View>
        </ScrollView>

        <View style={s.footer}>
          <LamapButton title="S'inscrire gratuitement →" variant="gold" onPress={() => {}} />
        </View>
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
      padding: 22,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.emberA(0.45),
      overflow: "hidden",
    },
    heroEyebrow: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 10, letterSpacing: 2.2, color: theme.chipEmberColor, marginBottom: 12 },
    prizeBox: { width: 80, height: 80, borderRadius: 18, overflow: "hidden", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: theme.gold },
    prizeTitle: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 22, color: theme.cream, letterSpacing: -0.4, lineHeight: 24 },
    prizeSub: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 11, color: theme.creamA(0.6), marginTop: 6 },
    countdown: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      marginHorizontal: 20,
      marginBottom: 16,
      padding: 14,
      borderRadius: 14,
      backgroundColor: theme.surfA(0.65),
      borderWidth: 1,
      borderColor: theme.goldA(0.18),
    },
    colon: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 22, color: theme.goldA(0.4) },
    countNum: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 28, color: theme.cream, letterSpacing: -0.5 },
    countLabel: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 8, letterSpacing: 2, color: theme.gold, marginTop: 4 },
    formatGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: 20,
      marginBottom: 16,
      padding: 14,
      borderRadius: 14,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.goldA(0.1),
    },
    formatCell: { width: "50%", paddingVertical: 6 },
    formatLabel: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 7, letterSpacing: 1.6, color: theme.creamA(0.5) },
    formatValue: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 14, marginTop: 3 },
    legal: { marginHorizontal: 20, padding: 12, borderRadius: 12, borderWidth: 1 },
    legalTag: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 8, letterSpacing: 1.8, marginBottom: 4 },
    legalBody: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 11, lineHeight: 17, color: theme.creamA(0.7) },
    footer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 28,
      backgroundColor: theme.surfA(0.92),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.goldA(0.12),
    },
  });
}
