import { ChallengeModal } from "@/components/challenges/challenge-modal";
import { AppBackdrop, AppBar, LamapButton, SectionHeader, Surface } from "@/components/lamap";
import { FONT_WEIGHTS, prToDesignRank, RANKS, useTheme, type Theme } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@lamap/convex/_generated/api";
import { getCurrencyFromCountry } from "@lamap/convex/currencies";
import { INITIAL_PR } from "@lamap/convex/ranking";
import { useMutation, useQuery } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PR_THRESHOLDS = [0, 1000, 1200, 1400, 1600, 1800];

function nextRankInfo(pr: number) {
  for (let i = 0; i < PR_THRESHOLDS.length; i++) {
    if (pr < PR_THRESHOLDS[i]) return { name: RANKS[i].name, threshold: PR_THRESHOLDS[i] };
  }
  return null;
}

function modeLabel(mode: string) {
  return { AI: "IA", RANKED: "Classé", ONLINE: "Privé", CASH: "Mise" }[mode] ?? mode;
}

export default function PublicProfileScreen() {
  const theme = useTheme();
  const s = makeStyles(theme);
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { convexUser } = useAuth();
  const [showChallenge, setShowChallenge] = useState(false);
  const profileUserId = userId as any;

  const user = useQuery(api.users.getPublicUserProfile, profileUserId ? { userId: profileUserId } : "skip");
  const recentGames = useQuery(
    api.games.getUserGameHistory,
    profileUserId && convexUser?._id
      ? { userId: profileUserId, viewerUserId: convexUser._id, limit: 5 }
      : "skip",
  );
  const createConversation = useMutation(api.messaging.createConversation);
  const isOwnProfile = convexUser?._id === profileUserId;

  if (!user) {
    return (
      <View style={s.root}>
        <Stack.Screen options={{ headerShown: false }} />
        <AppBackdrop />
        <SafeAreaView style={s.center}>
          <ActivityIndicator size="large" color={theme.gold} />
        </SafeAreaView>
      </View>
    );
  }

  const pr = user.pr ?? INITIAL_PR;
  const tier = prToDesignRank(pr);
  const next = nextRankInfo(pr);
  const initials = (user.username.match(/\b[A-ZÉÈÀÂÊÎÔÛ]/giu) || ["L"]).slice(0, 2).join("").toUpperCase();

  const handleMessage = async () => {
    if (!convexUser?._id || !profileUserId) return;
    try {
      const conversationId = await createConversation({ userId1: convexUser._id, userId2: profileUserId });
      router.push(`/(messages)/${conversationId}` as never);
    } catch (e) {
      Alert.alert("Erreur", e instanceof Error ? e.message : "Impossible d'ouvrir la conversation");
    }
  };

  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop dust={8} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AppBar title="Profil" />
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <Surface elevated style={s.hero}>
            <View style={s.heroGlow} />
            <View style={s.heroTop}>
              <View style={[s.avatar, { borderColor: theme.goldA(0.45) }]}>
                <Text style={s.avatarText}>{initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{user.username}</Text>
                <View style={s.rankRow}>
                  <View style={[s.rankDot, { backgroundColor: tier.color }]} />
                  <Text style={[s.rankName, { color: tier.color }]}>{tier.name}</Text>
                  <Text style={s.prMono}>{pr} PR</Text>
                </View>
                {next ? <Text style={s.nextRank}>{next.name} à {next.threshold} PR</Text> : null}
              </View>
            </View>

            {!isOwnProfile ? (
              <View style={s.actions}>
                <View style={{ flex: 1 }}>
                  <LamapButton title="⚔ Défier" variant="gold" onPress={() => setShowChallenge(true)} />
                </View>
                <View style={{ flex: 1 }}>
                  <LamapButton title="Message" variant="dark" onPress={handleMessage} />
                </View>
              </View>
            ) : null}
          </Surface>

          {recentGames && recentGames.length > 0 ? (
            <>
              <SectionHeader title="Vos dernières parties" />
              <Surface style={s.list}>
                {recentGames.slice(0, 5).map((game: any, i: number, arr: any[]) => {
                  const won = game.winnerId === profileUserId;
                  return (
                    <View
                      key={game.gameId}
                      style={[
                        s.gameRow,
                        i === arr.length - 1 ? null : { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.goldA(0.08) },
                      ]}
                    >
                      <View style={[s.stripe, { backgroundColor: won ? theme.gold : theme.ember }]} />
                      <Text style={s.gameMode}>{modeLabel(game.mode)}</Text>
                      <Text style={[s.gameResult, { color: won ? theme.goldBright : theme.chipEmberColor }]}>
                        {won ? "Victoire" : "Défaite"}
                      </Text>
                    </View>
                  );
                })}
              </Surface>
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>

      <ChallengeModal
        visible={showChallenge}
        onClose={() => setShowChallenge(false)}
        challengedUserId={profileUserId}
        challengedUsername={user.username}
        currency={getCurrencyFromCountry(user.country ?? "") ?? "XAF"}
      />
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    hero: { margin: 20, marginTop: 8, padding: 20, overflow: "hidden" },
    heroGlow: { position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: theme.goldA(0.2) },
    heroTop: { flexDirection: "row", alignItems: "center", gap: 14 },
    avatar: { width: 68, height: 68, borderRadius: 34, alignItems: "center", justifyContent: "center", backgroundColor: theme.accent, borderWidth: 1.5 },
    avatarText: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 22, color: theme.cream },
    name: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 20, color: theme.cream },
    rankRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 6 },
    rankDot: { width: 8, height: 8, borderRadius: 4 },
    rankName: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 13 },
    prMono: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 10, color: theme.goldBright, marginLeft: 4 },
    nextRank: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 11, color: theme.creamA(0.5), marginTop: 4 },
    actions: { flexDirection: "row", gap: 10, marginTop: 18 },
    list: { marginHorizontal: 20, paddingHorizontal: 4 },
    gameRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12, paddingVertical: 12 },
    stripe: { width: 4, height: 28, borderRadius: 2 },
    gameMode: { flex: 1, fontFamily: FONT_WEIGHTS.display.bold, fontSize: 13, color: theme.cream },
    gameResult: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 13 },
  });
}
