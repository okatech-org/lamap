import { AppBackdrop } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Stub data — the friends backend (friends.ts) will be wired in a later pass.
type Friend = { name: string; initials: string; status: string; online: boolean };

const ONLINE: Friend[] = [
  { name: "Le Grand Bandi", initials: "LB", status: "EN MATCH", online: true },
  { name: "Maestro", initials: "MA", status: "EN LIGNE", online: true },
  { name: "D. Tigre", initials: "DT", status: "EN LIGNE", online: true },
];
const OFFLINE: Friend[] = [
  { name: "P. Glass", initials: "PG", status: "il y a 2 h", online: false },
  { name: "F. Komo", initials: "FK", status: "hier", online: false },
];

export default function SocialScreen() {
  const theme = useTheme();
  const router = useRouter();
  const s = makeStyles(theme);

  return (
    <View style={s.root}>
      <AppBackdrop dust={8} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.header}>
            <Text style={s.headerTitle}>Social</Text>
            <Pressable style={s.addBtn}>
              <Ionicons name="add" size={22} color={theme.goldBright} />
            </Pressable>
          </View>

          <View style={s.titleBlock}>
            <Text style={s.eyebrow}>AMIS</Text>
            <Text style={s.title}>Tes alliés.</Text>
          </View>

          {/* Search (stub) */}
          <View style={s.search}>
            <Ionicons name="search" size={16} color={theme.goldA(0.5)} />
            <Text style={s.searchPlaceholder}>Rechercher par pseudo ou code…</Text>
          </View>

          {/* Classement quick link (moved out of the bottom bar) */}
          <Pressable
            style={s.linkCard}
            onPress={() => router.push("/(tabs)/leaderboard")}
          >
            <View style={[s.linkIcon, { backgroundColor: theme.goldA(0.15) }]}>
              <Ionicons name="trophy" size={18} color={theme.goldBright} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.linkTitle}>Classement</Text>
              <Text style={s.linkSub}>Saison 04 · top joueurs</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.creamA(0.4)} />
          </Pressable>

          <Text style={s.sectionTitle}>En ligne · {ONLINE.length}</Text>
          <View style={s.group}>
            {ONLINE.map((f, i) => (
              <FriendRow
                key={f.name}
                friend={f}
                theme={theme}
                last={i === ONLINE.length - 1}
              />
            ))}
          </View>

          <Text style={s.sectionTitle}>Hors ligne · {OFFLINE.length}</Text>
          <View style={s.group}>
            {OFFLINE.map((f, i) => (
              <FriendRow
                key={f.name}
                friend={f}
                theme={theme}
                last={i === OFFLINE.length - 1}
              />
            ))}
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function FriendRow({
  friend,
  theme,
  last,
}: {
  friend: Friend;
  theme: Theme;
  last: boolean;
}) {
  const dotColor =
    friend.status === "EN MATCH" ? theme.gold : friend.online ? "#5BD27A" : theme.creamA(0.3);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
        borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
        borderBottomColor: theme.goldA(0.08),
      }}
    >
      <View style={{ position: "relative" }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.accent,
          }}
        >
          <Text
            style={{
              fontFamily: FONT_WEIGHTS.display.bold,
              fontSize: 14,
              color: theme.cream,
            }}
          >
            {friend.initials}
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: dotColor,
            borderWidth: 2,
            borderColor: theme.night,
          }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{ fontFamily: FONT_WEIGHTS.display.bold, fontSize: 14, color: theme.cream }}
        >
          {friend.name}
        </Text>
        <Text
          style={{
            fontFamily: FONT_WEIGHTS.mono.medium,
            fontSize: 9,
            letterSpacing: 1.2,
            color: friend.online ? theme.accentText : theme.creamA(0.4),
            marginTop: 2,
          }}
        >
          {friend.status}
        </Text>
      </View>
      <Pressable
        style={{
          paddingHorizontal: 12,
          paddingVertical: 7,
          borderRadius: 999,
          backgroundColor: friend.online ? theme.goldA(0.18) : theme.surfA(0.6),
          borderWidth: 1,
          borderColor: friend.online ? theme.goldA(0.4) : theme.goldA(0.15),
        }}
      >
        <Text
          style={{
            fontFamily: FONT_WEIGHTS.display.semibold,
            fontSize: 11,
            color: friend.online ? theme.goldBright : theme.creamA(0.55),
          }}
        >
          {friend.online ? "Défier" : "Voir"}
        </Text>
      </Pressable>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    content: { paddingHorizontal: 20, paddingTop: 4 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      fontFamily: FONT_WEIGHTS.display.bold,
      fontSize: 17,
      color: theme.cream,
    },
    addBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.surfA(0.7),
      borderWidth: 1,
      borderColor: theme.goldA(0.2),
    },
    titleBlock: { paddingTop: 18, paddingBottom: 14 },
    eyebrow: {
      fontFamily: FONT_WEIGHTS.mono.semibold,
      fontSize: 10,
      letterSpacing: 2.6,
      color: theme.gold,
      marginBottom: 6,
    },
    title: {
      fontFamily: FONT_WEIGHTS.display.extrabold,
      fontSize: 30,
      letterSpacing: -0.7,
      color: theme.cream,
    },
    search: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 14,
      paddingVertical: 11,
      borderRadius: 14,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.goldA(0.12),
      marginBottom: 18,
    },
    searchPlaceholder: {
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 13,
      color: theme.creamA(0.45),
    },
    linkCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
      borderRadius: 16,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.goldA(0.12),
      marginBottom: 22,
    },
    linkIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    linkTitle: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 14, color: theme.cream },
    linkSub: {
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 11,
      color: theme.creamA(0.5),
      marginTop: 2,
    },
    sectionTitle: {
      fontFamily: FONT_WEIGHTS.display.bold,
      fontSize: 15,
      color: theme.cream,
      marginBottom: 10,
    },
    group: {
      borderRadius: 18,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.goldA(0.1),
      marginBottom: 22,
      overflow: "hidden",
    },
  });
}
