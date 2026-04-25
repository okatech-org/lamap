import { ChallengeModal } from "@/components/challenges/challenge-modal";
import {
  Avatar,
  DeepBg,
  LamapButton,
  LamapProgressBar,
  LamapSectionLabel,
  RankBadge,
} from "@/components/lamap";
import { COLORS, FONT_WEIGHTS, prToDesignRank, RADII, RANKS } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import { getCurrencyFromCountry } from "@lamap/convex/currencies";
import { INITIAL_PR } from "@lamap/convex/ranking";
import { useMutation, useQuery } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PR_THRESHOLDS = [0, 1000, 1200, 1400, 1600, 1800];

function nextRankInfo(pr: number) {
  for (let i = 0; i < PR_THRESHOLDS.length; i++) {
    if (pr < PR_THRESHOLDS[i]) {
      return { name: RANKS[i].name, threshold: PR_THRESHOLDS[i] };
    }
  }
  return null;
}

function progressToNext(pr: number) {
  const info = nextRankInfo(pr);
  if (!info) return 1;
  let prevThreshold = 0;
  for (let i = PR_THRESHOLDS.length - 1; i >= 0; i--) {
    if (pr >= PR_THRESHOLDS[i]) {
      prevThreshold = PR_THRESHOLDS[i];
      break;
    }
  }
  const span = info.threshold - prevThreshold;
  if (span <= 0) return 1;
  return Math.max(0, Math.min(1, (pr - prevThreshold) / span));
}

export default function PublicProfileScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { convexUser } = useAuth();
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const profileUserId = userId as any;

  const user = useQuery(
    api.users.getPublicUserProfile,
    profileUserId ? { userId: profileUserId } : "skip",
  );
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
      <View style={styles.root}>
        <Stack.Screen options={{ headerShown: false }} />
        <DeepBg />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.or2} />
        </View>
      </View>
    );
  }

  const pr = user.pr ?? INITIAL_PR;
  const tier = prToDesignRank(pr);
  const next = nextRankInfo(pr);
  const progress = progressToNext(pr);
  const initials = (user.username.match(/\b[A-ZÉÈÀÂÊÎÔÛ]/giu) || ["L"])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleMessage = async () => {
    if (!convexUser?._id || !profileUserId) return;
    try {
      const conversationId = await createConversation({
        userId1: convexUser._id,
        userId2: profileUserId,
      });
      router.push(`/(messages)/${conversationId}` as any);
    } catch (e) {
      Alert.alert(
        "Erreur",
        e instanceof Error ? e.message : "Impossible d'ouvrir la conversation",
      );
    }
  };

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <DeepBg />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={22} color={COLORS.or2} />
          </Pressable>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.heroGlow} pointerEvents="none" />
            <View style={styles.avatarStack}>
              <Avatar initials={initials} size={88} />
              <View style={styles.rankBadgeOverlay}>
                <RankBadge rank={tier.name} size={48} />
              </View>
            </View>
            <Text style={styles.name}>{user.username}</Text>
            <Text style={styles.tierLabel}>· {tier.name.toUpperCase()} ·</Text>
          </View>

          {/* PR / progress */}
          <View style={styles.section}>
            <View style={styles.prRow}>
              <Text style={styles.prValue}>{pr} PR</Text>
              <Text style={styles.prTarget}>
                {next ? `${next.name} à ${next.threshold}` : "Rang max"}
              </Text>
            </View>
            <LamapProgressBar value={progress} />
          </View>

          {/* Recent matches against viewer */}
          {recentGames && recentGames.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <LamapSectionLabel>Dernières parties</LamapSectionLabel>
              </View>
              <View style={styles.recentList}>
                {recentGames.slice(0, 5).map((game: any) => {
                  const won = game.winnerId === profileUserId;
                  return (
                    <View key={game.gameId} style={styles.recentRow}>
                      <View
                        style={[
                          styles.stripe,
                          { backgroundColor: won ? COLORS.or : COLORS.terre2 },
                        ]}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.opponentName}>
                          {modeLabel(game.mode)}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.resultDelta,
                          { color: won ? COLORS.or2 : COLORS.terre2 },
                        ]}
                      >
                        {won ? "Victoire" : "Défaite"}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}

          {/* Actions */}
          {!isOwnProfile ? (
            <View style={[styles.section, { gap: 10 }]}>
              <LamapButton
                title="Défier"
                variant="primary"
                onPress={() => setShowChallengeModal(true)}
              />
              <LamapButton
                title="Envoyer un message"
                variant="ghost"
                onPress={handleMessage}
              />
            </View>
          ) : null}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>

      <ChallengeModal
        visible={showChallengeModal}
        onClose={() => setShowChallengeModal(false)}
        challengedUserId={profileUserId}
        challengedUsername={user.username}
        currency={getCurrencyFromCountry(user.country ?? "") ?? "XAF"}
      />
    </View>
  );
}

function modeLabel(mode: string): string {
  switch (mode) {
    case "AI":
      return "IA";
    case "RANKED":
      return "Classé";
    case "ONLINE":
      return "Privé";
    case "CASH":
      return "Mise";
    default:
      return mode;
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    paddingHorizontal: 20,
  },
  hero: {
    alignItems: "center",
    paddingVertical: 24,
    position: "relative",
  },
  heroGlow: {
    position: "absolute",
    top: -40,
    left: 0,
    right: 0,
    height: 240,
    backgroundColor: "rgba(180, 68, 62, 0.18)",
    borderRadius: 240,
    transform: [{ scaleX: 1.6 }],
    opacity: 0.55,
  },
  avatarStack: {
    position: "relative",
    width: 88,
    height: 88,
  },
  rankBadgeOverlay: {
    position: "absolute",
    bottom: -10,
    right: -14,
  },
  name: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 26,
    color: COLORS.cream,
    marginTop: 18,
    letterSpacing: -0.5,
  },
  tierLabel: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 11,
    letterSpacing: 2.4,
    color: COLORS.or2,
    marginTop: 4,
  },
  section: { marginTop: 28 },
  sectionHeader: { marginBottom: 12 },
  prRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  prValue: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 18,
    color: COLORS.cream,
    letterSpacing: -0.3,
  },
  prTarget: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 11,
    color: "rgba(245, 242, 237, 0.55)",
  },
  recentList: { gap: 6 },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: RADII.md,
    backgroundColor: "rgba(46, 61, 77, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(201, 168, 118, 0.1)",
  },
  stripe: {
    width: 4,
    height: 28,
    borderRadius: 2,
  },
  opponentName: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 13,
    color: COLORS.cream,
  },
  resultDelta: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
