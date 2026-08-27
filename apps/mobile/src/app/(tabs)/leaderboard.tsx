import { AppBackdrop, Avatar, PageTitle } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { api } from "@lamap/convex/_generated/api";
import type { Id } from "@lamap/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  Alert,
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LeaderboardScreen() {
  const theme = useTheme();
  const s = styles(theme);
  const result = useQuery(api.ranking.getGlobalLeaderboard, { limit: 100 });
  const report = useMutation(api.moderation.reportUser);
  const block = useMutation(api.moderation.blockUser);
  if (!result) {
    return (
      <View style={s.loading}>
        <ActivityIndicator color={theme.gold} />
      </View>
    );
  }

  const moderate = (
    userId: Id<"users">,
    username: string,
    isCurrentUser: boolean,
  ) => {
    if (isCurrentUser) return;
    Alert.alert(username, "Que souhaitez-vous faire ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Signaler le pseudo",
        onPress: () =>
          void report({
            targetUserId: userId,
            reason: "inappropriate_username",
          }).then(() => Alert.alert("Signalement envoyé")),
      },
      {
        text: "Bloquer",
        style: "destructive",
        onPress: () =>
          void block({ blockedId: userId }).then(() =>
            Alert.alert("Joueur bloqué"),
          ),
      },
    ]);
  };

  return (
    <View style={s.root}>
      <AppBackdrop dust={8} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          <PageTitle
            eyebrow="CLASSEMENT MONDIAL"
            title="Les meilleurs joueurs."
          />
          <Text style={s.hint}>
            Maintenez un joueur pour le signaler ou le bloquer.
          </Text>
          {result.page.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyTitle}>Le classement est encore vide.</Text>
              <Text style={s.emptyBody}>
                Il apparaîtra après les premières parties classées.
              </Text>
            </View>
          ) : (
            <View style={s.list}>
              {result.page.map((entry) => (
                <Pressable
                  key={entry.userId}
                  onLongPress={() =>
                    moderate(entry.userId, entry.username, entry.isCurrentUser)
                  }
                  style={[s.row, entry.isCurrentUser && s.me]}
                >
                  <Text
                    style={[
                      s.position,
                      entry.position <= 3 && { color: theme.goldBright },
                    ]}
                  >
                    #{entry.position}
                  </Text>
                  <Avatar
                    initials={entry.username.slice(0, 2).toUpperCase()}
                    avatarId={entry.avatarId}
                    size={40}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={s.name}>
                      {entry.isCurrentUser
                        ? `${entry.username} · vous`
                        : entry.username}
                    </Text>
                    <Text style={s.world}>MONDIAL</Text>
                  </View>
                  <View style={s.points}>
                    <Text style={s.pointsValue}>{entry.points}</Text>
                    <Text style={s.pointsLabel}>PTS</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function styles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    loading: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.abyss,
    },
    scroll: { paddingBottom: 120 },
    hint: {
      paddingHorizontal: 20,
      marginTop: -10,
      marginBottom: 18,
      color: theme.creamA(0.48),
      fontSize: 12,
    },
    list: { paddingHorizontal: 20, gap: 8 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 13,
      borderRadius: 15,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.goldA(0.1),
    },
    me: { backgroundColor: theme.goldA(0.11), borderColor: theme.goldA(0.38) },
    position: {
      width: 38,
      fontFamily: FONT_WEIGHTS.mono.bold,
      color: theme.creamA(0.52),
      fontSize: 12,
    },
    name: {
      fontFamily: FONT_WEIGHTS.display.bold,
      color: theme.cream,
      fontSize: 14,
    },
    world: {
      marginTop: 3,
      fontFamily: FONT_WEIGHTS.mono.medium,
      fontSize: 8,
      letterSpacing: 1.2,
      color: theme.creamA(0.4),
    },
    points: { alignItems: "flex-end" },
    pointsValue: {
      fontFamily: FONT_WEIGHTS.display.extrabold,
      color: theme.goldBright,
      fontSize: 17,
    },
    pointsLabel: {
      fontFamily: FONT_WEIGHTS.mono.medium,
      color: theme.creamA(0.4),
      fontSize: 7,
      letterSpacing: 1,
    },
    empty: {
      margin: 20,
      padding: 28,
      borderRadius: 18,
      backgroundColor: theme.surface,
      alignItems: "center",
    },
    emptyTitle: {
      fontFamily: FONT_WEIGHTS.display.bold,
      fontSize: 18,
      color: theme.cream,
    },
    emptyBody: {
      marginTop: 8,
      textAlign: "center",
      color: theme.creamA(0.55),
      fontSize: 13,
    },
  });
}
