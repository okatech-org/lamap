import { AppBackdrop, Chip, PageTitle } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Tourney = {
  id: string;
  kicker: string;
  title: string;
  prize: string;
  countdown: string;
  slots: string;
  entry?: string;
  featured?: boolean;
};

const REAL: Tourney[] = [
  { id: "vendredi", kicker: "ENTRÉE GRATUITE", title: "Coupe du Vendredi", prize: "Forfait data 5 000 F", countdown: "2 j 14 h", slots: "248 / 512", featured: true },
  { id: "maison", kicker: "ENTRÉE GRATUITE", title: "Tournoi de la Maison", prize: "Crédit téléphone 2 000 F", countdown: "14 h 22", slots: "312 / 512" },
  { id: "bandi-or", kicker: "GRAND TOURNOI MENSUEL", title: "Le Bandi d'Or", prize: "Smartphone milieu de gamme", countdown: "27 jours", slots: "48 / 64" },
];
const KORA: Tourney[] = [
  { id: "sng", kicker: "BUY-IN 500 K", title: "Sit & Go · Express", prize: "≈ 7 200 K au gagnant", countdown: "à 8 joueurs", slots: "5 / 8", entry: "500 K" },
  { id: "soir", kicker: "BUY-IN 2 000 K", title: "Tournoi du Soir", prize: "≈ 28 800 K au gagnant", countdown: "ce soir 21h", slots: "42 / 64", entry: "2 000 K" },
  { id: "cercle", kicker: "BUY-IN 10 000 K", title: "Cercle des Bandi", prize: "≈ 144 000 K + cadre", countdown: "dimanche 20h", slots: "12 / 32", entry: "10 000 K", featured: true },
];

export default function TournamentsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const s = makeStyles(theme);
  const [tab, setTab] = useState<"real" | "kora">("real");
  const list = tab === "real" ? REAL : KORA;

  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop dust={10} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={s.header}>
          <Text style={s.headerTitle}>Tournois</Text>
          <Text style={s.headerLink}>⌖ MES INSCRIPTIONS</Text>
        </View>
        <PageTitle eyebrow="GAGNE DU VRAI · OU DU PRESTIGE" title={"Tournois\nen cours."} />

        <View style={s.tabs}>
          {(["real", "kora"] as const).map((t) => {
            const active = tab === t;
            return (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                style={[
                  s.tab,
                  {
                    backgroundColor: active ? theme.goldA(0.18) : theme.surfA(0.55),
                    borderColor: active ? theme.goldA(0.5) : theme.goldA(0.12),
                  },
                ]}
              >
                <Text style={[s.tabLabel, { color: active ? theme.goldBright : theme.creamA(0.55) }]}>
                  {t === "real" ? "Lots réels" : "Buy-in Kora"}
                </Text>
                <Text style={[s.tabHint, { color: active ? theme.goldBright : theme.creamA(0.4) }]}>
                  {t === "real" ? "gratuit" : "engagés"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 12 }} showsVerticalScrollIndicator={false}>
          {list.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => router.push(`/tournament/${t.id}`)}
              style={[
                s.card,
                {
                  backgroundColor: t.featured ? theme.goldA(0.2) : theme.surface,
                  borderColor: t.featured ? theme.goldA(0.5) : theme.goldA(0.12),
                },
              ]}
            >
              <View style={s.cardTop}>
                <View style={[s.prizeIcon, { backgroundColor: theme.goldA(0.18), borderColor: theme.goldA(0.4) }]}>
                  <Text style={{ fontSize: 22 }}>{t.entry ? "◆" : "🏆"}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.kicker}>{t.kicker}</Text>
                  <Text style={s.title}>{t.title}</Text>
                  <Text style={s.prize}>
                    <Text style={{ color: theme.goldBright }}>Lot · </Text>
                    {t.prize}
                  </Text>
                </View>
                {t.featured ? <Chip tone="ember">★ Hot</Chip> : null}
              </View>
              <View style={s.cardBottom}>
                <View style={s.metaCol}>
                  <Text style={s.metaLabel}>DÉPART</Text>
                  <Text style={s.metaValue}>{t.countdown}</Text>
                </View>
                <View style={s.metaDivider} />
                <View style={s.metaCol}>
                  <Text style={s.metaLabel}>INSCRITS</Text>
                  <Text style={s.metaValue}>{t.slots}</Text>
                </View>
                <View style={{ flex: 1 }} />
                <View style={[s.registerBtn, { backgroundColor: theme.gold }]}>
                  <Text style={s.registerText}>{t.entry ? `${t.entry} ›` : "S'inscrire"}</Text>
                </View>
              </View>
            </Pressable>
          ))}

          {tab === "real" ? (
            <View style={[s.legal, { borderColor: theme.goldA(0.18) }]}>
              <Text style={[s.legalTag, { color: theme.gold }]}>★ LÉGAL</Text>
              <Text style={s.legalBody}>
                Tous nos tournois sont à entrée gratuite avec lot fixe. Aucune cagnotte alimentée par les mises — ce n'est pas un jeu d'argent.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 4 },
    headerTitle: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 17, color: theme.cream },
    headerLink: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 9, letterSpacing: 1.6, color: theme.goldBright },
    tabs: { flexDirection: "row", gap: 8, paddingHorizontal: 20, paddingBottom: 16 },
    tab: { flex: 1, padding: 10, borderRadius: 14, borderWidth: 1, gap: 2 },
    tabLabel: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 13 },
    tabHint: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 8, letterSpacing: 1.4 },
    card: { padding: 16, borderRadius: 16, borderWidth: 1 },
    cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
    prizeIcon: { width: 52, height: 52, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
    kicker: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 8, letterSpacing: 1.8, color: theme.goldBright },
    title: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 17, color: theme.cream, marginTop: 2, letterSpacing: -0.2 },
    prize: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 12, color: theme.creamA(0.7), marginTop: 3 },
    cardBottom: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      marginTop: 14,
      padding: 10,
      borderRadius: 10,
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    metaCol: { gap: 1 },
    metaLabel: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 7, letterSpacing: 1.4, color: theme.creamA(0.5) },
    metaValue: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 12, color: theme.cream },
    metaDivider: { width: 1, height: 18, backgroundColor: theme.goldA(0.12) },
    registerBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999 },
    registerText: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 11, color: "#1F1810" },
    legal: { padding: 12, borderRadius: 12, borderWidth: 1, borderStyle: "dashed", backgroundColor: "rgba(0,0,0,0.25)" },
    legalTag: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 9, letterSpacing: 1.8, marginBottom: 6 },
    legalBody: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 11, lineHeight: 17, color: theme.creamA(0.6) },
  });
}
