import { AppBackdrop, Row, RoundIcon, SectionHeader, Surface } from "@/components/lamap";
import { FONT_WEIGHTS, prToDesignRank, useTheme, type Theme } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import { INITIAL_PR } from "@lamap/convex/ranking";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const s = makeStyles(theme);
  const { userId } = useAuth();

  const user = useQuery(api.users.getCurrentUser, userId ? { clerkUserId: userId } : "skip");
  const stats = useQuery(api.users.getUserStats, userId ? { clerkUserId: userId } : "skip");

  if (!user || !stats) {
    return (
      <View style={s.root}>
        <AppBackdrop />
        <SafeAreaView style={s.center}>
          <ActivityIndicator size="large" color={theme.gold} />
        </SafeAreaView>
      </View>
    );
  }

  const pr = user.pr ?? INITIAL_PR;
  const tier = prToDesignRank(pr);
  const name = user.firstName?.trim() || user.username || "Joueur";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <View style={s.root}>
      <AppBackdrop dust={10} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <View style={s.header}>
            <Text style={s.headerTitle}>Profil</Text>
            <Pressable style={s.gear} onPress={() => router.push("/settings")}>
              <Ionicons name="settings-outline" size={18} color={theme.cream} />
            </Pressable>
          </View>

          {/* Identity hero */}
          <Surface elevated style={s.hero}>
            <View style={s.heroGlow} />
            <View style={s.heroTop}>
              <View style={[s.avatar, { borderColor: theme.goldA(0.45) }]}>
                <Text style={s.avatarText}>{initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{name}</Text>
                <View style={s.rankRow}>
                  <View style={[s.rankDot, { backgroundColor: tier.color }]} />
                  <Text style={[s.rankName, { color: tier.color }]}>{tier.name}</Text>
                  <Text style={s.prMono}>{pr} PR</Text>
                </View>
              </View>
            </View>

            <View style={s.statsGrid}>
              <Stat theme={theme} label="Victoires" value={String(stats.wins)} />
              <Stat theme={theme} label="Taux" value={`${Math.round(stats.winRate)}%`} gold />
              <Stat theme={theme} label="Parties" value={String(stats.totalGames)} />
              <Stat theme={theme} label="Streak" value={String(stats.bestStreak)} />
            </View>
          </Surface>

          <SectionHeader title="Mon parcours" />
          <Surface style={s.group}>
            <Row
              icon={<RoundIcon name="trending-up" tone="accent" />}
              title="Échelle des rangs"
              subtitle={`${tier.name} · ${pr} PR`}
              right={<Ionicons name="chevron-forward" size={16} color={theme.creamA(0.4)} />}
              onPress={() => router.push("/(tabs)/leaderboard")}
            />
            <Row
              icon={<RoundIcon name="star" tone="gold" />}
              title="Passe de saison"
              subtitle="Saison 04 · Cercle de Feu"
              right={<Ionicons name="chevron-forward" size={16} color={theme.creamA(0.4)} />}
              onPress={() => router.push("/season")}
            />
            <Row
              icon={<RoundIcon name="time-outline" tone="accent" />}
              title="Historique de matchs"
              subtitle={`${stats.totalGames} parties jouées`}
              right={<Ionicons name="chevron-forward" size={16} color={theme.creamA(0.4)} />}
              onPress={() => router.push("/history")}
              last
            />
          </Surface>

          <SectionHeader title="Personnalisation" />
          <Surface style={s.group}>
            <Row
              icon={<RoundIcon name="diamond-outline" tone="gold" />}
              title="Mes cosmétiques"
              subtitle="Dos de cartes & cadres"
              right={<Ionicons name="chevron-forward" size={16} color={theme.creamA(0.4)} />}
              onPress={() => router.push("/(tabs)/shop")}
            />
            <Row
              icon={<RoundIcon name="gift-outline" tone="accent" />}
              title="Offrir des Kora"
              subtitle="À un ami"
              right={<Ionicons name="chevron-forward" size={16} color={theme.creamA(0.4)} />}
              onPress={() => router.push("/gift")}
            />
            <Row
              icon={<RoundIcon name="ribbon-outline" tone="gold" />}
              title="Pass VIP"
              subtitle="Statut & privilèges"
              right={<Ionicons name="chevron-forward" size={16} color={theme.creamA(0.4)} />}
              onPress={() => router.push("/vip")}
              last
            />
          </Surface>

          <View style={{ height: 110 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Stat({ theme, label, value, gold }: { theme: Theme; label: string; value: string; gold?: boolean }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 7, letterSpacing: 1.6, color: theme.creamA(0.5) }}>
        {label.toUpperCase()}
      </Text>
      <Text
        style={{
          fontFamily: FONT_WEIGHTS.display.extrabold,
          fontSize: 18,
          color: gold ? theme.goldBright : theme.cream,
          marginTop: 3,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    scroll: { paddingHorizontal: 20, paddingTop: 4 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    headerTitle: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 17, color: theme.cream },
    gear: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.surfA(0.7),
      borderWidth: 1,
      borderColor: theme.goldA(0.2),
    },
    hero: { marginTop: 20, padding: 20, overflow: "hidden" },
    heroGlow: {
      position: "absolute",
      top: -30,
      right: -30,
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: theme.accentA(0.25),
    },
    heroTop: { flexDirection: "row", alignItems: "center", gap: 14 },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.accent,
      borderWidth: 1.5,
    },
    avatarText: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 24, color: theme.cream },
    name: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 22, color: theme.cream },
    rankRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 8 },
    rankDot: { width: 8, height: 8, borderRadius: 4 },
    rankName: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 13 },
    prMono: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 10, color: theme.goldBright, marginLeft: 4 },
    statsGrid: {
      flexDirection: "row",
      marginTop: 18,
      padding: 14,
      borderRadius: 14,
      backgroundColor: "rgba(0,0,0,0.3)",
      borderWidth: 1,
      borderColor: theme.goldA(0.1),
    },
    group: { marginHorizontal: 0, marginTop: 4, paddingHorizontal: 4 },
  });
}
