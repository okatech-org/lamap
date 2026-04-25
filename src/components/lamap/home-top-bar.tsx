import { COLORS, FONT_WEIGHTS } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "./avatar";
import { LamapBalanceChip } from "./balance-chip";

/**
 * Header used on the Home tab. Replaces the generic TopBar (bell + title +
 * gear) with: greeting block (avatar + name) on the left, balance chip + bell
 * + settings on the right. Notifications and settings remain reachable.
 */
export function HomeTopBar() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();

  const user = useQuery(
    api.users.getCurrentUser,
    userId ? { clerkUserId: userId } : "skip",
  );
  const notifications = useQuery(
    api.notifications.getNotificationsForUser,
    user?._id ? { userId: user._id as any, limit: 50 } : "skip",
  );

  const unread =
    notifications?.filter(
      (n: any) =>
        n.state !== "delivered" &&
        n.state !== "failed" &&
        n.state !== "unable_to_deliver",
    ).length || 0;

  const greetingName =
    user?.firstName?.trim() || user?.username?.trim() || "Joueur";
  const initials = (greetingName.match(/\b[A-ZÉÈÀÂÊÎÔÛ]/giu) || ["L"])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8, paddingBottom: 12 },
      ]}
    >
      <Pressable
        style={styles.greeting}
        onPress={() => router.push("/(tabs)/profile")}
        accessibilityRole="button"
        accessibilityLabel={`Profil de ${greetingName}`}
      >
        <Avatar initials={initials} size={40} />
        <View>
          <Text style={styles.hello}>Salut,</Text>
          <Text style={styles.name}>{greetingName}</Text>
        </View>
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          onPress={() => router.push("/(tabs)/wallet")}
          accessibilityRole="button"
          accessibilityLabel="Portefeuille"
        >
          <LamapBalanceChip amount={user?.balance ?? 0} />
        </Pressable>
        <Pressable
          style={styles.iconBtn}
          onPress={() => router.push("/notifications")}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={COLORS.or2}
          />
          {unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unread > 99 ? "99+" : unread}
              </Text>
            </View>
          )}
        </Pressable>
        <Pressable
          style={styles.iconBtn}
          onPress={() => router.push("/settings")}
          accessibilityRole="button"
          accessibilityLabel="Paramètres"
        >
          <Ionicons name="settings-outline" size={22} color={COLORS.or2} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.hairline,
  },
  greeting: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  hello: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 11,
    color: "rgba(245, 242, 237, 0.5)",
  },
  name: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 15,
    color: COLORS.cream,
    letterSpacing: -0.2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: COLORS.terre,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COLORS.bg,
  },
  badgeText: {
    fontFamily: FONT_WEIGHTS.body.bold,
    fontSize: 9,
    color: COLORS.cream,
    lineHeight: 11,
  },
});
