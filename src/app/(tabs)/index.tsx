import {
  DeepBg,
  LamapButton,
  LamapHeroCard,
  LamapModeTile,
  LamapSectionLabel,
} from "@/components/lamap";
import { COLORS, FONT_WEIGHTS, RADII } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { type ErrorBoundaryProps, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type GameMode = "AI" | "RANKED" | "ONLINE" | "CASH" | "LOCAL" | string;

type QuickPlay = {
  href: Parameters<ReturnType<typeof useRouter>["push"]>[0];
  modeLabel: string;
  subtitle: string;
};

function quickPlayTarget(lastMode: GameMode | undefined): QuickPlay {
  switch (lastMode) {
    case "AI":
      return {
        href: "/(lobby)/select-difficulty",
        modeLabel: "IA",
        subtitle: "Reprends ta dernière difficulté",
      };
    // RANKED, ONLINE, CASH and no-history all funnel to ranked matchmaking.
    default:
      return {
        href: "/(lobby)/ranked-matchmaking",
        modeLabel: "CLASSÉ",
        subtitle: "Affronte un joueur de ton rang",
      };
  }
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.errorRoot}>
      <DeepBg />
      <View style={styles.errorContent}>
        <Ionicons name="alert-circle" size={64} color={COLORS.terre2} />
        <Text style={styles.errorTitle}>Erreur de chargement</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <View style={styles.errorActions}>
          <LamapButton title="Réessayer" variant="primary" onPress={retry} />
          <LamapButton
            title="Retour"
            variant="ghost"
            onPress={() => router.back()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { userId, isSignedIn } = useAuth();
  const user = useQuery(
    api.users.getCurrentUser,
    userId ? { clerkUserId: userId } : "skip",
  );
  const activeGame = useQuery(
    api.games.getActiveMatch,
    userId ? { clerkId: userId } : "skip",
  );
  const allRecentGames = useQuery(
    api.games.getRecentGames,
    userId ? { clerkUserId: userId, limit: 10 } : "skip",
  );

  const lastMode = allRecentGames?.[0]?.mode as GameMode | undefined;
  const quickPlay = quickPlayTarget(lastMode);

  const recentGames =
    allRecentGames?.filter((game) => game.mode !== "AI").slice(0, 4) ?? [];

  if (!isSignedIn) {
    return (
      <SafeAreaView style={styles.root}>
        <DeepBg />
        <View style={styles.center}>
          <Text style={styles.body}>Veuillez vous connecter</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user || !allRecentGames) {
    return (
      <SafeAreaView style={styles.root}>
        <DeepBg />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.or2} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <DeepBg />
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: headerHeight + 8 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Active match — rejoin */}
          {activeGame ? (
            <Pressable
              style={styles.activeMatch}
              onPress={() => router.push(`/(game)/match/${activeGame.gameId}`)}
              accessibilityRole="button"
              accessibilityLabel="Rejoindre la partie en cours"
            >
              <View style={styles.activeMatchPulse} />
              <View style={{ flex: 1 }}>
                <LamapSectionLabel>Partie en cours</LamapSectionLabel>
                <Text style={styles.activeMatchTitle}>
                  {activeGame.mode === "AI"
                    ? "Contre l'IA"
                    : activeGame.mode === "RANKED"
                      ? "Match classé"
                      : "Partie privée"}
                </Text>
              </View>
              <Ionicons name="play-circle" size={32} color={COLORS.or2} />
            </Pressable>
          ) : null}

          {/* Hero — partie rapide */}
          <LamapHeroCard
            eyebrow={`PARTIE RAPIDE · ${quickPlay.modeLabel}`}
            title={"Affronter\nmaintenant"}
            subtitle={quickPlay.subtitle}
            ctaLabel="Lancer ↗"
            onPress={() => router.push(quickPlay.href)}
            style={{ marginTop: 18 }}
          />

          {/* Modes grid */}
          <View style={styles.section}>
            <LamapSectionLabel>Modes de jeu</LamapSectionLabel>
            <View style={styles.modeGrid}>
              <View style={styles.modeRow}>
                <LamapModeTile
                  icon={
                    <Ionicons
                      name="hardware-chip-outline"
                      size={22}
                      color={COLORS.or2}
                    />
                  }
                  title="IA"
                  subtitle="3 niveaux"
                  onPress={() => router.push("/(lobby)/select-difficulty")}
                />
                <LamapModeTile
                  icon={
                    <Ionicons
                      name="key-outline"
                      size={22}
                      color={COLORS.or2}
                    />
                  }
                  title="Privé"
                  subtitle="Code partie"
                  onPress={() => router.push("/(lobby)/create-friendly")}
                />
              </View>
              <View style={styles.modeRow}>
                <LamapModeTile
                  icon={
                    <Ionicons
                      name="diamond-outline"
                      size={22}
                      color={COLORS.or2}
                    />
                  }
                  title="Mise"
                  subtitle="Bientôt"
                  locked
                />
                <LamapModeTile
                  icon={
                    <Ionicons
                      name="trophy-outline"
                      size={22}
                      color={COLORS.or2}
                    />
                  }
                  title="Tournoi"
                  subtitle="Bientôt"
                  hot
                  locked
                />
              </View>
            </View>
          </View>

          {/* Recent games */}
          {recentGames.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <LamapSectionLabel>Dernières parties</LamapSectionLabel>
                <Pressable onPress={() => router.push("/(tabs)/profile")}>
                  <Text style={styles.linkSmall}>Voir tout</Text>
                </Pressable>
              </View>
              <View style={styles.recentList}>
                {recentGames.map((game) => (
                  <View key={game.gameId} style={styles.recentRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.recentOpponent}>
                        vs {game.opponentName}
                      </Text>
                      <Text style={styles.recentMeta}>
                        {modeLabel(game.mode)} · {formatDate(game.endedAt)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.recentBadge,
                        game.result === "win"
                          ? styles.recentBadgeWin
                          : styles.recentBadgeLoss,
                      ]}
                    >
                      <Text
                        style={[
                          styles.recentBadgeText,
                          game.result === "win"
                            ? styles.recentBadgeTextWin
                            : styles.recentBadgeTextLoss,
                        ]}
                      >
                        {game.result === "win" ? "Victoire" : "Défaite"}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <View style={{ height: 120 }} />
        </ScrollView>
      </View>
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

function formatDate(timestamp: number | null | undefined): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `Il y a ${Math.max(1, diffMins)} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 14,
    color: COLORS.cream,
  },
  activeMatch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    marginTop: 18,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairlineStrong,
    overflow: "hidden",
  },
  activeMatchPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.terre2,
    shadowColor: COLORS.terre2,
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  activeMatchTitle: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 16,
    color: COLORS.cream,
    marginTop: 2,
    letterSpacing: -0.2,
  },
  section: {
    marginTop: 28,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  linkSmall: {
    fontFamily: FONT_WEIGHTS.body.medium,
    fontSize: 12,
    color: COLORS.or2,
  },
  modeGrid: {
    marginTop: 12,
    gap: 10,
  },
  modeRow: {
    flexDirection: "row",
    gap: 10,
  },
  recentList: {
    gap: 8,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: RADII.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  recentOpponent: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 14,
    color: COLORS.cream,
  },
  recentMeta: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 11,
    color: "rgba(245, 242, 237, 0.5)",
    marginTop: 2,
  },
  recentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  recentBadgeWin: {
    backgroundColor: "rgba(201, 168, 118, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(201, 168, 118, 0.45)",
  },
  recentBadgeLoss: {
    backgroundColor: "rgba(212, 99, 93, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(212, 99, 93, 0.4)",
  },
  recentBadgeText: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  recentBadgeTextWin: {
    color: COLORS.or2,
  },
  recentBadgeTextLoss: {
    color: COLORS.terre2,
  },
  errorRoot: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  errorContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  errorTitle: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 24,
    color: COLORS.cream,
    textAlign: "center",
  },
  errorMessage: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 14,
    color: "rgba(245, 242, 237, 0.7)",
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 20,
  },
  errorActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
});
