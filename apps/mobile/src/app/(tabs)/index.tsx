import { AppBackdrop, Avatar, LamapButton, Surface } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlayScreen() {
  const router = useRouter();
  const theme = useTheme();
  const s = styles(theme);
  const { convexUser } = useAuth();
  const activeGame = useQuery(api.games.getActiveMatch, {});
  const position = useQuery(api.ranking.getMyPosition, {});
  if (!convexUser || activeGame === undefined || position === undefined) {
    return <Loading />;
  }
  const username = convexUser.username ?? "Joueur";
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <View style={s.root}>
      <AppBackdrop dust={10} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.header}>
            <Pressable onPress={() => router.push("/(tabs)/profile")}>
              <Avatar
                initials={initials}
                avatarId={convexUser.activeAvatarId}
                size={44}
              />
            </Pressable>
            <View style={s.points}>
              <Text style={s.pointsValue}>
                {convexUser.rankingPoints ?? 500}
              </Text>
              <Text style={s.pointsLabel}>POINTS</Text>
            </View>
          </View>

          <Text style={s.eyebrow}>BONJOUR {username.toUpperCase()}</Text>
          <Text style={s.title}>À toi de jouer.</Text>
          {position ? (
            <Text style={s.position}>
              Position mondiale #{position.position}
            </Text>
          ) : (
            <Text style={s.position}>
              Joue ton premier match classé pour entrer au classement.
            </Text>
          )}

          {activeGame ? (
            <Pressable
              style={s.resume}
              onPress={() => router.push(`/(game)/match/${activeGame.gameId}`)}
            >
              <View style={s.resumeDot} />
              <View style={{ flex: 1 }}>
                <Text style={s.resumeLabel}>PARTIE EN COURS</Text>
                <Text style={s.resumeTitle}>
                  {activeGame.mode === "RANKED"
                    ? "Match classé"
                    : "Entraînement"}
                </Text>
              </View>
              <Ionicons
                name="arrow-forward-circle"
                size={32}
                color={theme.goldBright}
              />
            </Pressable>
          ) : null}

          <View style={s.modeList}>
            <ModeCard
              theme={theme}
              icon="podium-outline"
              title="Match classé"
              body="Affronte un joueur et fais évoluer tes points."
              action="Trouver un adversaire"
              onPress={() => router.push("/(lobby)/ranked-matchmaking")}
              primary
            />
            <ModeCard
              theme={theme}
              icon="school-outline"
              title="Entraînement"
              body="Joue contre l’IA sans modifier ton classement."
              action="Choisir la difficulté"
              onPress={() => router.push("/(lobby)/select-difficulty")}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Loading() {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.abyss,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator color={theme.gold} />
    </View>
  );
}

function ModeCard({
  theme,
  icon,
  title,
  body,
  action,
  onPress,
  primary = false,
}: {
  theme: Theme;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  action: string;
  onPress: () => void;
  primary?: boolean;
}) {
  const s = styles(theme);
  return (
    <Surface elevated={primary} style={s.modeCard}>
      <View
        style={[
          s.modeIcon,
          {
            backgroundColor: primary ? theme.accentA(0.25) : theme.goldA(0.14),
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={28}
          color={primary ? theme.accentText : theme.goldBright}
        />
      </View>
      <Text style={s.modeTitle}>{title}</Text>
      <Text style={s.modeBody}>{body}</Text>
      <LamapButton
        title={action}
        variant={primary ? "primary" : "gold"}
        onPress={onPress}
      />
    </Surface>
  );
}

function styles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    scroll: { padding: 20, paddingBottom: 120 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    points: { alignItems: "flex-end" },
    pointsValue: {
      fontFamily: FONT_WEIGHTS.display.extrabold,
      fontSize: 22,
      color: theme.goldBright,
    },
    pointsLabel: {
      fontFamily: FONT_WEIGHTS.mono.medium,
      fontSize: 8,
      letterSpacing: 1.5,
      color: theme.creamA(0.5),
    },
    eyebrow: {
      marginTop: 42,
      fontFamily: FONT_WEIGHTS.mono.semibold,
      fontSize: 10,
      letterSpacing: 1.8,
      color: theme.gold,
    },
    title: {
      marginTop: 8,
      fontFamily: FONT_WEIGHTS.display.extrabold,
      fontSize: 42,
      color: theme.cream,
    },
    position: {
      marginTop: 8,
      minHeight: 38,
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 14,
      lineHeight: 20,
      color: theme.creamA(0.62),
    },
    resume: {
      marginTop: 22,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.goldA(0.1),
      borderWidth: 1,
      borderColor: theme.goldA(0.35),
    },
    resumeDot: {
      width: 9,
      height: 9,
      borderRadius: 5,
      backgroundColor: theme.accentGlow,
    },
    resumeLabel: {
      fontFamily: FONT_WEIGHTS.mono.semibold,
      fontSize: 8,
      letterSpacing: 1.5,
      color: theme.gold,
    },
    resumeTitle: {
      marginTop: 3,
      fontFamily: FONT_WEIGHTS.display.bold,
      fontSize: 16,
      color: theme.cream,
    },
    modeList: { gap: 14, marginTop: 24 },
    modeCard: { padding: 20 },
    modeIcon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    modeTitle: {
      marginTop: 18,
      fontFamily: FONT_WEIGHTS.display.extrabold,
      fontSize: 23,
      color: theme.cream,
    },
    modeBody: {
      marginTop: 7,
      marginBottom: 20,
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 14,
      lineHeight: 20,
      color: theme.creamA(0.62),
    },
  });
}
