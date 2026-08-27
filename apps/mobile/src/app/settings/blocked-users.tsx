import { Avatar } from "@/components/lamap";
import { useColors } from "@/hooks/use-colors";
import { api } from "@lamap/convex/_generated/api";
import type { Id } from "@lamap/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function BlockedUsersScreen() {
  const colors = useColors();
  const blocked = useQuery(api.moderation.listBlockedUsers, {});
  const unblock = useMutation(api.moderation.unblockUser);
  const ask = (userId: Id<"users">, username: string) => {
    Alert.alert("Débloquer", `Débloquer ${username} ?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Débloquer", onPress: () => void unblock({ blockedId: userId }) },
    ]);
  };
  if (!blocked)
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      {blocked.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: colors.mutedForeground }}>
            Aucun utilisateur bloqué.
          </Text>
        </View>
      ) : (
        blocked.map((user) => (
          <View
            key={user.userId}
            style={[styles.row, { backgroundColor: colors.card }]}
          >
            <Avatar
              initials={user.username.slice(0, 2).toUpperCase()}
              avatarId={user.avatarId}
              size={42}
            />
            <Text style={[styles.name, { color: colors.text }]}>
              {user.username}
            </Text>
            <Pressable
              onPress={() => ask(user.userId, user.username)}
              style={[styles.button, { borderColor: colors.border }]}
            >
              <Text style={{ color: colors.foreground }}>Débloquer</Text>
            </Pressable>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: 20, gap: 10 },
  center: {
    flex: 1,
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
  },
  name: { flex: 1, fontSize: 15, fontWeight: "700" },
  button: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
