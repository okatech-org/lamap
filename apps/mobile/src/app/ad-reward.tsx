import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Stub interstitial — a real rewarded-ad SDK (AdMob) will replace this later.
export default function AdRewardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const s = makeStyles(theme);
  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false, presentation: "fullScreenModal" }} />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        {/* Top bar */}
        <View style={s.topBar}>
          <View style={s.countChip}>
            <Text style={s.countText}>PUB · 16s</Text>
          </View>
          <Pressable style={s.skip} onPress={() => router.back()}>
            <Text style={s.skipText}>PASSER</Text>
          </Pressable>
        </View>

        {/* Mock ad creative */}
        <View style={s.creative}>
          <LinearGradient
            colors={["#FF6B35", "#C73E1D", "#6B1B0A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={s.sponsored}>
            <Text style={s.sponsoredText}>SPONSORISÉ</Text>
          </View>
          <View style={s.videoBox}>
            <Text style={s.videoText}>VIDÉO · 30s</Text>
          </View>
          <View>
            <Text style={s.brand}>Marque{"\n"}partenaire.</Text>
            <View style={s.discover}>
              <Text style={s.discoverText}>Découvrir →</Text>
            </View>
          </View>
        </View>

        {/* Reward preview */}
        <View style={s.rewardBar}>
          <View style={s.rewardIcon}>
            <LinearGradient
              colors={[theme.goldBright, theme.goldDeep]}
              style={[StyleSheet.absoluteFill, { borderRadius: 10 }]}
            />
            <Ionicons name="diamond" size={18} color="#1F1810" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.rewardEyebrow}>RÉCOMPENSE EN ATTENTE</Text>
            <Text style={s.rewardValue}>+150 Kora</Text>
          </View>
          <Text style={s.rewardCount}>3 / 5</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: "#05060A" },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 18,
      paddingVertical: 12,
    },
    countChip: {
      paddingHorizontal: 12,
      height: 26,
      borderRadius: 999,
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.6)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
    },
    countText: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 10, color: "rgba(255,255,255,0.8)", letterSpacing: 1 },
    skip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: "rgba(0,0,0,0.5)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
    },
    skipText: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: 1.2 },
    creative: {
      flex: 1,
      margin: 24,
      borderRadius: 24,
      overflow: "hidden",
      padding: 28,
      justifyContent: "space-between",
    },
    sponsored: {
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.18)",
    },
    sponsoredText: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 9, color: "#fff", letterSpacing: 2 },
    videoBox: {
      height: 200,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.06)",
      alignItems: "center",
      justifyContent: "center",
    },
    videoText: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: 2 },
    brand: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 30, color: "#fff", letterSpacing: -0.5, lineHeight: 32 },
    discover: {
      alignSelf: "flex-start",
      marginTop: 16,
      paddingHorizontal: 22,
      paddingVertical: 12,
      borderRadius: 999,
      backgroundColor: "#fff",
    },
    discoverText: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 13, color: "#C73E1D" },
    rewardBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      margin: 18,
      marginTop: 0,
      padding: 14,
      borderRadius: 14,
      backgroundColor: "rgba(0,0,0,0.65)",
      borderWidth: 1,
      borderColor: theme.goldA(0.4),
    },
    rewardIcon: { width: 40, height: 40, borderRadius: 10, overflow: "hidden", alignItems: "center", justifyContent: "center" },
    rewardEyebrow: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 8, letterSpacing: 1.8, color: theme.goldBright },
    rewardValue: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 16, color: theme.cream, marginTop: 2 },
    rewardCount: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 11, color: "rgba(255,255,255,0.4)" },
  });
}
