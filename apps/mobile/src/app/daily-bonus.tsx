import { AppBackdrop, LamapButton } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Stub — daily-bonus streak backend not built yet.
const DAYS = [
  { d: 1, k: 100, done: true },
  { d: 2, k: 150, done: true },
  { d: 3, k: 200, done: true },
  { d: 4, k: 250, today: true },
  { d: 5, k: 300 },
  { d: 6, k: 400 },
  { d: 7, k: 600, big: true },
] as { d: number; k: number; done?: boolean; today?: boolean; big?: boolean }[];

export default function DailyBonusScreen() {
  const theme = useTheme();
  const router = useRouter();
  const s = makeStyles(theme);
  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false, presentation: "modal" }} />
      <AppBackdrop variant="velvet" dust={18} embers={12} />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={s.closeRow}>
          <Pressable style={s.close} onPress={() => router.back()}>
            <Ionicons name="close" size={18} color={theme.cream} />
          </Pressable>
        </View>

        <View style={s.header}>
          <Text style={s.eyebrow}>BONUS QUOTIDIEN · JOUR 4</Text>
          <Text style={s.title}>Bien revenu.</Text>
          <Text style={s.sub}>Encore 3 jours pour décrocher le gros lot du dimanche.</Text>
        </View>

        <View style={s.coinWrap}>
          <View style={s.coin}>
            <LinearGradient
              colors={[theme.goldBright, theme.gold, theme.goldDeep]}
              start={{ x: 0.3, y: 0 }}
              end={{ x: 0.7, y: 1 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 90 }]}
            />
            <Text style={s.coinValue}>+250</Text>
            <Text style={s.coinUnit}>KORA</Text>
          </View>
        </View>

        <View style={s.calendar}>
          <View style={s.calHeader}>
            <Text style={s.calLabel}>SÉRIE EN COURS</Text>
            <Text style={[s.calLabel, { color: theme.goldBright }]}>3 jours</Text>
          </View>
          <View style={s.calRow}>
            {DAYS.map((d) => {
              const bg = d.done
                ? theme.accentA(0.22)
                : d.today
                  ? theme.gold
                  : d.big
                    ? theme.goldA(0.15)
                    : theme.surfA(0.65);
              const border = d.done
                ? theme.accentA(0.45)
                : d.today
                  ? theme.goldBright
                  : d.big
                    ? theme.goldA(0.4)
                    : theme.goldA(0.12);
              const dayColor = d.today ? "#1F1810" : d.done ? theme.accentText : theme.creamA(0.5);
              const kColor = d.today ? "#1F1810" : d.big ? theme.goldBright : theme.cream;
              return (
                <View
                  key={d.d}
                  style={[
                    s.calCell,
                    { flex: d.big ? 1.5 : 1, backgroundColor: bg, borderColor: border },
                  ]}
                >
                  <Text style={[s.calDay, { color: dayColor }]}>J{d.d}</Text>
                  <Text style={[s.calK, { color: kColor }]}>{d.k}</Text>
                  {d.done ? (
                    <Ionicons name="checkmark" size={9} color={theme.accentText} style={s.calCheck} />
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>

        <View style={s.footer}>
          <LamapButton title="Encaisser +250 K" variant="gold" onPress={() => router.back()} />
          <Text style={s.footNote}>UN JOUR MANQUÉ = SÉRIE REMISE À ZÉRO</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    closeRow: { flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 18, height: 40 },
    close: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.surfA(0.6),
      borderWidth: 1,
      borderColor: theme.goldA(0.3),
    },
    header: { paddingHorizontal: 24, alignItems: "center", paddingTop: 8 },
    eyebrow: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 10, letterSpacing: 2.2, color: theme.gold, marginBottom: 10 },
    title: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 30, letterSpacing: -0.6, color: theme.cream },
    sub: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 13, lineHeight: 20, color: theme.creamA(0.65), marginTop: 10, textAlign: "center" },
    coinWrap: { alignItems: "center", marginTop: 24 },
    coin: {
      width: 170,
      height: 170,
      borderRadius: 85,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderWidth: 3,
      borderColor: theme.goldBright,
    },
    coinValue: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 44, color: "#1F1810", lineHeight: 46 },
    coinUnit: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 11, color: "#3A2810", letterSpacing: 2, marginTop: 2 },
    calendar: {
      margin: 18,
      marginTop: 32,
      padding: 14,
      borderRadius: 18,
      backgroundColor: "rgba(0,0,0,0.35)",
      borderWidth: 1,
      borderColor: theme.goldA(0.18),
    },
    calHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
    calLabel: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 9, letterSpacing: 2, color: theme.gold },
    calRow: { flexDirection: "row", gap: 6 },
    calCell: {
      minHeight: 56,
      borderRadius: 10,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
    },
    calDay: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 8, letterSpacing: 1.4 },
    calK: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 12 },
    calCheck: { position: "absolute", top: 3, right: 4 },
    footer: { marginTop: "auto", paddingHorizontal: 20, paddingBottom: 8 },
    footNote: {
      fontFamily: FONT_WEIGHTS.mono.medium,
      fontSize: 8,
      letterSpacing: 1.6,
      color: theme.creamA(0.4),
      textAlign: "center",
      marginTop: 10,
    },
  });
}
