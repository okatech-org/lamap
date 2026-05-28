import { AppBackdrop, AppBar, LamapButton, PageTitle, Surface } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@lamap/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import * as Clipboard from "expo-clipboard";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateFriendlyScreen() {
  const theme = useTheme();
  const s = makeStyles(theme);
  const router = useRouter();
  const { userId } = useAuth();
  const user = useQuery(api.users.getCurrentUser, userId ? { clerkUserId: userId } : "skip");
  const createFriendlyMatch = useMutation(api.friendlyMatches.createFriendlyMatch);
  const [loading, setLoading] = useState(false);
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!userId || !user?._id) {
      Alert.alert("Erreur", "Vous devez être connecté pour créer une partie");
      return;
    }
    setLoading(true);
    try {
      const result = await createFriendlyMatch({ hostId: user._id, currency: "XAF" });
      setJoinCode(result.joinCode);
      setGameId(result.gameId);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Impossible de créer la partie. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (joinCode) {
      await Clipboard.setStringAsync(joinCode);
      Alert.alert("Code copié", "Le code a été copié dans le presse-papiers");
    }
  };

  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop dust={10} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AppBar title="Salon privé" />
        {!joinCode ? (
          <>
            <PageTitle eyebrow="PARTIE PRIVÉE" title={"Crée une\ntable."} />
            <Text style={s.intro}>
              Crée un salon privé puis partage le code à un ami pour qu'il te rejoigne.
            </Text>
            <View style={s.footer}>
              <LamapButton
                title={loading ? "Création…" : "Créer la partie"}
                variant="gold"
                disabled={loading}
                onPress={handleCreate}
              />
            </View>
          </>
        ) : (
          <>
            <PageTitle eyebrow="CODE DU SALON" title={joinCode} />
            <Text style={s.intro}>
              Envoie ce code à un ami pour qu'il rejoigne la table. La partie démarre dès que vous êtes deux.
            </Text>
            <View style={{ paddingHorizontal: 20, gap: 12 }}>
              <Surface style={s.codeCard}>
                <Text style={s.codeText}>{joinCode}</Text>
              </Surface>
              <LamapButton title="↗ Copier le code" variant="dark" onPress={handleCopy} />
            </View>
            <View style={s.footer}>
              <LamapButton
                title="Aller à la salle →"
                variant="gold"
                onPress={() => gameId && router.replace(`/(lobby)/room/${gameId}`)}
              />
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    intro: {
      paddingHorizontal: 20,
      marginTop: -8,
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 13,
      lineHeight: 20,
      color: theme.creamA(0.6),
    },
    codeCard: { padding: 22, alignItems: "center", marginTop: 18 },
    codeText: {
      fontFamily: FONT_WEIGHTS.display.extrabold,
      fontSize: 36,
      letterSpacing: 6,
      color: theme.goldBright,
    },
    footer: { marginTop: "auto", paddingHorizontal: 20, paddingBottom: 24 },
  });
}
