import {
  DeepBg,
  HomeTopBar,
  LamapButton,
  LamapSectionLabel,
  RankBadge,
} from "@/components/lamap";
import { COLORS, FONT_WEIGHTS, prToDesignRank, RADII } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import { INITIAL_PR } from "@lamap/convex/ranking";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

export default function SelectModeScreen() {
  const router = useRouter();
  const { userId, convexUser } = useAuth();

  const activeGame = useQuery(
    api.games.getActiveMatch,
    userId ? { clerkId: userId } : "skip",
  );

  const userPR = convexUser?.pr || INITIAL_PR;
  const designRank = prToDesignRank(userPR);

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <DeepBg />
      <HomeTopBar />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Heading */}
          <View style={styles.heading}>
            <Text style={styles.title}>Choisir un mode</Text>
            <Text style={styles.subtitle}>Comment voulez-vous jouer ?</Text>
          </View>

          {/* Active match — rejoin */}
          {activeGame ? (
            <Pressable
              style={styles.activeMatch}
              onPress={() => router.push(`/(game)/match/${activeGame.gameId}`)}
              accessibilityRole="button"
              accessibilityLabel="Rejoindre la partie en cours"
            >
              <View style={styles.activeMatchPulse} />
              <View style={{ flex: 1 }}>
                <LamapSectionLabel>Partie en cours</LamapSectionLabel>
                <Text style={styles.activeMatchTitle}>
                  {activeGame.mode === "AI"
                    ? "Contre l'IA"
                    : activeGame.mode === "RANKED"
                      ? "Match classé"
                      : "Partie privée"}
                </Text>
              </View>
              <Ionicons name="play-circle" size={32} color={COLORS.or2} />
            </Pressable>
          ) : null}

          {/* Mode Classé — featured */}
          <View style={styles.modeClassed}>
            <View style={styles.classedHalo} pointerEvents="none">
              <Svg width={160} height={160}>
                <Defs>
                  <RadialGradient
                    id="classed-halo"
                    cx="50%"
                    cy="50%"
                    rx="50%"
                    ry="50%"
                  >
                    <Stop
                      offset="0%"
                      stopColor="#E8C879"
                      stopOpacity={0.25}
                    />
                    <Stop offset="70%" stopColor="#E8C879" stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Rect width={160} height={160} fill="url(#classed-halo)" />
              </Svg>
            </View>

            <View style={styles.modeRow}>
              <View style={styles.classedIcon}>
                <LinearGradient
                  colors={["#C9A876", "#6E5536"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
                />
                <Ionicons name="trophy" size={28} color={COLORS.ink} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.classedTitleRow}>
                  <Text style={styles.modeTitle}>Mode Classé</Text>
                  <View style={{ transform: [{ scale: 0.7 }] }}>
                    <RankBadge rank={designRank.name} size={36} />
                  </View>
                </View>
                <Text style={styles.modeMeta}>
                  Gratuit · Affecte votre classement ·{" "}
                  <Text style={styles.metaAccent}>{userPR} PR</Text>
                </Text>
                <View style={styles.featureList}>
                  <FeatureLine>Matchmaking par rang</FeatureLine>
                  <FeatureLine>Progression compétitive</FeatureLine>
                  <FeatureLine>Sans mise d&apos;argent</FeatureLine>
                </View>
              </View>
            </View>
            <LamapButton
              title="Jouer en Classé"
              variant="primary"
              onPress={() => router.push("/(lobby)/ranked-matchmaking")}
              style={{ marginTop: 18 }}
            />
          </View>

          {/* Mode IA */}
          <View style={styles.modeAI}>
            <View style={styles.modeRow}>
              <View style={styles.aiIcon}>
                <Ionicons
                  name="hardware-chip-outline"
                  size={26}
                  color={COLORS.or2}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modeTitle}>Mode IA</Text>
                <Text style={styles.modeMeta}>
                  Entraînement · Sans classement
                </Text>
                <View style={styles.featureList}>
                  <FeatureLine>Pratiquez sans risque</FeatureLine>
                  <FeatureLine>3 niveaux de difficulté</FeatureLine>
                  <FeatureLine>N&apos;affecte pas votre classement</FeatureLine>
                </View>
              </View>
            </View>
            <LamapButton
              title="S'entraîner"
              variant="light"
              onPress={() => router.push("/(lobby)/select-difficulty")}
              style={{ marginTop: 18 }}
            />
          </View>

          {/* Footer back link */}
          <Pressable
            onPress={() => router.back()}
            style={styles.backLink}
            hitSlop={8}
          >
            <Text style={styles.backLinkText}>← Retour</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function FeatureLine({ children }: { children: string }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureCheck}>✓</Text>
      <Text style={styles.featureText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  heading: {
    alignItems: "center",
    marginBottom: 24,
    gap: 6,
  },
  title: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 32,
    color: COLORS.cream,
    letterSpacing: -0.8,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 15,
    color: "rgba(245, 242, 237, 0.55)",
    textAlign: "center",
  },
  activeMatch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    marginBottom: 16,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairlineStrong,
  },
  activeMatchPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.terre2,
    shadowColor: COLORS.terre2,
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  activeMatchTitle: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 16,
    color: COLORS.cream,
    marginTop: 2,
    letterSpacing: -0.2,
  },
  modeClassed: {
    padding: 18,
    borderRadius: RADII.xl,
    borderWidth: 1.5,
    borderColor: COLORS.or,
    backgroundColor: "rgba(166, 130, 88, 0.1)",
    overflow: "hidden",
    marginBottom: 14,
    position: "relative",
  },
  classedHalo: {
    position: "absolute",
    top: -20,
    right: -30,
    width: 160,
    height: 160,
  },
  modeAI: {
    padding: 18,
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    backgroundColor: "rgba(46, 61, 77, 0.45)",
  },
  modeRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  classedIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: COLORS.or,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  aiIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(46, 61, 77, 0.8)",
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  classedTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  modeTitle: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 22,
    color: COLORS.cream,
    letterSpacing: -0.5,
  },
  modeMeta: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 13,
    color: "rgba(245, 242, 237, 0.65)",
    marginTop: 4,
  },
  metaAccent: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    color: COLORS.or2,
  },
  featureList: {
    marginTop: 12,
    gap: 4,
  },
  featureRow: {
    flexDirection: "row",
    gap: 6,
  },
  featureCheck: {
    fontFamily: FONT_WEIGHTS.body.bold,
    fontSize: 13,
    color: COLORS.or2,
  },
  featureText: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 13,
    color: "rgba(245, 242, 237, 0.78)",
  },
  backLink: {
    alignSelf: "center",
    marginTop: 24,
    padding: 8,
  },
  backLinkText: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 14,
    color: "rgba(245, 242, 237, 0.65)",
  },
});
