import { AppBackdrop, AppBar, LamapButton, PageTitle, Surface } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@lamap/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JoinFriendlyScreen() {
  const theme = useTheme();
  const s = makeStyles(theme);
  const router = useRouter();
  const { userId } = useAuth();
  const user = useQuery(api.users.getCurrentUser, userId ? { clerkUserId: userId } : "skip");
  const joinFriendlyMatch = useMutation(api.friendlyMatches.joinFriendlyMatch);
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);

  const matchInfo = useQuery(
    api.friendlyMatches.getFriendlyMatchByCode,
    joinCode.length === 6 ? { joinCode: joinCode.toUpperCase() } : "skip",
  );

  const handleJoin = async () => {
    if (!userId || !user?._id) {
      Alert.alert("Erreur", "Vous devez être connecté pour rejoindre une partie");
      return;
    }
    if (joinCode.length !== 6) {
      Alert.alert("Erreur", "Le code doit contenir 6 caractères");
      return;
    }
    setLoading(true);
    try {
      const result = await joinFriendlyMatch({ playerId: user._id, joinCode: joinCode.toUpperCase() });
      if (result.success && result.gameId) router.replace(`/(lobby)/room/${result.gameId}`);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Impossible de rejoindre la partie. Vérifiez le code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop dust={8} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AppBar title="Rejoindre" />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <PageTitle eyebrow="SALON PRIVÉ" title="Entre le code." />

          <View style={{ paddingHorizontal: 20 }}>
            <TextInput
              style={s.input}
              value={joinCode}
              onChangeText={(t) => setJoinCode(t.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
              placeholder="ABC123"
              placeholderTextColor={theme.creamA(0.3)}
              maxLength={6}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            {matchInfo ? (
              <Surface style={s.matchInfo}>
                <Text style={s.matchText}>Partie : {matchInfo.roomName || "Partie amicale"}</Text>
                <Text style={s.matchText}>
                  Joueurs : {matchInfo.players.length}/{matchInfo.maxPlayers}
                </Text>
              </Surface>
            ) : null}
          </View>

          <View style={s.footer}>
            <LamapButton
              title={loading ? "Connexion…" : "Rejoindre →"}
              variant="gold"
              disabled={joinCode.length !== 6 || loading}
              onPress={handleJoin}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    input: {
      backgroundColor: theme.surfA(0.65),
      borderRadius: 16,
      paddingVertical: 18,
      fontFamily: FONT_WEIGHTS.display.extrabold,
      fontSize: 28,
      color: theme.goldBright,
      textAlign: "center",
      letterSpacing: 8,
      borderWidth: 1.5,
      borderColor: theme.goldA(0.3),
    },
    matchInfo: { padding: 14, marginTop: 14, gap: 4 },
    matchText: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 13, color: theme.creamA(0.7) },
    footer: { marginTop: "auto", paddingHorizontal: 20, paddingBottom: 24 },
  });
}
