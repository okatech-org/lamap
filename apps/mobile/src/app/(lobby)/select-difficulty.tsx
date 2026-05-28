import { AppBackdrop, AppBar, LamapButton, PageTitle } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { useMatchmaking } from "@/hooks/use-matchmaking";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import { useQuery } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DIFFICULTIES: {
  value: "easy" | "medium" | "hard";
  label: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: "easy", label: "Facile", sub: "Pour débuter en douceur", icon: "leaf-outline" },
  { value: "medium", label: "Moyen", sub: "L'IA joue solide", icon: "flame-outline" },
  { value: "hard", label: "Difficile", sub: "Sans pitié", icon: "skull-outline" },
];

export default function SelectDifficultyScreen() {
  const theme = useTheme();
  const s = makeStyles(theme);
  const router = useRouter();
  const { betAmount } = useLocalSearchParams<{ betAmount: string }>();
  const { userId } = useAuth();
  const user = useQuery(api.users.getCurrentUser, userId ? { clerkUserId: userId } : "skip");
  const { createMatchVsAI } = useMatchmaking();
  const [selected, setSelected] = useState<"easy" | "medium" | "hard" | null>(null);
  const [loading, setLoading] = useState(false);

  const bet = betAmount ? parseInt(betAmount, 10) : 0;
  const currency = (user?.currency || "XAF") as "EUR" | "XAF";

  const handleStart = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const gameId = await createMatchVsAI(bet, selected, currency);
      router.replace(`/(game)/match/${gameId}`);
    } catch (error) {
      console.error("Error creating match vs AI:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop dust={8} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AppBar title="" />
        <PageTitle eyebrow="ENTRAÎNEMENT" title="Choisis ta difficulté." />

        <View style={s.list}>
          {DIFFICULTIES.map((d) => {
            const active = selected === d.value;
            return (
              <Pressable
                key={d.value}
                onPress={() => setSelected(d.value)}
                style={[
                  s.card,
                  {
                    backgroundColor: active ? theme.goldA(0.16) : theme.surface,
                    borderColor: active ? theme.goldA(0.5) : theme.goldA(0.12),
                  },
                ]}
              >
                <View style={[s.icon, { backgroundColor: active ? theme.goldA(0.2) : theme.surfA(0.6), borderColor: active ? theme.goldA(0.4) : theme.goldA(0.12) }]}>
                  <Ionicons name={d.icon} size={22} color={active ? theme.goldBright : theme.creamA(0.6)} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>{d.label}</Text>
                  <Text style={s.sub}>{d.sub}</Text>
                </View>
                {active ? <Ionicons name="checkmark-circle" size={22} color={theme.goldBright} /> : null}
              </Pressable>
            );
          })}
        </View>

        <View style={s.footer}>
          <LamapButton
            title={loading ? "Lancement…" : "Commencer →"}
            variant="gold"
            disabled={!selected || loading}
            onPress={handleStart}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    list: { paddingHorizontal: 20, gap: 12 },
    card: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 18, borderWidth: 1 },
    icon: { width: 46, height: 46, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
    label: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 18, color: theme.cream },
    sub: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 12, color: theme.creamA(0.6), marginTop: 2 },
    footer: { marginTop: "auto", paddingHorizontal: 20, paddingBottom: 24 },
  });
}
