import { AppBackdrop, PageTitle } from "@/components/lamap";
import { FONT_WEIGHTS, prToDesignRank, useTheme, type Theme } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Filter = "global" | "country" | "friends";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "global", label: "Mondial" },
  { id: "country", label: "National" },
  { id: "friends", label: "Amis" },
];

function initialsOf(name: string): string {
  return (name.match(/\b[A-ZÉÈÀÂÊÎÔÛ0-9]/giu) || [name[0] ?? "L"]).slice(0, 2).join("").toUpperCase();
}

export default function LeaderboardScreen() {
  const router = useRouter();
  const theme = useTheme();
  const s = makeStyles(theme);
  const { convexUser } = useAuth();
  const [filter, setFilter] = useState<Filter>("global");
  const board = useQuery(api.leaderboard.getGlobalLeaderboard, { limit: 100 });

  if (!board) {
    return (
      <View style={s.root}>
        <AppBackdrop />
        <SafeAreaView style={s.center}>
          <ActivityIndicator size="large" color={theme.gold} />
        </SafeAreaView>
      </View>
    );
  }

  const top3 = board.slice(0, 3);
  const rest = board.slice(3, 30);
  const myEntry = convexUser?._id ? board.find((p) => p.userId === convexUser._id) : null;
  const podiumOrder = [top3[1] ?? null, top3[0] ?? null, top3[2] ?? null];

  return (
    <View style={s.root}>
      <AppBackdrop dust={8} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          <PageTitle eyebrow="CLASSEMENT · SAISON 04" title="Top joueurs." />

          <View style={s.tabs}>
            {FILTERS.map((f) => {
              const active = f.id === filter;
              return (
                <Pressable
                  key={f.id}
                  onPress={() => setFilter(f.id)}
                  style={[
                    s.tab,
                    {
                      backgroundColor: active ? theme.goldA(0.18) : theme.surfA(0.55),
                      borderColor: active ? theme.goldA(0.5) : theme.goldA(0.12),
                    },
                  ]}
                >
                  <Text style={[s.tabText, { color: active ? theme.goldBright : theme.creamA(0.55) }]}>
                    {f.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {filter !== "global" ? (
            <View style={s.empty}>
              <Ionicons name="time-outline" size={28} color={theme.gold} />
              <Text style={s.emptyText}>Bientôt disponible.</Text>
            </View>
          ) : (
            <>
              {/* Podium */}
              <View style={s.podium}>
                {podiumOrder.map((entry, i) => {
                  if (!entry) return <View key={`e-${i}`} style={{ flex: 1 }} />;
                  const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
                  const winner = rank === 1;
                  const h = winner ? 108 : rank === 2 ? 88 : 72;
                  return (
                    <Pressable key={entry.userId} style={s.podCol} onPress={() => router.push(`/user/${entry.userId}`)}>
                      <View style={[s.podAvatar, { width: winner ? 56 : 44, height: winner ? 56 : 44, borderRadius: winner ? 28 : 22, backgroundColor: winner ? theme.gold : theme.accent }]}>
                        <Text style={[s.podInitials, { color: winner ? "#1F1810" : theme.cream }]}>
                          {initialsOf(entry.username)}
                        </Text>
                      </View>
                      <Text style={s.podName} numberOfLines={1}>{entry.username}</Text>
                      <Text style={s.podPr}>{entry.pr}</Text>
                      <View
                        style={[
                          s.podBar,
                          {
                            height: h,
                            backgroundColor: winner ? theme.goldA(0.4) : theme.accentA(0.3),
                            borderColor: winner ? theme.goldA(0.6) : theme.accentA(0.4),
                          },
                        ]}
                      >
                        <Text style={[s.podRank, { color: winner ? "#1F1810" : theme.cream }]}>{rank}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              {/* Rest */}
              <View style={s.list}>
                {rest.map((entry) => {
                  const tier = prToDesignRank(entry.pr);
                  return (
                    <Pressable key={entry.userId} style={s.row} onPress={() => router.push(`/user/${entry.userId}`)}>
                      <Text style={s.rowRank}>#{entry.rank}</Text>
                      <View style={[s.rowAvatar, { backgroundColor: theme.accent }]}>
                        <Text style={s.rowInitials}>{initialsOf(entry.username)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.rowName}>{entry.username}</Text>
                        <Text style={[s.rowTier, { color: tier.color }]}>{tier.name}</Text>
                      </View>
                      <Text style={s.rowPr}>{entry.pr.toLocaleString("fr-FR")}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {myEntry ? (
                <View style={[s.row, s.youRow]}>
                  <Text style={[s.rowRank, { color: theme.goldBright }]}>#{myEntry.rank}</Text>
                  <View style={[s.rowAvatar, { backgroundColor: theme.gold }]}>
                    <Text style={[s.rowInitials, { color: "#1F1810" }]}>{initialsOf(myEntry.username)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.rowName}>Toi</Text>
                    <Text style={[s.rowTier, { color: theme.gold }]}>{prToDesignRank(myEntry.pr).name}</Text>
                  </View>
                  <Text style={[s.rowPr, { color: theme.goldBright }]}>{myEntry.pr.toLocaleString("fr-FR")}</Text>
                </View>
              ) : null}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    tabs: { flexDirection: "row", gap: 8, paddingHorizontal: 20, paddingBottom: 16 },
    tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
    tabText: { fontFamily: FONT_WEIGHTS.display.semibold, fontSize: 12 },
    empty: { alignItems: "center", gap: 10, paddingVertical: 80 },
    emptyText: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 14, color: theme.creamA(0.55) },
    podium: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-around",
      gap: 10,
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 16,
      paddingBottom: 0,
      borderRadius: 18,
      backgroundColor: theme.goldA(0.08),
      borderWidth: 1,
      borderColor: theme.goldA(0.2),
      overflow: "hidden",
    },
    podCol: { flex: 1, alignItems: "center", gap: 6 },
    podAvatar: { alignItems: "center", justifyContent: "center" },
    podInitials: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 14 },
    podName: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 11, color: theme.cream, maxWidth: 90 },
    podPr: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 9, color: theme.goldBright },
    podBar: {
      width: "92%",
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderWidth: 1,
      borderBottomWidth: 0,
      alignItems: "center",
      paddingTop: 6,
    },
    podRank: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 18 },
    list: { paddingHorizontal: 20, gap: 6 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 12,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.goldA(0.1),
    },
    rowRank: { width: 30, fontFamily: FONT_WEIGHTS.mono.bold, fontSize: 11, color: theme.creamA(0.55) },
    rowAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
    rowInitials: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 11, color: theme.cream },
    rowName: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 13, color: theme.cream },
    rowTier: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 9, marginTop: 1 },
    rowPr: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 11, color: theme.goldBright, minWidth: 50, textAlign: "right" },
    youRow: { marginHorizontal: 20, marginTop: 12, backgroundColor: theme.goldA(0.1), borderColor: theme.goldA(0.4) },
  });
}
