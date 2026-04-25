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
import { useClerk } from "@clerk/clerk-expo";
import { api } from "@convex/_generated/api";
import { INITIAL_PR } from "@convex/ranking";
import { useHeaderHeight } from "@react-navigation/elements";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
  // find current band
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

export default function ProfileScreen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { userId } = useAuth();
  const { signOut } = useClerk();

  const user = useQuery(
    api.users.getCurrentUser,
    userId ? { clerkUserId: userId } : "skip",
  );
  const stats = useQuery(
    api.users.getUserStats,
    userId ? { clerkUserId: userId } : "skip",
  );
  const recentRaw = useQuery(
    api.games.getRecentGames,
    userId ? { clerkUserId: userId, limit: 5 } : "skip",
  );

  if (!user || !stats || !recentRaw) {
    return (
      <View style={styles.root}>
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
  const greetingName = user.firstName?.trim() || user.username || "Joueur";
  const initials =
    (greetingName.match(/\b[A-ZÉÈÀÂÊÎÔÛ]/giu) || ["L"])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <View style={styles.root}>
      <DeepBg />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: headerHeight + 16 },
        ]}
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
          <Text style={styles.name}>{greetingName}</Text>
          <Text style={styles.tierLabel}>· {tier.name.toUpperCase()} ·</Text>
        </View>

        {/* PR / progress */}
        <View style={styles.section}>
          <View style={styles.prRow}>
            <Text style={styles.prValue}>{pr} PR</Text>
            <Text style={styles.prTarget}>
              {next ? `${next.name} à ${next.threshold}` : "Rang max atteint"}
            </Text>
          </View>
          <LamapProgressBar value={progress} />
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Victoires"
            value={String(stats.wins)}
            sub={`sur ${stats.totalGames}`}
          />
          <StatCard
            label="Win rate"
            value={`${Math.round(stats.winRate)}%`}
            sub={
              stats.currentStreak > 0
                ? `série de ${stats.currentStreak}`
                : "—"
            }
          />
          <StatCard
            label="Meilleure"
            value={String(stats.bestStreak)}
            sub="série"
          />
        </View>

        {/* Recent matches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <LamapSectionLabel>5 dernières parties</LamapSectionLabel>
          </View>
          {recentRaw.length === 0 ? (
            <Text style={styles.empty}>Aucune partie pour le moment.</Text>
          ) : (
            <View style={styles.recentList}>
              {recentRaw.slice(0, 5).map((game) => {
                const won = game.result === "win";
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
                        {game.opponentName}
                      </Text>
                      <Text style={styles.opponentMeta}>
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
          )}
        </View>

        {/* Actions */}
        <View style={[styles.section, { gap: 12 }]}>
          <LamapButton
            title="Voir l'échelle des rangs"
            variant="ghost"
            onPress={() => router.push("/(tabs)/leaderboard")}
          />
          <LamapButton
            title="Paramètres"
            variant="ghost"
            onPress={() => router.push("/settings")}
          />
          <LamapButton
            title="Se déconnecter"
            variant="ghost"
            onPress={async () => {
              await signOut();
              router.replace("/welcome");
            }}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <View style={styles.statCard}>
      <LamapSectionLabel tone="muted">{label}</LamapSectionLabel>
      <Text style={styles.statValue}>{value}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
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
  center: {
    flex: 1,
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
  section: {
    marginTop: 28,
  },
  sectionHeader: {
    marginBottom: 12,
  },
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
  statsGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 18,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: RADII.lg,
    backgroundColor: "rgba(46, 61, 77, 0.5)",
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  statValue: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 22,
    color: COLORS.cream,
    marginTop: 6,
    letterSpacing: -0.4,
  },
  statSub: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 10,
    color: COLORS.or2,
    marginTop: 2,
  },
  empty: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 13,
    color: "rgba(245, 242, 237, 0.5)",
    textAlign: "center",
    paddingVertical: 16,
  },
  recentList: {
    gap: 6,
  },
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
  opponentMeta: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 10,
    color: "rgba(245, 242, 237, 0.5)",
    marginTop: 2,
  },
  resultDelta: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
