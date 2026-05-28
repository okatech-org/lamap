import { AppBackdrop, AppBar, PageTitle } from "@/components/lamap";
import { FONT_WEIGHTS, prToDesignRank, useTheme, type Theme } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import { INITIAL_PR } from "@lamap/convex/ranking";
import { useQuery } from "convex/react";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Tone = "gold" | "accent" | "neutral";

export default function SelectModeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const s = makeStyles(theme);
  const { userId, convexUser } = useAuth();

  const activeGame = useQuery(api.games.getActiveMatch, userId ? { clerkId: userId } : "skip");
  const userPR = convexUser?.pr ?? INITIAL_PR;
  const rank = prToDesignRank(userPR);

  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop dust={8} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AppBar title="" />
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <PageTitle eyebrow="JOUER" title="Choisis un mode." />

          {activeGame ? (
            <Pressable style={s.active} onPress={() => router.push(`/(game)/match/${activeGame.gameId}`)}>
              <View style={[s.activeDot, { backgroundColor: theme.accentGlow }]} />
              <View style={{ flex: 1 }}>
                <Text style={s.activeEyebrow}>PARTIE EN COURS</Text>
                <Text style={s.activeTitle}>
                  {activeGame.mode === "AI" ? "Contre l'IA" : activeGame.mode === "RANKED" ? "Match classé" : "Partie privée"}
                </Text>
              </View>
              <Ionicons name="play-circle" size={32} color={theme.gold} />
            </Pressable>
          ) : null}

          <View style={s.list}>
            <ModeCard
              theme={theme}
              tone="gold"
              eyebrow="CLASSÉ"
              title="Match classé"
              sub="Mise standard · gagne des PR pour grimper l'échelle."
              stat={`${userPR} PR — ${rank.name}`}
              onPress={() => router.push("/(lobby)/ranked-matchmaking")}
            />
            <ModeCard
              theme={theme}
              tone="accent"
              eyebrow="MISE LIBRE"
              title="Mise libre"
              sub="Tu fixes la mise dès 10 K. Pas de PR, juste du Kora."
              stat="Mise minimale 10 K"
              onPress={() => router.push("/(lobby)/tables")}
            />
            <ModeCard
              theme={theme}
              tone="neutral"
              eyebrow="PRIVÉ"
              title="Partie privée"
              sub="Crée une table, invite un ami avec un code, fixe les règles."
              stat="6 chiffres · code de salon"
              onPress={() => router.push("/(lobby)/create-friendly")}
            />
            <ModeCard
              theme={theme}
              tone="neutral"
              eyebrow="ENTRAÎNEMENT"
              title="Contre IA"
              sub="Sans mise, sans PR. Pour t'échauffer ou apprendre."
              stat="3 niveaux d'IA"
              onPress={() => router.push("/(lobby)/select-difficulty")}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ModeCard({
  theme,
  tone,
  eyebrow,
  title,
  sub,
  stat,
  onPress,
}: {
  theme: Theme;
  tone: Tone;
  eyebrow: string;
  title: string;
  sub: string;
  stat: string;
  onPress: () => void;
}) {
  const map = {
    gold: { bg: theme.goldA(0.16), border: theme.goldA(0.4), accent: theme.goldBright },
    accent: { bg: theme.accentA(0.16), border: theme.accentA(0.4), accent: theme.accentText },
    neutral: { bg: theme.surfA(0.55), border: theme.goldA(0.12), accent: theme.creamA(0.7) },
  }[tone];
  return (
    <Pressable onPress={onPress} style={[mStyles.card, { backgroundColor: map.bg, borderColor: map.border }]}>
      <Text style={[mStyles.eyebrow, { color: map.accent }]}>{eyebrow}</Text>
      <Text style={[mStyles.title, { color: theme.cream }]}>{title}</Text>
      <Text style={[mStyles.sub, { color: theme.creamA(0.65) }]}>{sub}</Text>
      <Text style={[mStyles.stat, { color: map.accent }]}>{stat}</Text>
    </Pressable>
  );
}

const mStyles = StyleSheet.create({
  card: { padding: 18, borderRadius: 18, borderWidth: 1, gap: 4 },
  eyebrow: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 10, letterSpacing: 2.2 },
  title: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 22, marginTop: 4 },
  sub: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 13, lineHeight: 19, marginTop: 4 },
  stat: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 10, marginTop: 10 },
});

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    active: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginHorizontal: 20,
      marginBottom: 16,
      padding: 14,
      borderRadius: 16,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.hairlineStrong,
    },
    activeDot: { width: 8, height: 8, borderRadius: 4 },
    activeEyebrow: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 9, letterSpacing: 2, color: theme.accentText },
    activeTitle: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 16, color: theme.cream, marginTop: 3 },
    list: { paddingHorizontal: 20, gap: 12 },
  });
}
