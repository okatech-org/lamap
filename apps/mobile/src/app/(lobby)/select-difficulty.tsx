import {
  AppBackdrop,
  AppBar,
  LamapButton,
  PageTitle,
} from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { useMatchmaking } from "@/hooks/use-matchmaking";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DIFFICULTIES = [
  {
    value: "easy",
    label: "Facile",
    sub: "Pour découvrir le jeu",
    icon: "leaf-outline",
  },
  {
    value: "medium",
    label: "Moyen",
    sub: "Une IA équilibrée",
    icon: "flame-outline",
  },
  {
    value: "hard",
    label: "Difficile",
    sub: "Pour tester ta maîtrise",
    icon: "sparkles-outline",
  },
] as const;

export default function SelectDifficultyScreen() {
  const theme = useTheme();
  const s = styles(theme);
  const router = useRouter();
  const { createTraining } = useMatchmaking();
  const [selected, setSelected] = useState<
    (typeof DIFFICULTIES)[number]["value"] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const start = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const gameId = await createTraining(selected);
      router.replace(`/(game)/match/${gameId}`);
    } catch (error) {
      Alert.alert(
        "Lancement impossible",
        error instanceof Error ? error.message : "Réessayez.",
      );
      setLoading(false);
    }
  };
  return (
    <View style={s.root}>
      <AppBackdrop dust={8} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AppBar title="" />
        <PageTitle eyebrow="ENTRAÎNEMENT" title="Choisis ta difficulté." />
        <View style={s.list}>
          {DIFFICULTIES.map((item) => {
            const active = selected === item.value;
            return (
              <Pressable
                key={item.value}
                onPress={() => setSelected(item.value)}
                style={[
                  s.card,
                  {
                    borderColor: active ? theme.goldA(0.55) : theme.goldA(0.12),
                    backgroundColor: active ? theme.goldA(0.14) : theme.surface,
                  },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={active ? theme.goldBright : theme.creamA(0.6)}
                />
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>{item.label}</Text>
                  <Text style={s.sub}>{item.sub}</Text>
                </View>
                {active ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={theme.goldBright}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>
        <View style={s.footer}>
          <LamapButton
            title={loading ? "Lancement…" : "Commencer"}
            variant="gold"
            disabled={!selected || loading}
            onPress={start}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function styles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    list: { paddingHorizontal: 20, gap: 12 },
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 18,
      borderRadius: 18,
      borderWidth: 1,
    },
    label: {
      fontFamily: FONT_WEIGHTS.display.bold,
      fontSize: 18,
      color: theme.cream,
    },
    sub: {
      marginTop: 3,
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 12,
      color: theme.creamA(0.58),
    },
    footer: { marginTop: "auto", padding: 20, paddingBottom: 28 },
  });
}
