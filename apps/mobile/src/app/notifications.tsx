import { AppBackdrop, AppBar, type ChipTone, PageTitle, RoundIcon, Surface } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function visualForType(type?: string): { icon: keyof typeof Ionicons.glyphMap; tone: ChipTone } {
  switch (type) {
    case "challenge":
      return { icon: "flash", tone: "ember" };
    case "message":
      return { icon: "chatbubble", tone: "gold" };
    case "match_found":
      return { icon: "people", tone: "accent" };
    case "turn":
      return { icon: "time", tone: "gold" };
    case "rank_up":
      return { icon: "trophy", tone: "gold" };
    case "currency":
      return { icon: "diamond", tone: "gold" };
    default:
      return { icon: "notifications", tone: "accent" };
  }
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 60) return `il y a ${Math.max(1, minutes)} min`;
  if (hours < 24) return `il y a ${hours} h`;
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days} j`;
  return format(date, "d MMM", { locale: fr });
}

export default function NotificationsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const s = makeStyles(theme);
  const { userId } = useAuth();

  const user = useQuery(api.users.getCurrentUser, userId ? { clerkUserId: userId } : "skip");
  const notifications = useQuery(
    api.notifications.getNotificationsForUser,
    user?._id ? { userId: user._id } : "skip",
  );

  const handlePress = (n: any) => {
    const data = n.data || {};
    if (data.type === "challenge" && data.challengeId) router.push(`/challenges/${data.challengeId}`);
    else if (data.type === "message") router.push("/(tabs)/messages" as never);
    else if ((data.type === "match_found" || data.type === "turn") && data.gameId)
      router.push(`/(game)/match/${data.gameId}`);
  };

  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop dust={6} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AppBar title="" />
        <PageTitle eyebrow="INBOX" title="Notifications." />
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {notifications === undefined ? (
            <ActivityIndicator size="large" color={theme.gold} style={{ marginTop: 40 }} />
          ) : notifications.length === 0 ? (
            <View style={s.empty}>
              <Ionicons name="notifications-outline" size={48} color={theme.creamA(0.4)} />
              <Text style={s.emptyText}>Aucune notification</Text>
              <Text style={s.emptySub}>
                Tu seras notifié des défis, messages et événements de partie.
              </Text>
            </View>
          ) : (
            <Surface style={s.list}>
              {notifications.map((n: any, i: number) => {
                const data = n.data || {};
                const v = visualForType(data.type);
                const isChallenge = data.type === "challenge";
                const last = i === notifications.length - 1;
                return (
                  <Pressable
                    key={n.id ?? n._id ?? i}
                    onPress={() => handlePress(n)}
                    style={[
                      s.row,
                      last ? null : { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.goldA(0.08) },
                    ]}
                  >
                    {!n.read ? <View style={[s.unread, { backgroundColor: theme.accentText }]} /> : null}
                    <RoundIcon name={v.icon} tone={v.tone} />
                    <View style={{ flex: 1 }}>
                      <Text style={s.rowTitle} numberOfLines={1}>
                        {n.title || "Notification"}
                      </Text>
                      {n.body ? (
                        <Text style={s.rowBody} numberOfLines={2}>{n.body}</Text>
                      ) : null}
                      <Text style={s.rowTime}>{formatTime(n._creationTime)}</Text>
                    </View>
                    {isChallenge ? (
                      <Ionicons name="chevron-forward" size={16} color={theme.creamA(0.4)} />
                    ) : null}
                  </Pressable>
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
    empty: { alignItems: "center", gap: 8, paddingVertical: 80, paddingHorizontal: 24 },
    emptyText: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 16, color: theme.cream, marginTop: 8 },
    emptySub: {
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 13,
      color: theme.creamA(0.5),
      textAlign: "center",
      maxWidth: 280,
      lineHeight: 19,
    },
    list: { marginHorizontal: 20, paddingHorizontal: 4 },
    row: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12, paddingVertical: 12 },
    unread: { position: "absolute", left: 2, top: "50%", width: 5, height: 5, borderRadius: 2.5 },
    rowTitle: { fontFamily: FONT_WEIGHTS.body.semibold, fontSize: 13, color: theme.cream },
    rowBody: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 12, color: theme.creamA(0.6), marginTop: 2, lineHeight: 17 },
    rowTime: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 9, color: theme.creamA(0.45), marginTop: 4 },
  });
}
