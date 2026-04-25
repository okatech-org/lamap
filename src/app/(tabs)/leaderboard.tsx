import { LeaderboardList } from "@/components/leaderboard/leaderboard-list";
import { RankSelector } from "@/components/leaderboard/rank-selector";
import { DeepBg, LamapButton, LamapSectionLabel } from "@/components/lamap";
import { COLORS, FONT_WEIGHTS } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@convex/_generated/api";
import { type RankTier } from "@convex/ranking";
import { useQuery } from "convex/react";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function LeaderboardTab() {
  const { userId } = useAuth();
  const insets = useSafeAreaInsets();
  const [selectedRank, setSelectedRank] = useState<RankTier>("BRONZE");
  const [byRank, setByRank] = useState(false);

  const user = useQuery(
    api.users.getCurrentUser,
    userId ? { clerkUserId: userId } : "skip",
  );
  const globalLeaderboard = useQuery(
    api.leaderboard.getGlobalLeaderboard,
    { limit: 500 },
  );
  const rankLeaderboard = useQuery(api.leaderboard.getRankLeaderboard, {
    rankTier: selectedRank,
    limit: 100,
  });

  return (
    <View style={styles.root}>
      <DeepBg />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={styles.header}>
          <LamapSectionLabel>Classement</LamapSectionLabel>
          <Text style={styles.title}>Le tableau d&apos;honneur</Text>
          <Text style={styles.subtitle}>
            Mesure-toi aux meilleurs joueurs.
          </Text>
        </View>

        <View style={styles.toggle}>
          <LamapButton
            title={byRank ? "Vue globale" : "Vue par rang"}
            variant="ghost"
            onPress={() => setByRank((v) => !v)}
          />
        </View>

        {byRank ? (
          <>
            <RankSelector
              selectedRank={selectedRank}
              onSelectRank={setSelectedRank}
            />
            <LeaderboardList
              entries={rankLeaderboard}
              currentUserId={user?._id}
              contentContainerStyle={{
                paddingBottom: insets.bottom + 120,
                paddingHorizontal: 20,
              }}
            />
          </>
        ) : (
          <LeaderboardList
            entries={globalLeaderboard}
            currentUserId={user?._id}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 120,
              paddingHorizontal: 20,
            }}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 6,
  },
  title: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 28,
    color: COLORS.cream,
    letterSpacing: -0.6,
    marginTop: 4,
  },
  subtitle: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 13,
    color: "rgba(245, 242, 237, 0.65)",
  },
  toggle: {
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: "flex-start",
  },
});
