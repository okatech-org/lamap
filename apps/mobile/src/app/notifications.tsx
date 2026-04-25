import { DeepBg } from "@/components/lamap";
import { COLORS, FONT_WEIGHTS, RADII } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Stack, useRouter } from "expo-router";
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

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface NotifVisual {
  icon: IconName;
  color: string;
}

function visualForType(type?: string): NotifVisual {
  switch (type) {
    case "challenge":
      return { icon: "flash-outline", color: COLORS.terre2 };
    case "message":
      return { icon: "chatbubble-outline", color: COLORS.or2 };
    case "match_found":
      return { icon: "people-outline", color: COLORS.terre2 };
    case "turn":
      return { icon: "time-outline", color: COLORS.or2 };
    case "rank_up":
      return { icon: "trophy-outline", color: "#E8C879" };
    case "currency":
      return { icon: "diamond-outline", color: COLORS.or2 };
    default:
      return { icon: "notifications-outline", color: COLORS.or2 };
  }
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `il y a ${Math.max(1, minutes)} min`;
  if (hours < 24) return `il y a ${hours}h`;
  if (days === 1) return "Hier";
  if (days < 7) return `il y a ${days}j`;
  return format(date, "d MMM", { locale: fr });
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { userId } = useAuth();

  const user = useQuery(
    api.users.getCurrentUser,
    userId ? { clerkUserId: userId } : "skip",
  );
  const notifications = useQuery(
    api.notifications.getNotificationsForUser,
    user?._id ? { userId: user._id } : "skip",
  );

  const handlePress = (n: any) => {
    const data = n.data || {};
    if (data.type === "challenge" && data.challengeId) {
      router.push(`/challenges/${data.challengeId}`);
    } else if (data.type === "message") {
      router.push("/(tabs)/messages" as any);
    } else if (
      (data.type === "match_found" || data.type === "turn") &&
      data.gameId
    ) {
      router.push(`/(game)/match/${data.gameId}`);
    }
  };

  if (!user) {
    return (
      <View style={styles.root}>
        <DeepBg />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.or2} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <DeepBg dustCount={6} dustOpacity={0.25} />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={22} color={COLORS.or2} />
          </Pressable>
          <Text style={styles.title}>Notifications</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {notifications === undefined ? (
            <View style={styles.empty}>
              <ActivityIndicator size="large" color={COLORS.or2} />
            </View>
          ) : notifications.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons
                name="notifications-outline"
                size={48}
                color="rgba(245, 242, 237, 0.4)"
              />
              <Text style={styles.emptyText}>Aucune notification</Text>
              <Text style={styles.emptySub}>
                Tu seras notifié des défis, messages et événements de partie.
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {notifications.map((n: any) => {
                const data = n.data || {};
                const isChallenge = data.type === "challenge";
                if (isChallenge) {
                  return (
                    <ChallengeRow
                      key={n.id}
                      notification={n}
                      onPress={() => handlePress(n)}
                    />
                  );
                }
                const v = visualForType(data.type);
                return (
                  <Pressable
                    key={n.id}
                    style={styles.row}
                    onPress={() => handlePress(n)}
                  >
                    <View
                      style={[
                        styles.iconTile,
                        { borderColor: COLORS.hairline },
                      ]}
                    >
                      <Ionicons name={v.icon} size={20} color={v.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle} numberOfLines={1}>
                        {n.title || "Notification"}
                      </Text>
                      {n.body ? (
                        <Text style={styles.rowBody} numberOfLines={2}>
                          {n.body}
                        </Text>
                      ) : null}
                      <Text style={styles.rowTime}>
                        {formatTime(n._creationTime)}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ChallengeRow({
  notification,
  onPress,
}: {
  notification: any;
  onPress: () => void;
}) {
  const sender = notification.data?.senderUsername ?? "Un joueur";
  const stake = notification.data?.betAmount;
  return (
    <Pressable style={styles.challenge} onPress={onPress}>
      <View style={styles.challengeRow}>
        <View
          style={[
            styles.iconTile,
            {
              borderColor: COLORS.terre2,
              backgroundColor: "rgba(180, 68, 62, 0.18)",
            },
          ]}
        >
          <Ionicons name="flash-outline" size={20} color={COLORS.terre2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>
            <Text style={styles.bold}>{sender}</Text> te défie
          </Text>
          <Text style={styles.challengeMeta}>
            {formatTime(notification._creationTime)}
            {stake ? ` · Mise ${stake.toLocaleString("fr-FR")} K` : ""}
          </Text>
        </View>
        <View style={styles.unreadDot} />
      </View>
      <Text style={styles.openLink}>Ouvrir le défi →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
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
  title: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 17,
    color: COLORS.cream,
    letterSpacing: -0.2,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  empty: { alignItems: "center", gap: 8, paddingVertical: 80 },
  emptyText: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 16,
    color: COLORS.cream,
    marginTop: 8,
  },
  emptySub: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 13,
    color: "rgba(245, 242, 237, 0.5)",
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 19,
  },
  list: { gap: 6 },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 12,
    borderRadius: RADII.md,
    backgroundColor: "rgba(46, 61, 77, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(201, 168, 118, 0.1)",
  },
  iconTile: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 22, 32, 0.7)",
    borderWidth: 1,
  },
  rowTitle: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 13,
    color: COLORS.cream,
  },
  rowBody: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 12,
    color: "rgba(245, 242, 237, 0.7)",
    marginTop: 2,
    lineHeight: 17,
  },
  rowTime: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 10,
    color: "rgba(245, 242, 237, 0.45)",
    marginTop: 4,
  },
  bold: { fontFamily: FONT_WEIGHTS.body.bold },
  challenge: {
    padding: 14,
    borderRadius: RADII.lg,
    backgroundColor: "rgba(180, 68, 62, 0.18)",
    borderWidth: 1.5,
    borderColor: COLORS.terre2,
    gap: 10,
  },
  challengeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  challengeMeta: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 10,
    color: COLORS.or2,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.terre2,
    shadowColor: COLORS.terre2,
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  openLink: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 12,
    color: COLORS.or2,
  },
});
