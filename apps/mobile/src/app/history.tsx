import { AppBackdrop, AppBar, PageTitle, Surface } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@lamap/convex/_generated/api";
import { useQuery } from "convex/react";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Filter = "Tous" | "Victoires" | "Défaites" | "Classés";
const FILTERS: Filter[] = ["Tous", "Victoires", "Défaites", "Classés"];

function modeLabel(mode: string): string {
  return { AI: "IA", RANKED: "Classé", ONLINE: "Privé", CASH: "Mise" }[mode] ?? mode;
}

function formatDate(ts: number | null | undefined): string {
  if (!ts) return "";
  const d = new Date(ts);
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 60) return `il y a ${Math.max(1, mins)} min`;
  if (mins < 1440) return `il y a ${Math.floor(mins / 60)} h`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function HistoryScreen() {
  const theme = useTheme();
  const s = makeStyles(theme);
  const [filter, setFilter] = useState<Filter>("Tous");
  const { userId } = useAuth();
  const games = useQuery(
    api.games.getRecentGames,
    userId ? { clerkUserId: userId, limit: 30 } : "skip",
  );

  const filtered = (games ?? []).filter((g) => {
    if (filter === "Victoires") return g.result === "win";
    if (filter === "Défaites") return g.result !== "win";
    if (filter === "Classés") return g.mode === "RANKED";
    return true;
  });

  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop dust={8} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AppBar />
        <PageTitle eyebrow="HISTORIQUE" title="Tes matchs." />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filtersScroll}
          contentContainerStyle={s.filters}
        >
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[
                  s.filterChip,
                  {
                    backgroundColor: active ? theme.goldA(0.18) : theme.surfA(0.55),
                    borderColor: active ? theme.goldA(0.5) : theme.goldA(0.12),
                  },
                ]}
              >
                <Text style={[s.filterText, { color: active ? theme.goldBright : theme.creamA(0.55) }]}>
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {games === undefined ? (
            <ActivityIndicator size="large" color={theme.gold} style={{ marginTop: 40 }} />
          ) : filtered.length === 0 ? (
            <Text style={s.empty}>Aucun match pour ce filtre.</Text>
          ) : (
            <Surface style={s.list}>
              {filtered.map((g, i) => {
                const won = g.result === "win";
                return (
                  <View
                    key={g.gameId}
                    style={[
                      s.row,
                      i === filtered.length - 1 ? null : { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.goldA(0.08) },
                    ]}
                  >
                    <View
                      style={[
                        s.bar,
                        { backgroundColor: won ? theme.gold : theme.ember },
                      ]}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={s.opp}>vs {g.opponentName}</Text>
                      <Text style={s.meta}>
                        {modeLabel(g.mode)} · {formatDate(g.endedAt)}
                      </Text>
                    </View>
                    <Text style={[s.result, { color: won ? theme.goldBright : theme.chipEmberColor }]}>
                      {won ? "Victoire" : "Défaite"}
                    </Text>
                  </View>
                );
              })}
            </Surface>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    filtersScroll: { flexGrow: 0 },
    filters: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
    filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
    filterText: { fontFamily: FONT_WEIGHTS.display.semibold, fontSize: 11 },
    empty: {
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 14,
      color: theme.creamA(0.5),
      textAlign: "center",
      marginTop: 40,
    },
    list: { marginHorizontal: 20, paddingHorizontal: 4 },
    row: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12, paddingVertical: 12 },
    bar: { width: 4, height: 36, borderRadius: 99 },
    opp: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 13, color: theme.cream },
    meta: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 11, color: theme.creamA(0.5), marginTop: 2 },
    result: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 13 },
  });
}
