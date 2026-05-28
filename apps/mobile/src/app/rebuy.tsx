import { AppBackdrop } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Tone = "accent" | "gold" | "neutral";

export default function RebuyScreen() {
  const theme = useTheme();
  const router = useRouter();
  const s = makeStyles(theme);

  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false, presentation: "modal" }} />
      <AppBackdrop variant="velvet" dust={14} embers={8} />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={s.closeRow}>
          <Pressable style={s.close} onPress={() => router.back()}>
            <Ionicons name="close" size={18} color={theme.cream} />
          </Pressable>
        </View>

        <View style={s.header}>
          <View style={s.coin}>
            <LinearGradient
              colors={[theme.goldBright, theme.gold, theme.goldDeep]}
              style={[StyleSheet.absoluteFill, { borderRadius: 36 }]}
            />
            <Ionicons name="diamond" size={30} color="#1F1810" />
          </View>
          <Text style={s.eyebrow}>SOLDE BAS</Text>
          <Text style={s.title}>Tu touches le fond.</Text>
          <Text style={s.sub}>
            Il te reste <Text style={{ color: theme.goldBright, fontFamily: FONT_WEIGHTS.display.bold }}>180 K</Text> — trop juste pour une table Standard.
          </Text>
        </View>

        <View style={s.options}>
          <Option
            theme={theme}
            tone="accent"
            icon="play"
            eyebrow="GRATUIT · IMMÉDIAT"
            title="Regarde une pub"
            sub="3 sur 5 disponibles aujourd'hui"
            reward="+150 K"
            cta="Lancer"
            onPress={() => router.push("/ad-reward")}
          />
          <Option
            theme={theme}
            tone="gold"
            icon="diamond"
            eyebrow="LE PLUS RAPIDE"
            title="Acheter des Kora"
            sub="Dès 100 FCFA · mobile money"
            reward="dès 1 000 K"
            cta="Boutique"
            onPress={() => router.push("/recharge")}
          />
          <Option
            theme={theme}
            tone="neutral"
            icon="time-outline"
            eyebrow="DANS 28 MIN"
            title="Attendre la recharge"
            sub="Recharge gratuite anti-fauché · max 600 K"
            reward="+200 K"
            cta="Patienter"
            onPress={() => router.back()}
          />
        </View>

        <Text style={s.reassure}>
          Tu peux toujours rejouer à <Text style={{ color: theme.accentText }}>Découverte</Text> sans rien dépenser.
        </Text>
      </SafeAreaView>
    </View>
  );
}

function Option({
  theme,
  tone,
  icon,
  eyebrow,
  title,
  sub,
  reward,
  cta,
  onPress,
}: {
  theme: Theme;
  tone: Tone;
  icon: keyof typeof Ionicons.glyphMap;
  eyebrow: string;
  title: string;
  sub: string;
  reward: string;
  cta: string;
  onPress: () => void;
}) {
  const map = {
    accent: { bg: theme.accentA(0.22), border: theme.accentA(0.45), accent: theme.accentText },
    gold: { bg: theme.goldA(0.22), border: theme.goldA(0.5), accent: theme.goldBright },
    neutral: { bg: theme.surfA(0.65), border: theme.goldA(0.15), accent: theme.creamA(0.7) },
  }[tone];
  return (
    <View style={[oStyles.card, { backgroundColor: map.bg, borderColor: map.border }]}>
      <View style={[oStyles.icon, { backgroundColor: `${map.accent}22`, borderColor: `${map.accent}55` }]}>
        <Ionicons name={icon} size={18} color={map.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[oStyles.eyebrow, { color: map.accent }]}>{eyebrow}</Text>
        <Text style={[oStyles.title, { color: theme.cream }]}>{title}</Text>
        <Text style={[oStyles.sub, { color: theme.creamA(0.55) }]}>{sub}</Text>
      </View>
      <View style={{ alignItems: "flex-end", gap: 6 }}>
        <Text style={[oStyles.reward, { color: map.accent }]}>{reward}</Text>
        <Pressable
          onPress={onPress}
          style={[oStyles.cta, { backgroundColor: map.accent }]}
        >
          <Text style={[oStyles.ctaText, { color: tone === "neutral" ? theme.abyss : "#1F1810" }]}>
            {cta}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const oStyles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 16, borderWidth: 1 },
  icon: { width: 46, height: 46, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  eyebrow: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 8, letterSpacing: 1.8 },
  title: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 15, marginTop: 2 },
  sub: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 11, marginTop: 3 },
  reward: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 13 },
  cta: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  ctaText: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 11 },
});

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    closeRow: { flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 18, height: 40 },
    close: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.surfA(0.6),
      borderWidth: 1,
      borderColor: theme.goldA(0.3),
    },
    header: { paddingHorizontal: 24, alignItems: "center", paddingTop: 12 },
    coin: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      marginBottom: 18,
      borderWidth: 2,
      borderColor: theme.goldA(0.4),
    },
    eyebrow: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 10, letterSpacing: 2.4, color: theme.gold, marginBottom: 8 },
    title: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 30, letterSpacing: -0.6, color: theme.cream, textAlign: "center" },
    sub: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 13, lineHeight: 20, color: theme.creamA(0.65), marginTop: 10, textAlign: "center" },
    options: { paddingHorizontal: 20, gap: 10, marginTop: 28 },
    reassure: {
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 11,
      lineHeight: 17,
      color: theme.creamA(0.45),
      textAlign: "center",
      marginTop: "auto",
      paddingHorizontal: 24,
      paddingBottom: 8,
    },
  });
}
