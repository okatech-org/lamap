import { AppBackdrop, LamapButton } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RechargeSuccessScreen() {
  const theme = useTheme();
  const router = useRouter();
  const s = makeStyles(theme);
  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop variant="velvet" dust={28} embers={20} />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={s.center}>
          <View style={s.check}>
            <LinearGradient
              colors={[theme.accentText, theme.accentGlow, theme.accent]}
              style={[StyleSheet.absoluteFill, { borderRadius: 44 }]}
            />
            <Text style={s.checkMark}>✓</Text>
          </View>
          <Text style={s.eyebrow}>PAIEMENT VALIDÉ · 1 000 FCFA</Text>
          <Text style={s.title}>+13 000{"\n"}Kora.</Text>
          <Text style={s.roman}>crédités à l'instant — bonne partie</Text>
        </View>

        <View style={s.balanceCard}>
          <Text style={s.balEyebrow}>NOUVEAU SOLDE</Text>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
            <Text style={s.balDiamond}>◆</Text>
            <Text style={s.balValue}>25 480</Text>
            <Text style={s.balUnit}>K</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
            <Text style={s.balBefore}>avant</Text>
            <Text style={s.balStrike}>12 480 K</Text>
            <Text style={[s.balDelta, { color: theme.accentText }]}>→ +13 000 K</Text>
          </View>
        </View>

        <View style={s.footer}>
          <LamapButton title="Trouver une table →" variant="gold" onPress={() => router.replace("/(lobby)/select-mode")} />
          <View style={{ height: 10 }} />
          <LamapButton title="↗ Reçu par mail" variant="dark" onPress={() => router.replace("/(tabs)")} />
        </View>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    center: { alignItems: "center", paddingTop: 80, paddingHorizontal: 24 },
    check: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      marginBottom: 22,
      borderWidth: 3,
      borderColor: theme.accentText,
    },
    checkMark: { fontSize: 44, color: theme.cream, fontFamily: FONT_WEIGHTS.display.extrabold },
    eyebrow: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 10, letterSpacing: 2.2, color: theme.gold, marginBottom: 8 },
    title: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 36, letterSpacing: -0.8, color: theme.cream, textAlign: "center", lineHeight: 38 },
    roman: { fontFamily: FONT_WEIGHTS.body.regular, fontStyle: "italic", fontSize: 13, letterSpacing: 1, color: theme.creamA(0.6), marginTop: 12 },
    balanceCard: {
      margin: 24,
      marginTop: 40,
      padding: 18,
      borderRadius: 18,
      backgroundColor: "rgba(0,0,0,0.4)",
      borderWidth: 1,
      borderColor: theme.goldA(0.3),
    },
    balEyebrow: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 9, letterSpacing: 2.2, color: theme.gold, marginBottom: 10 },
    balDiamond: { fontSize: 22, color: theme.goldBright },
    balValue: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 38, color: theme.cream, letterSpacing: -0.8, lineHeight: 40 },
    balUnit: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 10, color: theme.gold },
    balBefore: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 11, color: theme.creamA(0.5) },
    balStrike: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 11, color: theme.creamA(0.5), textDecorationLine: "line-through" },
    balDelta: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 11 },
    footer: { marginTop: "auto", paddingHorizontal: 20, paddingBottom: 8 },
  });
}
