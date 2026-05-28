import { AppBackdrop, AppBar, PageTitle, SectionHeader, Surface } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RANKS = ["3", "4", "5", "6", "7", "8", "9", "10"];

const RULES = [
  { n: "01", title: "Distribution", body: "Chaque joueur reçoit 5 cartes. Pas de pioche." },
  { n: "02", title: "La main", body: "Celui qui a « la main » joue le premier. Il choisit la couleur du tour." },
  { n: "03", title: "Suivre la couleur", body: "Si tu as la couleur demandée, tu DOIS la jouer. La carte la plus haute prend la main." },
  { n: "04", title: "Pas de couleur ?", body: "Tu défausses une carte de ton choix. Tu cèdes automatiquement la main." },
  { n: "05", title: "Le tour 5 décide", body: "Seul qui gagne la 5ᵉ manche remporte le pot. Les autres manches ne comptent pas… sauf pour la Kora.", highlight: true },
];

const GLOSSARY = [
  { term: "KORA", def: "Gagner la dernière manche avec un 3 — multiplicateur ×2." },
  { term: "DOUBLE KORA", def: "Gagner les manches 4 ET 5 avec des 3 — ×4." },
  { term: "TRIPLE KORA", def: "Manches 3, 4 ET 5 avec des 3 — ×8 (rare).", highlight: true },
  { term: "BANDI", def: "Victoire éclatante. Surnom de la légende du PK5." },
  { term: "POT", def: "Total des mises. 90% au gagnant, 10% à la plateforme." },
];

export default function RulesScreen() {
  const theme = useTheme();
  const s = makeStyles(theme);
  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop dust={8} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AppBar />
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <PageTitle eyebrow="GUIDE · RÈGLES" title={"Comment\non joue."} />
          <Text style={s.intro}>
            LaMap est un duel en 5 manches. Seule la dernière main décide qui gagne le pot.
          </Text>

          {/* Hierarchy */}
          <Surface style={s.hierarchy}>
            <Text style={s.eyebrow}>HIÉRARCHIE DES CARTES</Text>
            <View style={s.ranksRow}>
              {RANKS.map((r, i) => {
                const top = i === RANKS.length - 1;
                return (
                  <View
                    key={r}
                    style={[
                      s.rankCell,
                      {
                        backgroundColor: top ? theme.gold : theme.surfA(0.7),
                        borderColor: top ? theme.gold : theme.goldA(0.18),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        s.rankText,
                        { color: top ? "#1F1810" : theme.creamA(0.7) },
                      ]}
                    >
                      {r}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Text style={s.hierarchyNote}>
              Le <Text style={{ color: theme.goldBright }}>10</Text> est la plus forte. Le{" "}
              <Text style={{ color: theme.cream }}>3</Text> est la plus faible — mais c'est l'arme à Kora.
            </Text>
          </Surface>

          <SectionHeader title="Le déroulé" />
          <View style={s.list}>
            {RULES.map((r) => (
              <View
                key={r.n}
                style={[
                  s.ruleBlock,
                  {
                    backgroundColor: r.highlight ? theme.goldA(0.12) : theme.surface,
                    borderColor: r.highlight ? theme.goldA(0.4) : theme.goldA(0.1),
                  },
                ]}
              >
                <Text style={[s.ruleN, { color: r.highlight ? theme.goldBright : theme.goldA(0.6) }]}>
                  {r.n}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.ruleTitle}>{r.title}</Text>
                  <Text style={s.ruleBody}>{r.body}</Text>
                </View>
              </View>
            ))}
          </View>

          <SectionHeader title="Glossaire" />
          <Surface style={s.glossary}>
            {GLOSSARY.map((g, i) => (
              <View
                key={g.term}
                style={[
                  s.glossRow,
                  i === GLOSSARY.length - 1 ? null : { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.goldA(0.08) },
                ]}
              >
                <Text style={[s.glossTerm, { color: g.highlight ? theme.goldBright : theme.cream }]}>
                  {g.term}
                </Text>
                <Text style={s.glossDef}>{g.def}</Text>
              </View>
            ))}
          </Surface>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    intro: {
      paddingHorizontal: 20,
      paddingBottom: 22,
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 14,
      lineHeight: 22,
      color: theme.creamA(0.65),
    },
    eyebrow: {
      fontFamily: FONT_WEIGHTS.mono.semibold,
      fontSize: 10,
      letterSpacing: 2.4,
      color: theme.gold,
      marginBottom: 12,
    },
    hierarchy: { marginHorizontal: 20, padding: 18 },
    ranksRow: { flexDirection: "row", justifyContent: "space-between", gap: 4 },
    rankCell: {
      flex: 1,
      height: 44,
      borderRadius: 6,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    rankText: { fontFamily: FONT_WEIGHTS.card.bold, fontSize: 18 },
    hierarchyNote: {
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 12,
      lineHeight: 18,
      color: theme.creamA(0.55),
      marginTop: 10,
    },
    list: { paddingHorizontal: 20, gap: 10, paddingTop: 4 },
    ruleBlock: { flexDirection: "row", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
    ruleN: { fontFamily: FONT_WEIGHTS.mono.bold, fontSize: 11, letterSpacing: 1, width: 28 },
    ruleTitle: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 14, color: theme.cream },
    ruleBody: {
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 12,
      lineHeight: 18,
      color: theme.creamA(0.65),
      marginTop: 3,
    },
    glossary: { marginHorizontal: 20, marginTop: 8, paddingHorizontal: 4 },
    glossRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12, paddingVertical: 12 },
    glossTerm: { width: 100, fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 12, letterSpacing: 0.4 },
    glossDef: { flex: 1, fontFamily: FONT_WEIGHTS.body.regular, fontSize: 12, lineHeight: 18, color: theme.creamA(0.6) },
  });
}
