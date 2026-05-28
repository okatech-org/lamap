import { AppBackdrop, AppBar, Chip, LamapButton, PageTitle, SectionHeader } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Stub flow — no payment provider wired yet. Mirrors the MMobileMoney mockup.
const OPERATORS = [
  { id: "airtel", name: "Airtel Money", color: "#E20613" },
  { id: "moov", name: "Moov Money", color: "#0089D0" },
];

export default function RechargeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const s = makeStyles(theme);
  const [op, setOp] = useState("airtel");

  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop dust={6} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AppBar title="Recharge" />
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* Steps */}
          <View style={s.steps}>
            <Step label="Pack" done theme={theme} />
            <View style={[s.stepLine, { backgroundColor: theme.accentA(0.3) }]} />
            <Step label="Paiement" active theme={theme} />
            <View style={[s.stepLine, { backgroundColor: theme.goldA(0.1) }]} />
            <Step label="Confirmation" theme={theme} />
          </View>

          <PageTitle eyebrow="ÉTAPE 2 / 3" title="Mobile Money." />

          {/* Pack recap */}
          <View style={s.packRecap}>
            <LinearGradient
              colors={[theme.goldA(0.18), "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={s.packIcon}>
              <Text style={s.packIconText}>◆◆◆</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.packEyebrow}>PACK POPULAIRE</Text>
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8, marginTop: 2 }}>
                <Text style={s.packAmount}>◆ 13 000</Text>
                <Chip tone="accent">+30%</Chip>
              </View>
            </View>
            <Text style={s.packPrice}>1 000 F</Text>
          </View>

          <SectionHeader title="Opérateur" />
          <View style={s.ops}>
            {OPERATORS.map((o) => {
              const active = op === o.id;
              return (
                <Pressable
                  key={o.id}
                  onPress={() => setOp(o.id)}
                  style={[
                    s.opCard,
                    {
                      backgroundColor: active ? `${o.color}25` : theme.surfA(0.55),
                      borderColor: active ? o.color : theme.goldA(0.12),
                    },
                  ]}
                >
                  <View style={[s.opLogo, { backgroundColor: o.color }]}>
                    <Text style={s.opLogoText}>{o.name[0]}</Text>
                  </View>
                  <Text style={s.opName}>{o.name}</Text>
                </Pressable>
              );
            })}
          </View>

          <SectionHeader title="Numéro" />
          <View style={s.numberWrap}>
            <Text style={[s.numberPrefix, { color: theme.goldBright }]}>+241</Text>
            <View style={s.numberDivider} />
            <Text style={s.number}>06 12 34 56</Text>
          </View>
          <Text style={s.numberHint}>
            Tu vas recevoir un code USSD pour valider — ça prend moins de 10 secondes.
          </Text>
        </ScrollView>

        <View style={s.footer}>
          <LamapButton
            title="Payer 1 000 F · Recevoir 13 000 K"
            variant="gold"
            onPress={() => router.replace("/recharge-success")}
          />
          <Text style={s.footNote}>PAIEMENT SÉCURISÉ · AUCUN STOCKAGE</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Step({
  label,
  done,
  active,
  theme,
}: {
  label: string;
  done?: boolean;
  active?: boolean;
  theme: Theme;
}) {
  const color = done ? theme.accentText : active ? theme.goldBright : theme.creamA(0.4);
  const bg = done ? theme.accentA(0.25) : active ? theme.goldA(0.22) : theme.surfA(0.65);
  const border = done ? theme.accentA(0.45) : active ? theme.goldA(0.5) : theme.goldA(0.12);
  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: border,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {done ? <Text style={{ fontSize: 10, color }}>✓</Text> : null}
      </View>
      <Text style={{ fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 7, letterSpacing: 1.4, color }}>
        {label}
      </Text>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    steps: { flexDirection: "row", alignItems: "flex-start", gap: 8, paddingHorizontal: 20, paddingBottom: 12 },
    stepLine: { flex: 1, height: 1, marginTop: 11 },
    packRecap: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.goldA(0.3),
      overflow: "hidden",
    },
    packIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: theme.goldA(0.22),
      borderWidth: 1,
      borderColor: theme.goldA(0.4),
      alignItems: "center",
      justifyContent: "center",
    },
    packIconText: { fontSize: 13, color: theme.goldBright },
    packEyebrow: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 8, letterSpacing: 1.8, color: theme.gold },
    packAmount: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 20, color: theme.goldBright },
    packPrice: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 14, color: theme.cream },
    ops: { flexDirection: "row", gap: 10, paddingHorizontal: 20, paddingBottom: 18 },
    opCard: { flex: 1, padding: 16, borderRadius: 14, borderWidth: 1.5, gap: 10 },
    opLogo: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
    opLogoText: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 13, color: "#fff" },
    opName: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 13, color: theme.cream },
    numberWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginHorizontal: 20,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 14,
      backgroundColor: theme.surfA(0.65),
      borderWidth: 1,
      borderColor: theme.goldA(0.25),
    },
    numberPrefix: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 13 },
    numberDivider: { width: 1, height: 18, backgroundColor: theme.goldA(0.22) },
    number: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 17, color: theme.cream, letterSpacing: 1 },
    numberHint: {
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 11,
      lineHeight: 17,
      color: theme.creamA(0.5),
      marginHorizontal: 20,
      marginTop: 8,
    },
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
