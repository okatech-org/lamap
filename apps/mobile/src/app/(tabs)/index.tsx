import { AppBackdrop, LamapButton } from "@/components/lamap";
import { PlayingCard } from "@/components/game/playing-card";
import { FONT_WEIGHTS, RADII, useTheme, type Theme } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
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

type Href = Parameters<ReturnType<typeof useRouter>["push"]>[0];

function quickPlayTarget(lastMode: GameMode | undefined): {
  href: Href;
  modeLabel: string;
} {
  if (lastMode === "AI") {
    return { href: "/(lobby)/select-difficulty", modeLabel: "ENTRAÎNEMENT" };
  }
  return { href: "/(lobby)/ranked-matchmaking", modeLabel: "MATCH CLASSÉ" };
}

function fmtNumber(n: number): string {
  return n.toLocaleString("fr-FR").replace(/ /g, " ");
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const router = useRouter();
  const theme = useTheme();
  const s = makeStyles(theme);
  return (
    <View style={s.root}>
      <AppBackdrop />
      <SafeAreaView style={s.centerSafe}>
        <Ionicons name="alert-circle" size={64} color={theme.accentGlow} />
        <Text style={s.errorTitle}>Erreur de chargement</Text>
        <Text style={s.errorMessage}>{error.message}</Text>
        <View style={s.errorActions}>
          <LamapButton title="Réessayer" variant="gold" onPress={retry} />
          <LamapButton title="Retour" variant="ghost" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const s = makeStyles(theme);
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
    allRecentGames?.filter((game) => game.mode !== "AI").slice(0, 3) ?? [];

  if (!isSignedIn) {
    return (
      <View style={s.root}>
        <AppBackdrop />
        <SafeAreaView style={s.centerSafe}>
          <Text style={s.body}>Veuillez vous connecter</Text>
        </SafeAreaView>
      </View>
    );
  }

  if (!user || !allRecentGames) {
    return (
      <View style={s.root}>
        <AppBackdrop />
        <SafeAreaView style={s.centerSafe}>
          <ActivityIndicator size="large" color={theme.gold} />
        </SafeAreaView>
      </View>
    );
  }

  const name = user.firstName || user.username || "Joueur";
  const initials = name.slice(0, 2).toUpperCase();
  const balance = user.balance ?? 0;

  return (
    <View style={s.root}>
      <AppBackdrop dust={10} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header — avatar + balance */}
          <View style={s.header}>
            <Pressable
              onPress={() => router.push("/(tabs)/profile")}
              style={s.avatar}
            >
              <Text style={s.avatarText}>{initials}</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/(tabs)/wallet")}
              style={s.balanceChip}
            >
              <Text style={s.balanceDiamond}>◆</Text>
              <Text style={s.balanceText}>{fmtNumber(balance)}</Text>
            </Pressable>
          </View>

          {/* Page title */}
          <View style={s.titleBlock}>
            <Text style={s.eyebrow}>BONSOIR {name.toUpperCase()}</Text>
            <Text style={s.title}>Une partie{"\n"}ce soir ?</Text>
          </View>

          {/* Active match — rejoin */}
          {activeGame ? (
            <Pressable
              style={s.activeMatch}
              onPress={() => router.push(`/(game)/match/${activeGame.gameId}`)}
            >
              <View style={s.activePulse} />
              <View style={{ flex: 1 }}>
                <Text style={s.activeEyebrow}>PARTIE EN COURS</Text>
                <Text style={s.activeTitle}>
                  {activeGame.mode === "AI"
                    ? "Contre l'IA"
                    : activeGame.mode === "RANKED"
                      ? "Match classé"
                      : "Partie privée"}
                </Text>
              </View>
              <Ionicons name="play-circle" size={34} color={theme.gold} />
            </Pressable>
          ) : null}

          {/* Hero — quick play */}
          <View style={s.hero}>
            <LinearGradient
              colors={[theme.accent, theme.night2, theme.abyss]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={s.heroGlow} />
            <View style={s.heroCard}>
              <PlayingCard rank="7" suit="hearts" state="played" size="medium" />
            </View>
            <View style={s.heroCopy}>
              <Text style={s.heroEyebrow}>★ {quickPlay.modeLabel}</Text>
              <Text style={s.heroTitle}>Trouve un{"\n"}adversaire</Text>
              <Text style={s.heroSub}>1 247 joueurs en ligne</Text>
            </View>
            <Pressable
              style={s.heroPlay}
              onPress={() => router.push(quickPlay.href)}
              accessibilityRole="button"
              accessibilityLabel="Lancer une partie"
            >
              <LinearGradient
                colors={[theme.goldBright, theme.goldDeep]}
                style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
              />
              <Ionicons name="play" size={20} color="#1F1810" />
            </Pressable>
          </View>

          {/* Modes */}
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Modes de jeu</Text>
            <Pressable onPress={() => router.push("/(lobby)/select-mode")}>
              <Text style={s.more}>Voir tous</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.modesRow}
          >
            <ModeChip
              theme={theme}
              icon="ribbon-outline"
              label="Classé"
              sub="gagne des PR"
              tone="accent"
              onPress={() => router.push("/(lobby)/ranked-matchmaking")}
            />
            <ModeChip
              theme={theme}
              icon="diamond-outline"
              label="Mise libre"
              sub="dès 10 K"
              tone="gold"
              onPress={() => router.push("/(lobby)/select-mode")}
            />
            <ModeChip
              theme={theme}
              icon="key-outline"
              label="Privé"
              sub="ami / code"
              tone="neutral"
              onPress={() => router.push("/(lobby)/create-friendly")}
            />
            <ModeChip
              theme={theme}
              icon="school-outline"
              label="Entraînement"
              sub="sans mise"
              tone="neutral"
              onPress={() => router.push("/(lobby)/select-difficulty")}
            />
          </ScrollView>

          {/* Season — placeholder data until the season backend exists */}
          <View style={s.season}>
            <View style={s.seasonBadge}>
              <Text style={s.seasonBadgeText}>S04</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={s.seasonTopRow}>
                <Text style={s.seasonName}>Cercle de Feu</Text>
                <Text style={s.seasonTier}>23/50</Text>
              </View>
              <View style={s.progressTrack}>
                <View style={s.progressFill} />
              </View>
              <Text style={s.seasonDays}>17 j restants</Text>
            </View>
          </View>

          {/* Recent games (real data) */}
          {recentGames.length > 0 ? (
            <>
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>Dernières parties</Text>
                <Pressable onPress={() => router.push("/(tabs)/profile")}>
                  <Text style={s.more}>Voir tout</Text>
                </Pressable>
              </View>
              <View style={s.recentList}>
                {recentGames.map((game) => (
                  <View key={game.gameId} style={s.recentRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.recentOpponent}>vs {game.opponentName}</Text>
                      <Text style={s.recentMeta}>
                        {modeLabel(game.mode)} · {formatDate(game.endedAt)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        s.recentResult,
                        {
                          color:
                            game.result === "win" ? theme.goldBright : theme.accentText,
                        },
                      ]}
                    >
                      {game.result === "win" ? "Victoire" : "Défaite"}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          <View style={{ height: 110 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ModeChip({
  theme,
  icon,
  label,
  sub,
  tone,
  onPress,
}: {
  theme: Theme;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub: string;
  tone: "accent" | "gold" | "neutral";
  onPress: () => void;
}) {
  const bg =
    tone === "gold"
      ? theme.goldA(0.14)
      : tone === "accent"
        ? theme.accentA(0.14)
        : theme.surfA(0.6);
  const border =
    tone === "gold"
      ? theme.goldA(0.4)
      : tone === "accent"
        ? theme.accentA(0.35)
        : theme.hairline;
  const iconColor =
    tone === "gold" ? theme.goldBright : tone === "accent" ? theme.accentText : theme.bone;
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 140,
        padding: 14,
        borderRadius: 14,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: border,
      }}
    >
      <Ionicons name={icon} size={24} color={iconColor} />
      <Text
        style={{
          fontFamily: FONT_WEIGHTS.display.bold,
          fontSize: 14,
          color: theme.cream,
          marginTop: 8,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: FONT_WEIGHTS.body.regular,
          fontSize: 11,
          color: theme.creamA(0.5),
          marginTop: 2,
        }}
      >
        {sub}
      </Text>
    </Pressable>
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
  const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 60) return `il y a ${Math.max(1, diffMins)} min`;
  if (diffHours < 24) return `il y a ${diffHours} h`;
  if (diffDays < 7) return `il y a ${diffDays} j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    centerSafe: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, gap: 16 },
    body: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 14, color: theme.cream },
    scrollContent: { paddingHorizontal: 20, paddingTop: 4 },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    avatar: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.accent,
      borderWidth: 1.5,
      borderColor: theme.goldA(0.45),
    },
    avatarText: {
      fontFamily: FONT_WEIGHTS.display.bold,
      fontSize: 13,
      color: theme.cream,
      letterSpacing: 0.5,
    },
    balanceChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      height: 30,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: theme.goldA(0.1),
      borderWidth: 1,
      borderColor: theme.goldA(0.28),
    },
    balanceDiamond: { fontSize: 12, color: theme.goldBright },
    balanceText: {
      fontFamily: FONT_WEIGHTS.display.bold,
      fontSize: 13,
      color: theme.goldBright,
    },

    titleBlock: { paddingTop: 22, paddingBottom: 4 },
    eyebrow: {
      fontFamily: FONT_WEIGHTS.mono.semibold,
      fontSize: 10,
      letterSpacing: 2.6,
      color: theme.gold,
      marginBottom: 8,
    },
    title: {
      fontFamily: FONT_WEIGHTS.display.extrabold,
      fontSize: 32,
      lineHeight: 34,
      letterSpacing: -0.8,
      color: theme.cream,
    },

    activeMatch: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
      marginTop: 18,
      borderRadius: RADII.lg,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.hairlineStrong,
    },
    activePulse: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.accentGlow,
    },
    activeEyebrow: {
      fontFamily: FONT_WEIGHTS.mono.semibold,
      fontSize: 9,
      letterSpacing: 2,
      color: theme.accentText,
    },
    activeTitle: {
      fontFamily: FONT_WEIGHTS.display.bold,
      fontSize: 16,
      color: theme.cream,
      marginTop: 3,
    },

    hero: {
      height: 180,
      marginTop: 18,
      borderRadius: 22,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.goldA(0.25),
    },
    heroGlow: {
      position: "absolute",
      right: -40,
      top: 20,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: theme.accentA(0.3),
    },
    heroCard: {
      position: "absolute",
      right: 10,
      top: 26,
      transform: [{ rotate: "8deg" }],
    },
    heroCopy: { position: "absolute", left: 18, bottom: 18, maxWidth: 220 },
    heroEyebrow: {
      fontFamily: FONT_WEIGHTS.mono.semibold,
      fontSize: 9,
      letterSpacing: 2,
      color: theme.accentText,
      marginBottom: 6,
    },
    heroTitle: {
      fontFamily: FONT_WEIGHTS.display.extrabold,
      fontSize: 22,
      lineHeight: 23,
      letterSpacing: -0.5,
      color: theme.cream,
    },
    heroSub: {
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 11,
      color: theme.creamA(0.6),
      marginTop: 6,
    },
    heroPlay: {
      position: "absolute",
      right: 18,
      bottom: 18,
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
      marginTop: 26,
      marginBottom: 12,
    },
    sectionTitle: {
      fontFamily: FONT_WEIGHTS.display.bold,
      fontSize: 17,
      color: theme.cream,
      letterSpacing: -0.2,
    },
    more: { fontFamily: FONT_WEIGHTS.body.medium, fontSize: 13, color: theme.goldBright },

    modesRow: { gap: 10, paddingRight: 20 },

    season: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      marginTop: 26,
      padding: 16,
      borderRadius: 18,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.goldA(0.1),
    },
    seasonBadge: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.goldA(0.18),
      borderWidth: 1,
      borderColor: theme.goldA(0.35),
    },
    seasonBadgeText: {
      fontFamily: FONT_WEIGHTS.display.extrabold,
      fontSize: 14,
      color: theme.goldBright,
    },
    seasonTopRow: {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
    },
    seasonName: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 14, color: theme.cream },
    seasonTier: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 10, color: theme.gold },
    progressTrack: {
      height: 4,
      borderRadius: 99,
      backgroundColor: theme.goldA(0.1),
      marginTop: 8,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      width: "46%",
      borderRadius: 99,
      backgroundColor: theme.gold,
    },
    seasonDays: {
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 11,
      color: theme.creamA(0.5),
      marginTop: 6,
    },

    recentList: { gap: 8 },
    recentRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: 14,
      borderRadius: RADII.md,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.hairline,
    },
    recentOpponent: {
      fontFamily: FONT_WEIGHTS.body.semibold,
      fontSize: 14,
      color: theme.cream,
    },
    recentMeta: {
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 11,
      color: theme.creamA(0.5),
      marginTop: 2,
    },
    recentResult: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 13 },

    errorTitle: {
      fontFamily: FONT_WEIGHTS.display.bold,
      fontSize: 24,
      color: theme.cream,
      textAlign: "center",
    },
    errorMessage: {
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 14,
      color: theme.creamA(0.7),
      textAlign: "center",
      maxWidth: 300,
      lineHeight: 20,
    },
    errorActions: { flexDirection: "row", gap: 12, marginTop: 8 },
  });
}
