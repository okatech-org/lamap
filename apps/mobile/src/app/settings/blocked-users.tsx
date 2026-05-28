import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BlockedUsersScreen() {
  const colors = useColors();
  const { convexUser } = useAuth();
  const myUserId = convexUser?._id;

  const blocked = useQuery(
    (api as any).moderation.listBlockedUsers,
    myUserId ? { userId: myUserId } : "skip"
  );
  const unblockUser = useMutation((api as any).moderation.unblockUser);

  const handleUnblock = (blockedId: string, username: string) => {
    if (!myUserId) return;
    Alert.alert(
      "Débloquer",
      `Voulez-vous débloquer ${username} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Débloquer",
          onPress: async () => {
            try {
              await unblockUser({
                blockerId: myUserId,
                blockedId: blockedId as any,
              });
            } catch (err) {
              Alert.alert(
                "Erreur",
                err instanceof Error ? err.message : "Action impossible.",
              );
            }
          },
        },
      ],
    );
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 24 },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 48,
    },
    emptyText: { color: colors.mutedForeground, fontSize: 16 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      gap: 12,
    },
    info: { flex: 1 },
    username: { color: colors.text, fontSize: 16, fontWeight: "600" },
    unblockButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.secondary,
    },
    unblockText: { color: colors.secondaryForeground, fontWeight: "600" },
    footer: {
      marginTop: 16,
      color: colors.mutedForeground,
      fontSize: 12,
      textAlign: "center",
    },
  });

  if (!myUserId || blocked === undefined) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView contentContainerStyle={styles.content}>
        {blocked.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="ban-outline"
              size={48}
              color={colors.mutedForeground}
            />
            <Text style={styles.emptyText}>Aucun utilisateur bloqué</Text>
          </View>
        ) : (
          blocked.map((u: any) => (
            <View key={u._id} style={styles.row}>
              <Avatar name={u.username} size={40} />
              <View style={styles.info}>
                <Text style={styles.username}>{u.username}</Text>
              </View>
              <TouchableOpacity
                style={styles.unblockButton}
                onPress={() => handleUnblock(u._id, u.username)}
              >
                <Text style={styles.unblockText}>Débloquer</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
        <Text style={styles.footer}>
          Les blocages s&apos;appliquent conformément à nos CGU.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
