import {
  Avatar,
  DeepBg,
  LamapSectionLabel,
  LamapTabPillRow,
} from "@/components/lamap";
import { COLORS, FONT_WEIGHTS, prToDesignRank, RADII } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@convex/_generated/api";
import { useHeaderHeight } from "@react-navigation/elements";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const FILTERS = [
  { id: "global" as const, label: "Mondial" },
  { id: "country" as const, label: "Cameroun", disabled: true },
  { id: "friends" as const, label: "Amis", disabled: true },
];

const PODIUM_COLORS = ["#E8C879", "#C0C0C0", "#C9722F"];
const PODIUM_HEIGHTS = [165, 130, 110];

export default function LeaderboardScreen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { convexUser } = useAuth();
  const [filter, setFilter] = useState<"global" | "country" | "friends">(
    "global",
  );

  const board = useQuery(api.leaderboard.getGlobalLeaderboard, { limit: 100 });

  if (!board) {
    return (
      <View style={styles.root}>
        <DeepBg />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.or2} />
        </View>
      </View>
    );
  }

  const top3 = board.slice(0, 3);
  const rest = board.slice(3, 30);
  const myEntry = convexUser?._id
    ? board.find((p) => p.userId === convexUser._id)
    : null;

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
        <View style={styles.header}>
          <LamapSectionLabel>Classement</LamapSectionLabel>
          <Text style={styles.title}>Le tableau d&apos;honneur</Text>
          <Pressable
            onPress={() => router.push("/leaderboard/ranks" as any)}
          >
            <Text style={styles.linkRight}>Voir l&apos;échelle des rangs →</Text>
          </Pressable>
        </View>

        <View style={styles.filterRow}>
          <LamapTabPillRow
            options={FILTERS}
            selected={filter}
            onSelect={setFilter}
          />
        </View>

        {filter !== "global" ? (
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={28} color={COLORS.or2} />
            <Text style={styles.emptyText}>Bientôt disponible.</Text>
          </View>
        ) : (
          <>
            {/* Podium */}
            {top3.length > 0 ? (
              <View style={styles.podium}>
                {[
                  top3[1] ?? null,
                  top3[0] ?? null,
                  top3[2] ?? null,
                ].map((entry, i) => {
                  if (!entry) {
                    return <View key={`empty-${i}`} style={styles.podiumCol} />;
                  }
                  const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
                  const color = PODIUM_COLORS[rank - 1];
                  const height = PODIUM_HEIGHTS[rank - 1];
                  return (
                    <Pressable
                      key={entry.userId}
                      style={styles.podiumCol}
                      onPress={() => router.push(`/user/${entry.userId}`)}
                    >
                      <Avatar
                        initials={initialsOf(entry.username)}
                        size={48}
                      />
                      <Text style={styles.podiumName} numberOfLines={1}>
                        {entry.username}
                      </Text>
                      <Text style={[styles.podiumPr, { color }]}>
                        {entry.pr} PR
                      </Text>
                      <View
                        style={[
                          styles.podiumBar,
                          {
                            height,
                            borderColor: color + "80",
                            backgroundColor: color + "30",
                            shadowColor: rank === 1 ? color : undefined,
                            shadowOpacity: rank === 1 ? 0.5 : 0,
                            shadowRadius: rank === 1 ? 18 : 0,
                          },
                        ]}
                      >
                        <Text style={[styles.podiumRank, { color }]}>
                          {rank}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}

            {/* List */}
            <View style={styles.list}>
              {rest.map((entry) => {
                const tier = prToDesignRank(entry.pr);
                return (
                  <Pressable
                    key={entry.userId}
                    style={styles.row}
                    onPress={() => router.push(`/user/${entry.userId}`)}
                  >
                    <Text style={styles.rowRank}>{entry.rank}</Text>
                    <Avatar
                      initials={initialsOf(entry.username)}
                      size={32}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowName}>{entry.username}</Text>
                      <Text style={styles.rowTier}>{tier.name}</Text>
                    </View>
                    <Text style={styles.rowPr}>{entry.pr}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* You */}
            {myEntry ? (
              <View style={styles.youRow}>
                <Text style={styles.youRank}>{myEntry.rank}</Text>
                <Avatar
                  initials={initialsOf(myEntry.username)}
                  size={32}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.youName}>Toi</Text>
                  <Text style={styles.youTier}>
                    {prToDesignRank(myEntry.pr).name}
                  </Text>
                </View>
                <Text style={styles.youPr}>{myEntry.pr}</Text>
              </View>
            ) : null}
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

function initialsOf(name: string): string {
  return (
    (name.match(/\b[A-ZÉÈÀÂÊÎÔÛ0-9]/giu) || [name[0] ?? "L"])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll: { paddingHorizontal: 20 },
  header: { gap: 6, marginBottom: 16 },
  title: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 28,
    color: COLORS.cream,
    letterSpacing: -0.6,
    marginTop: 4,
  },
  linkRight: {
    fontFamily: FONT_WEIGHTS.body.medium,
    fontSize: 12,
    color: COLORS.or2,
    marginTop: 4,
  },
  filterRow: { marginBottom: 18 },
  empty: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 80,
  },
  emptyText: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 14,
    color: "rgba(245, 242, 237, 0.55)",
  },
  podium: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 8,
    height: 240,
    marginBottom: 24,
  },
  podiumCol: {
    flex: 1,
    alignItems: "center",
  },
  podiumName: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 12,
    color: COLORS.cream,
    marginTop: 6,
  },
  podiumPr: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 10,
    marginTop: 2,
  },
  podiumBar: {
    marginTop: 6,
    width: "100%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1,
    borderBottomWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
  podiumRank: {
    fontFamily: FONT_WEIGHTS.display.extrabold,
    fontSize: 32,
    letterSpacing: -0.8,
  },
  list: { gap: 6 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: RADII.md,
    backgroundColor: "rgba(46, 61, 77, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(201, 168, 118, 0.12)",
  },
  rowRank: {
    width: 26,
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 16,
    color: "rgba(245, 242, 237, 0.4)",
    textAlign: "center",
  },
  rowName: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 13,
    color: COLORS.cream,
  },
  rowTier: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 10,
    color: COLORS.or2,
  },
  rowPr: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 14,
    color: COLORS.cream,
  },
  youRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: RADII.md,
    backgroundColor: "rgba(180, 68, 62, 0.18)",
    borderWidth: 1.5,
    borderColor: COLORS.terre2,
  },
  youRank: {
    width: 26,
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 16,
    color: COLORS.terre2,
    textAlign: "center",
  },
  youName: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 13,
    color: COLORS.cream,
  },
  youTier: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 10,
    color: COLORS.or2,
  },
  youPr: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 14,
    color: COLORS.cream,
  },
});
