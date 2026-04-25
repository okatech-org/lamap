import {
  DeepBg,
  LamapSectionLabel,
  RankBadge,
} from "@/components/lamap";
import { COLORS, FONT_WEIGHTS, prToDesignRank, RADII, RANKS } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import { INITIAL_PR } from "@lamap/convex/ranking";
import { useQuery } from "convex/react";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RANGES = [
  "0 – 999",
  "1 000 – 1 199",
  "1 200 – 1 399",
  "1 400 – 1 599",
  "1 600 – 1 799",
  "1 800+",
];

export default function RankLadderScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const user = useQuery(
    api.users.getCurrentUser,
    userId ? { clerkUserId: userId } : "skip",
  );

  const pr = user?.pr ?? INITIAL_PR;
  const currentTier = prToDesignRank(pr);

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <DeepBg />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={22} color={COLORS.or2} />
          </Pressable>
          <Text style={styles.topTitle}>L&apos;Échelle</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <LamapSectionLabel>Votre rang</LamapSectionLabel>
            <View style={{ marginTop: 14 }}>
              <RankBadge
                rank={currentTier.name}
                size={72}
                showName
                points={pr}
              />
            </View>
          </View>

          {/* Ladder */}
          <View style={styles.ladder}>
            <LamapSectionLabel>Six rangs, une seule légende</LamapSectionLabel>
            <View style={styles.list}>
              {RANKS.map((tier, i) => {
                const isCurrent = tier.name === currentTier.name;
                return (
                  <View
                    key={tier.name}
                    style={[styles.row, isCurrent && styles.rowCurrent]}
                  >
                    <View style={styles.badgeWrap}>
                      <RankBadge rank={tier.name} size={48} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.tierName}>{tier.name}</Text>
                      <Text style={[styles.tierRange, { color: tier.color }]}>
                        {RANGES[i]} PR
                      </Text>
                    </View>
                    {isCurrent ? (
                      <View style={styles.youBadge}>
                        <Text style={styles.youBadgeText}>VOUS</Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.hairline,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 17,
    color: COLORS.cream,
    letterSpacing: -0.2,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 24 },
  hero: { alignItems: "center", marginBottom: 32 },
  ladder: { gap: 12 },
  list: { gap: 6, marginTop: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: RADII.md,
    backgroundColor: "rgba(46, 61, 77, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(201, 168, 118, 0.12)",
  },
  rowCurrent: {
    backgroundColor: "rgba(180, 68, 62, 0.18)",
    borderWidth: 1.5,
    borderColor: COLORS.terre2,
  },
  badgeWrap: {
    transform: [{ scale: 0.7 }],
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  tierName: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 15,
    color: COLORS.cream,
  },
  tierRange: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 10,
    marginTop: 2,
  },
  youBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: COLORS.terre,
  },
  youBadgeText: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 9,
    color: COLORS.cream,
    letterSpacing: 1,
  },
});
