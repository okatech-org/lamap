import {
  AppBackdrop,
  Avatar,
  Row,
  RoundIcon,
  SectionHeader,
  Surface,
} from "@/components/lamap";
import { PRIVACY_URL, SUPPORT_URL, TERMS_URL } from "@/config/legal";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { useIap } from "@/hooks/use-iap";
import { useAuthActions } from "@convex-dev/auth/react";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const theme = useTheme();
  const s = styles(theme);
  const router = useRouter();
  const { convexUser } = useAuth();
  const stats = useQuery(api.users.getMyStats, {});
  const deleteAccount = useMutation(api.users.deleteAccount);
  const { signOut } = useAuthActions();
  const { restore } = useIap();
  if (!convexUser || !stats)
    return (
      <View style={s.loading}>
        <ActivityIndicator color={theme.gold} />
      </View>
    );
  const username = convexUser.username ?? "Joueur";

  const confirmDeletion = () => {
    Alert.alert(
      "Supprimer le compte ?",
      "Le profil, le classement et les données de jeu seront supprimés. Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () =>
            void deleteAccount({})
              .then(async () => {
                await signOut().catch(() => undefined);
                router.replace("/welcome");
              })
              .catch((error) =>
                Alert.alert(
                  "Suppression impossible",
                  error instanceof Error &&
                    error.message.includes("RECENT_SESSION_REQUIRED")
                    ? "Reconnectez-vous puis réessayez dans les 15 minutes."
                    : "Réessayez dans quelques instants.",
                ),
              ),
        },
      ],
    );
  };

  return (
    <View style={s.root}>
      <AppBackdrop dust={8} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.pageTitle}>Profil</Text>
          <Surface elevated style={s.hero}>
            <Avatar
              initials={username.slice(0, 2).toUpperCase()}
              avatarId={convexUser.activeAvatarId}
              size={78}
            />
            <Text style={s.username}>{username}</Text>
            <View style={s.stats}>
              <Stat label="Points" value={String(stats.points)} theme={theme} />
              <Stat
                label="Position"
                value={stats.position ? `#${stats.position}` : "—"}
                theme={theme}
              />
            </View>
          </Surface>

          <SectionHeader title="Compte et achats" />
          <Surface style={s.group}>
            <Row
              icon={<RoundIcon name="bag-check-outline" tone="gold" />}
              title="Restaurer mes achats"
              subtitle="Retrouver les cosmétiques achetés"
              onPress={() => void restore()}
              right={
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.creamA(0.4)}
                />
              }
            />
            <Row
              icon={<RoundIcon name="ban-outline" tone="neutral" />}
              title="Utilisateurs bloqués"
              onPress={() => router.push("/settings/blocked-users")}
              right={
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.creamA(0.4)}
                />
              }
            />
            <Row
              icon={<RoundIcon name="log-out-outline" tone="accent" />}
              title="Se déconnecter"
              onPress={() => void signOut()}
              last
            />
          </Surface>

          <SectionHeader title="Informations" />
          <Surface style={s.group}>
            <Row
              icon={<RoundIcon name="document-text-outline" tone="neutral" />}
              title="Conditions générales"
              onPress={() => void WebBrowser.openBrowserAsync(TERMS_URL)}
              right={
                <Ionicons
                  name="open-outline"
                  size={16}
                  color={theme.creamA(0.4)}
                />
              }
            />
            <Row
              icon={
                <RoundIcon name="shield-checkmark-outline" tone="neutral" />
              }
              title="Politique de confidentialité"
              onPress={() => void WebBrowser.openBrowserAsync(PRIVACY_URL)}
              right={
                <Ionicons
                  name="open-outline"
                  size={16}
                  color={theme.creamA(0.4)}
                />
              }
            />
            <Row
              icon={<RoundIcon name="help-circle-outline" tone="neutral" />}
              title="Support"
              onPress={() => void WebBrowser.openBrowserAsync(SUPPORT_URL)}
              right={
                <Ionicons
                  name="open-outline"
                  size={16}
                  color={theme.creamA(0.4)}
                />
              }
              last
            />
          </Surface>

          <SectionHeader title="Zone sensible" />
          <Surface style={s.group}>
            <Row
              icon={<RoundIcon name="trash-outline" tone="ember" />}
              title="Supprimer mon compte"
              subtitle="Suppression définitive"
              onPress={confirmDeletion}
              last
            />
          </Surface>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Stat({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: Theme;
}) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text
        style={{
          fontFamily: FONT_WEIGHTS.display.extrabold,
          fontSize: 18,
          color: theme.goldBright,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          marginTop: 3,
          fontFamily: FONT_WEIGHTS.mono.medium,
          fontSize: 7,
          letterSpacing: 1,
          color: theme.creamA(0.45),
        }}
      >
        {label.toUpperCase()}
      </Text>
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
    scroll: { padding: 20, paddingBottom: 120 },
    pageTitle: {
      fontFamily: FONT_WEIGHTS.display.bold,
      fontSize: 18,
      color: theme.cream,
    },
    hero: { marginTop: 20, padding: 22, alignItems: "center" },
    username: {
      marginTop: 12,
      fontFamily: FONT_WEIGHTS.display.extrabold,
      fontSize: 23,
      color: theme.cream,
    },
    stats: {
      alignSelf: "stretch",
      flexDirection: "row",
      marginTop: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.goldA(0.12),
    },
    group: { paddingHorizontal: 4 },
  });
}
