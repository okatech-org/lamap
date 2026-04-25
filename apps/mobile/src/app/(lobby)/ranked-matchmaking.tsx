import {
  Avatar,
  DeepBg,
  LamapButton,
  LamapSectionLabel,
  RankBadge,
} from "@/components/lamap";
import { COLORS, FONT_WEIGHTS, prToDesignRank, RADII } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/hooks/use-settings";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import type { Currency } from "@lamap/convex/currencies";
import { INITIAL_PR } from "@lamap/convex/ranking";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const REVEAL_MS = 2500;

export default function RankedMatchmakingScreen() {
  const router = useRouter();
  const { userId, convexUser } = useAuth();
  const { timerEnabled, timerDuration } = useSettings();

  const joinQueue = useMutation(api.matchmaking.joinQueue);
  const leaveQueue = useMutation(api.matchmaking.leaveQueue);

  const queueStatus = useQuery(
    api.matchmaking.getMyStatus,
    userId && convexUser?._id ? { userId: convexUser._id } : "skip",
  );

  const userPR = convexUser?.pr || INITIAL_PR;
  const userRankName = prToDesignRank(userPR).name;
  const currency = (convexUser?.currency || "XAF") as Currency;

  const [searchTime, setSearchTime] = useState(0);
  const [tick, setTick] = useState(0); // animated dots
  const [revealing, setRevealing] = useState(false);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const joinedRef = useRef(false);

  const queueState = queueStatus?.status;
  const isMatched = queueState === "matched";

  // Auto-join the queue once we have a convex user. Re-fires only if userId changes.
  useEffect(() => {
    if (joinedRef.current) return;
    if (!convexUser?._id) return;
    if (queueState === "matched") return; // already matched, don't re-queue
    joinedRef.current = true;
    joinQueue({
      userId: convexUser._id,
      betAmount: 0,
      currency,
      mode: "RANKED",
      competitive: true,
      timerEnabled,
      timerDuration,
    }).catch((err) => {
      console.error("joinQueue failed:", err);
      joinedRef.current = false;
    });
  }, [
    convexUser?._id,
    queueState,
    joinQueue,
    currency,
    timerEnabled,
    timerDuration,
  ]);

  // Auto-leave the queue if the user backs out of the screen mid-search.
  useEffect(() => {
    return () => {
      if (!convexUser?._id) return;
      if (joinedRef.current && !isMatched) {
        leaveQueue({ userId: convexUser._id }).catch(() => {
          // ignore — best-effort cleanup
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animated search timer + ellipsis tick while not matched.
  useEffect(() => {
    if (isMatched) return;
    const ti = setInterval(() => setSearchTime((s) => s + 1), 1000);
    const td = setInterval(() => setTick((t) => t + 1), 600);
    return () => {
      clearInterval(ti);
      clearInterval(td);
    };
  }, [isMatched]);

  // Match-found reveal — show the VS screen for REVEAL_MS, then route.
  useEffect(() => {
    if (!isMatched || !queueStatus?.gameId) return;
    setRevealing(true);
    revealTimer.current = setTimeout(() => {
      router.replace(`/(game)/match/${queueStatus.gameId!}`);
    }, REVEAL_MS);
    return () => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
    };
  }, [isMatched, queueStatus?.gameId, router]);

  const prRange = searchTime < 30 ? 100 : searchTime < 60 ? 200 : 300;

  const handleCancel = async () => {
    if (convexUser?._id) {
      try {
        await leaveQueue({ userId: convexUser._id });
      } catch {
        // ignore — we may not be in the queue anymore
      }
    }
    router.back();
  };

  const ellipsis = ["", ".", "..", "..."][tick % 4];

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <DeepBg dustCount={revealing ? 22 : 14} dustOpacity={revealing ? 0.6 : 0.4} />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        {isMatched && revealing ? (
          <MatchFound
            userInitials={initialsOf(convexUser)}
            userName={displayName(convexUser)}
            userPR={userPR}
            userRankName={userRankName}
            opponent={queueStatus?.opponent ?? null}
          />
        ) : (
          <SearchingRadar
            ellipsis={ellipsis}
            prRange={prRange}
            userPR={userPR}
            userRankName={userRankName}
            onCancel={handleCancel}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

// ─── States ──────────────────────────────────────────────

function SearchingRadar({
  ellipsis,
  prRange,
  userPR,
  userRankName,
  onCancel,
}: {
  ellipsis: string;
  prRange: number;
  userPR: number;
  userRankName: string;
  onCancel: () => void;
}) {
  return (
    <View style={styles.flex1}>
      <View style={styles.searchTopBar}>
        <View
          accessibilityRole="button"
          accessibilityLabel="Annuler"
          style={styles.iconBtn}
          onTouchEnd={onCancel}
        >
          <Ionicons name="close" size={22} color={COLORS.or2} />
        </View>
        <LamapSectionLabel>Recherche en cours</LamapSectionLabel>
        <View style={styles.iconBtn} />
      </View>

      {/* Player rank — keeps the user grounded in their identity while waiting */}
      <View style={styles.selfRankRow}>
        <View style={styles.selfRankBadge}>
          <RankBadge rank={userRankName} size={44} />
        </View>
        <View style={styles.selfRankText}>
          <Text style={styles.selfRankLabel}>Votre rang</Text>
          <Text style={styles.selfRankName}>{userRankName}</Text>
          <Text style={styles.selfRankPr}>{userPR} PR</Text>
        </View>
      </View>

      <View style={styles.radarArea}>
        <PulseRing delay={0} />
        <PulseRing delay={800} />
        <PulseRing delay={1600} />
        <View style={styles.vsDisc}>
          <LinearGradient
            colors={["#C95048", "#6E2520"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 55 }]}
          />
          <Text style={styles.vsText}>VS</Text>
        </View>
      </View>

      <View style={styles.searchHeading}>
        <Text style={styles.titleMd}>Recherche d&apos;un adversaire</Text>
        <Text style={styles.searchEta}>Estimation{ellipsis} ~ 12 sec</Text>
      </View>

      <View style={styles.filterCard}>
        <LamapSectionLabel>Votre filtre</LamapSectionLabel>
        <View style={styles.filterList}>
          <FilterRow label="Mode" value="Classé" />
          <FilterRow label="Rang adverse" value={`±${prRange} PR`} />
          <FilterRow
            label="Plage PR"
            value={`${Math.max(0, userPR - prRange)} – ${userPR + prRange}`}
          />
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <View style={styles.searchActions}>
        <LamapButton
          title="Annuler la recherche"
          variant="ghost"
          onPress={onCancel}
        />
      </View>
    </View>
  );
}

function MatchFound({
  userInitials,
  userName,
  userPR,
  userRankName,
  opponent,
}: {
  userInitials: string;
  userName: string;
  userPR: number;
  userRankName: string;
  opponent:
    | { username?: string; pr?: number; avatarUrl?: string | null }
    | null;
}) {
  const oppName = opponent?.username ?? "Adversaire";
  const oppPR = opponent?.pr ?? INITIAL_PR;
  const oppRankName = prToDesignRank(oppPR).name;
  const oppInitials = initialsFromName(oppName);

  return (
    <View style={styles.flex1}>
      <View style={styles.foundHeader}>
        <LamapSectionLabel>Adversaire trouvé</LamapSectionLabel>
        <Text style={styles.titleLg}>Préparez-vous.</Text>
      </View>

      <View style={styles.foundDuel}>
        <PlayerColumn
          initials={userInitials}
          name={userName}
          pr={userPR}
          rankName={userRankName}
        />
        <VsBadge />
        <PlayerColumn
          initials={oppInitials}
          name={oppName}
          pr={oppPR}
          rankName={oppRankName}
          opponent
        />
      </View>

      <View style={styles.stakesPanel}>
        <StakeCol label="En jeu" value="+12 PR" tone="or" />
        <View style={styles.stakeDivider} />
        <StakeCol label="Risque" value="−10 PR" tone="terre" />
        <View style={styles.stakeDivider} />
        <StakeCol label="Bonus Kora" value="×2 — ×8" tone="or" />
      </View>

      <View style={{ flex: 1 }} />

      <View style={styles.distributionLabel}>
        <Text style={styles.distributionText}>Distribution imminente…</Text>
      </View>
    </View>
  );
}

// ─── Sub-components ──────────────────────────────────────

function PulseRing({ delay }: { delay: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 2400,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        false,
      ),
    );
  }, [delay, t]);
  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: 0.4 + t.value * 0.8 }],
    opacity: 0.65 * (1 - t.value),
  }));
  return <Animated.View style={[styles.pulseRing, animated]} pointerEvents="none" />;
}

function FilterRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.filterRow}>
      <Text style={styles.filterLabel}>{label}</Text>
      <Text style={styles.filterValue}>{value}</Text>
    </View>
  );
}

function PlayerColumn({
  initials,
  name,
  pr,
  rankName,
  opponent,
}: {
  initials: string;
  name: string;
  pr: number;
  rankName: string;
  opponent?: boolean;
}) {
  return (
    <View style={styles.playerCol}>
      <View style={styles.avatarStack}>
        {opponent ? (
          <View style={styles.opponentAvatar}>
            <LinearGradient
              colors={["#5A7A96", "#2E3D4D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 44 }]}
            />
            <Text style={styles.opponentInitials}>{initials}</Text>
          </View>
        ) : (
          <Avatar initials={initials} size={88} />
        )}
        <View style={styles.rankBadgeOverlay}>
          <RankBadge rank={rankName} size={36} />
        </View>
      </View>
      <Text style={styles.playerName} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.playerMeta}>{pr} PR</Text>
    </View>
  );
}

function VsBadge() {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [t]);
  const animated = useAnimatedStyle(() => ({
    opacity: 0.6 + t.value * 0.4,
    transform: [{ scale: 0.95 + t.value * 0.1 }],
  }));
  return (
    <View style={styles.vsCenter}>
      <Animated.View style={[styles.vsHalo, animated]} />
      <Text style={styles.vsCenterText}>VS</Text>
    </View>
  );
}

function StakeCol({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "or" | "terre";
}) {
  return (
    <View style={styles.stakeCol}>
      <Text style={styles.stakeLabel}>{label.toUpperCase()}</Text>
      <Text
        style={[
          styles.stakeValue,
          { color: tone === "or" ? COLORS.or2 : COLORS.terre2 },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

// ─── Helpers ─────────────────────────────────────────────

function displayName(u: { firstName?: string; username?: string } | null | undefined) {
  return u?.firstName?.trim() || u?.username?.trim() || "Joueur";
}

function initialsOf(u: { firstName?: string; username?: string } | null | undefined) {
  return initialsFromName(displayName(u));
}

function initialsFromName(name: string) {
  return (
    (name.match(/\b[A-ZÉÈÀÂÊÎÔÛ]/giu) || ["L"])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  flex1: { flex: 1 },
  titleLg: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 32,
    color: COLORS.cream,
    letterSpacing: -0.8,
    marginTop: 6,
  },
  titleMd: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 26,
    color: COLORS.cream,
    letterSpacing: -0.6,
    textAlign: "center",
  },

  // Searching
  searchTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  selfRankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    alignSelf: "center",
    marginTop: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(46, 61, 77, 0.5)",
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  selfRankBadge: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  selfRankText: {
    paddingRight: 6,
  },
  selfRankLabel: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 9,
    letterSpacing: 1.6,
    color: "rgba(245, 242, 237, 0.5)",
  },
  selfRankName: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 14,
    color: COLORS.cream,
    marginTop: 2,
    letterSpacing: -0.2,
  },
  selfRankPr: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 10,
    color: COLORS.or2,
    marginTop: 1,
    letterSpacing: 0.4,
  },
  radarArea: {
    width: 240,
    height: 240,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  pulseRing: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 118, 0.45)",
  },
  vsDisc: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(201, 168, 118, 0.55)",
    shadowColor: "#C95048",
    shadowOpacity: 0.4,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  vsText: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 38,
    color: COLORS.cream,
    letterSpacing: -1,
  },
  searchHeading: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchEta: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 14,
    color: "rgba(245, 242, 237, 0.6)",
  },
  filterCard: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: RADII.lg,
    backgroundColor: "rgba(46, 61, 77, 0.5)",
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  filterList: { marginTop: 10, gap: 10 },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterLabel: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 13,
    color: COLORS.cream,
  },
  filterValue: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 13,
    color: COLORS.or2,
  },
  searchActions: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  // Matched
  foundHeader: {
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: 24,
    gap: 8,
  },
  foundDuel: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 36,
    alignItems: "center",
    justifyContent: "space-between",
  },
  playerCol: {
    flex: 1,
    alignItems: "center",
  },
  avatarStack: {
    position: "relative",
    width: 88,
    height: 88,
  },
  opponentAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(201, 168, 118, 0.55)",
  },
  opponentInitials: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 32,
    color: COLORS.cream,
    letterSpacing: -0.6,
  },
  rankBadgeOverlay: {
    position: "absolute",
    bottom: -16,
    left: "50%",
    marginLeft: -18,
  },
  playerName: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 16,
    color: COLORS.cream,
    marginTop: 28,
    letterSpacing: -0.3,
  },
  playerMeta: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 11,
    color: COLORS.or2,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  vsCenter: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  vsHalo: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(232, 200, 121, 0.18)",
  },
  vsCenterText: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 38,
    color: COLORS.or2,
    letterSpacing: -1.4,
  },
  stakesPanel: {
    flexDirection: "row",
    marginTop: 48,
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: RADII.lg,
    backgroundColor: "rgba(166, 130, 88, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(201, 168, 118, 0.3)",
  },
  stakeCol: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  stakeDivider: {
    width: 1,
    backgroundColor: "rgba(201, 168, 118, 0.2)",
  },
  stakeLabel: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 9,
    letterSpacing: 1.6,
    color: "rgba(245, 242, 237, 0.5)",
  },
  stakeValue: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 18,
    letterSpacing: -0.4,
  },
  distributionLabel: {
    alignItems: "center",
    paddingBottom: 32,
  },
  distributionText: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 11,
    letterSpacing: 2.2,
    color: COLORS.or2,
    textTransform: "uppercase",
  },
});
