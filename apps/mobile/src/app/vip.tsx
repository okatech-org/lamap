import { AppBackdrop, LamapButton } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PERKS: { icon: keyof typeof Ionicons.glyphMap; title: string; sub: string }[] = [
  { icon: "star", title: "Badge VIP partout", sub: "Pseudo doré, vu par tout le monde" },
  { icon: "ban", title: "Aucune pub", sub: "Plus jamais de vidéo entre deux mains" },
  { icon: "diamond", title: "Bonus quotidien ×1,5", sub: "150 → 900 K selon le streak" },
  { icon: "flash", title: "Accès tables VIP illimité", sub: "Même si solde temporairement bas" },
  { icon: "color-palette", title: "Cosmétiques exclusifs", sub: "2 dos par saison réservés aux VIP" },
];

export default function VipScreen() {
  const theme = useTheme();
  const router = useRouter();
  const s = makeStyles(theme);
  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false, presentation: "modal" }} />
      <AppBackdrop variant="velvet" dust={16} embers={10} />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={s.closeRow}>
          <Pressable style={s.close} onPress={() => router.back()}>
            <Ionicons name="close" size={18} color={theme.cream} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <View style={s.crestWrap}>
            <View style={s.crest}>
              <LinearGradient
                colors={[theme.goldBright, theme.gold, theme.goldDeep]}
                start={{ x: 0.3, y: 0 }}
                end={{ x: 0.7, y: 1 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 20, transform: [{ rotate: "45deg" }] }]}
              />
              <Text style={s.crestText}>VIP</Text>
            </View>
            <Text style={s.eyebrow}>CERCLE DES BANDI</Text>
            <Text style={s.title}>Pass VIP.</Text>
            <Text style={s.sub}>Le statut, la classe, et un mois entier de privilèges. Annulable quand tu veux.</Text>
          </View>

          <View style={s.perks}>
            {PERKS.map((p, i) => (
              <View
                key={p.title}
                style={[
                  s.perkRow,
                  i === PERKS.length - 1 ? null : { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.goldA(0.1) },
                ]}
              >
                <View style={[s.perkIcon, { backgroundColor: theme.goldA(0.15), borderColor: theme.goldA(0.3) }]}>
                  <Ionicons name={p.icon} size={15} color={theme.goldBright} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.perkTitle}>{p.title}</Text>
                  <Text style={s.perkSub}>{p.sub}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={s.plans}>
            <Plan theme={theme} period="MENSUEL" price="1 500 F" sub="résiliable" />
            <Plan theme={theme} period="ANNUEL" price="12 000 F" sub="2 mois offerts" featured />
          </View>
        </ScrollView>

        <View style={s.footer}>
          <LamapButton title="Activer · 12 000 F / an" variant="gold" onPress={() => {}} />
          <Text style={s.footNote}>ESSAI 7 JOURS GRATUIT · SANS ENGAGEMENT</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Plan({
  theme,
  period,
  price,
  sub,
  featured,
}: {
  theme: Theme;
  period: string;
  price: string;
  sub: string;
  featured?: boolean;
}) {
  return (
    <View
      style={[
        pStyles.card,
        {
          backgroundColor: featured ? theme.goldA(0.22) : theme.surfA(0.55),
          borderColor: featured ? theme.goldA(0.5) : theme.goldA(0.15),
        },
      ]}
    >
      {featured ? (
        <View style={[pStyles.badge, { backgroundColor: theme.gold }]}>
          <Text style={pStyles.badgeText}>★ MEILLEURE</Text>
        </View>
      ) : null}
      <Text style={[pStyles.period, { color: featured ? theme.goldBright : theme.creamA(0.5) }]}>{period}</Text>
      <Text style={[pStyles.price, { color: theme.cream }]}>{price}</Text>
      <Text style={[pStyles.sub, { color: theme.creamA(0.55) }]}>{sub}</Text>
    </View>
  );
}

const pStyles = StyleSheet.create({
  card: { flex: 1, padding: 14, borderRadius: 14, borderWidth: 1.5 },
  badge: { position: "absolute", top: -8, right: 12, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  badgeText: { fontFamily: FONT_WEIGHTS.mono.bold, fontSize: 7, letterSpacing: 1.4, color: "#1F1810" },
  period: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 9, letterSpacing: 2 },
  price: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 22, marginTop: 4, letterSpacing: -0.3 },
  sub: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 10, marginTop: 2 },
});

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
    crestWrap: { alignItems: "center", paddingHorizontal: 24, paddingTop: 24 },
    crest: { width: 88, height: 88, alignItems: "center", justifyContent: "center", marginBottom: 20 },
    crestText: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 30, color: "#1F1810", letterSpacing: -1 },
    eyebrow: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 10, letterSpacing: 2.4, color: theme.gold, marginBottom: 8 },
    title: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 36, letterSpacing: -0.8, color: theme.cream },
    sub: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 13, lineHeight: 20, color: theme.creamA(0.65), marginTop: 10, textAlign: "center", maxWidth: 280 },
    perks: {
      margin: 20,
      marginTop: 28,
      paddingHorizontal: 4,
      borderRadius: 18,
      backgroundColor: "rgba(0,0,0,0.35)",
      borderWidth: 1,
      borderColor: theme.goldA(0.25),
    },
    perkRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
    perkIcon: { width: 32, height: 32, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
    perkTitle: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 13, color: theme.cream },
    perkSub: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 11, color: theme.creamA(0.55), marginTop: 2 },
    plans: { flexDirection: "row", gap: 10, paddingHorizontal: 20 },
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
    footNote: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 8, letterSpacing: 1.6, color: theme.creamA(0.4), textAlign: "center", marginTop: 10 },
  });
}
