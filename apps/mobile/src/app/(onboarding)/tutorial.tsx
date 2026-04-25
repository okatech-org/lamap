import {
  DeepBg,
  LamapButton,
  LamapSectionLabel,
  OnboardingProgressDots,
} from "@/components/lamap";
import { CardBack } from "@/components/game/card-back";
import { COLORS, FONT_WEIGHTS } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@lamap/convex/_generated/api";
import { getCurrencyFromCountry } from "@lamap/convex/currencies";
import { useMutation } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface TutorialStep {
  eyebrow: string;
  title: string;
  body: string;
  visual: "deck" | "follow" | "kora" | "game";
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    eyebrow: "RÈGLE 1 / 4",
    title: "Le duel — 5 manches.",
    body: "Deux joueurs, cinq cartes chacun, cinq manches. Seule la dernière manche compte pour gagner la partie.",
    visual: "deck",
  },
  {
    eyebrow: "RÈGLE 2 / 4",
    title: "Suis la couleur.",
    body: "Quand l'adversaire ouvre, tu dois jouer la même couleur si tu en possèdes. Sinon, tu défausses et tu perds la main.",
    visual: "follow",
  },
  {
    eyebrow: "RÈGLE 3 / 4",
    title: "Le 3 vaut peu —\nsauf à la fin.",
    body: "Remporter la 5ème manche avec un 3 déclenche un Kora (×2). Doublé en 4+5 (×4). Triplé en 3+4+5 (×8).",
    visual: "kora",
  },
  {
    eyebrow: "RÈGLE 4 / 4",
    title: "Le jeton Kora.",
    body: "Tu mises en Kora. Le gagnant reçoit 90% de la mise totale. La plateforme prélève 10%. Ton classement évolue à chaque match.",
    visual: "game",
  },
];

export default function TutorialScreen() {
  const router = useRouter();
  const { convexUser } = useAuth();
  const params = useLocalSearchParams<{ step?: string }>();
  const initialStep = params.step ? parseInt(params.step, 10) - 1 : 0;
  const [currentStep, setCurrentStep] = useState(
    Math.max(0, Math.min(TUTORIAL_STEPS.length - 1, initialStep)),
  );
  const [isCompleting, setIsCompleting] = useState(false);

  const completeTutorial = useMutation(api.onboarding.completeTutorial);
  const completeOnboarding = useMutation(api.onboarding.completeOnboarding);
  const createAIGame = useMutation(api.matchmaking.createMatchVsAI);

  const handleNext = async () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
      return;
    }
    if (!convexUser?._id || isCompleting) return;
    setIsCompleting(true);
    try {
      await completeTutorial({ userId: convexUser._id });
      // Launch a guided AI game after completing the rules.
      const currency = convexUser.country
        ? getCurrencyFromCountry(convexUser.country)
        : "XAF";
      const gameId = await createAIGame({
        playerId: convexUser._id,
        difficulty: "easy",
        betAmount: 0,
        currency: currency as "XAF" | "EUR" | "USD",
      });
      router.replace(`/(game)/match/${gameId}?tutorial=true`);
    } catch (e) {
      console.error("Tutorial completion failed:", e);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkip = async () => {
    if (!convexUser?._id) {
      router.replace("/(tabs)");
      return;
    }
    try {
      await completeOnboarding({ userId: convexUser._id });
    } catch (e) {
      console.error("Skip onboarding failed:", e);
    }
    router.replace("/(tabs)");
  };

  const step = TUTORIAL_STEPS[currentStep];
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <DeepBg dustCount={8} dustOpacity={0.3} />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={styles.topBar}>
          <Pressable onPress={handleSkip} hitSlop={8}>
            <Text style={styles.skip}>Passer</Text>
          </Pressable>
          <OnboardingProgressDots
            current={currentStep}
            total={TUTORIAL_STEPS.length}
          />
        </View>

        <Animated.View
          key={currentStep}
          entering={FadeIn.duration(280)}
          style={styles.content}
        >
          <View style={styles.heading}>
            <LamapSectionLabel>{step.eyebrow}</LamapSectionLabel>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.body}>{step.body}</Text>
          </View>

          <View style={styles.visual}>
            {step.visual === "deck" ? <DeckVisual /> : null}
            {step.visual === "follow" ? <FollowVisual /> : null}
            {step.visual === "kora" ? <KoraVisual /> : null}
            {step.visual === "game" ? <GameVisual /> : null}
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <LamapButton
            title={
              isLast
                ? isCompleting
                  ? "Lancement…"
                  : "Lancer la partie guidée →"
                : "Suivant →"
            }
            variant="primary"
            onPress={handleNext}
            disabled={isCompleting}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─── Visuals ──────────────────────────────────────────────

function DeckVisual() {
  return (
    <View style={styles.cardRow}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={{
            transform: [
              { translateX: -i * 24 },
              { rotate: `${(i - 2) * 4}deg` },
            ],
          }}
        >
          <CardBack size="medium" />
        </View>
      ))}
    </View>
  );
}

function FollowVisual() {
  return (
    <View style={styles.followRow}>
      <View style={styles.suitTile}>
        <Text style={styles.suitGlyphRed}>♥</Text>
        <Text style={styles.suitLabel}>OUVRE</Text>
      </View>
      <Text style={styles.arrow}>→</Text>
      <View style={styles.suitTile}>
        <Text style={styles.suitGlyphRed}>♥</Text>
        <Text style={styles.suitLabel}>SUIS</Text>
      </View>
    </View>
  );
}

function KoraVisual() {
  const items = [
    { manche: 1, kora: false },
    { manche: 2, kora: false },
    { manche: 3, kora: false },
    { manche: 4, kora: true, mult: "×4" },
    { manche: 5, kora: true, mult: "×8" },
  ];
  return (
    <View style={styles.koraRow}>
      {items.map((it) => (
        <View key={it.manche} style={styles.mancheCol}>
          <View style={styles.koraCardWrap}>
            <CardBack size="small" theme={it.kora ? "gold" : "red"} />
            {it.kora ? (
              <View style={styles.koraChip}>
                <Text style={styles.koraChipText}>{it.mult}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.mancheLabel}>M{it.manche}</Text>
        </View>
      ))}
    </View>
  );
}

function GameVisual() {
  return (
    <View style={styles.gameRow}>
      <View style={styles.koraDisc}>
        <Text style={styles.koraDiscText}>K</Text>
      </View>
      <View style={styles.gameStats}>
        <Text style={styles.gameStatLabel}>GAGNANT</Text>
        <Text style={styles.gameStatValue}>+90%</Text>
      </View>
      <View style={styles.gameStats}>
        <Text style={styles.gameStatLabel}>PLATEFORME</Text>
        <Text style={[styles.gameStatValue, { color: COLORS.terre2 }]}>
          −10%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  skip: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 13,
    color: "rgba(245, 242, 237, 0.5)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 24,
  },
  heading: {
    gap: 12,
    alignItems: "center",
    paddingTop: 32,
  },
  title: {
    fontFamily: FONT_WEIGHTS.display.extrabold,
    fontSize: 38,
    color: COLORS.cream,
    letterSpacing: -1,
    lineHeight: 40,
    textAlign: "center",
    marginTop: 6,
  },
  body: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 15,
    color: "rgba(245, 242, 237, 0.7)",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
    marginTop: 4,
  },
  visual: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    minHeight: 180,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 80,
  },
  followRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  suitTile: {
    width: 90,
    height: 120,
    borderRadius: 12,
    backgroundColor: "rgba(46, 61, 77, 0.5)",
    borderWidth: 1.5,
    borderColor: "rgba(201, 168, 118, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  suitGlyphRed: {
    fontSize: 36,
    color: COLORS.terre,
  },
  suitLabel: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 9,
    letterSpacing: 1.6,
    color: COLORS.or2,
  },
  arrow: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 28,
    color: COLORS.or2,
  },
  koraRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-end",
  },
  mancheCol: {
    alignItems: "center",
    gap: 8,
  },
  koraCardWrap: {
    position: "relative",
  },
  koraChip: {
    position: "absolute",
    top: -8,
    right: -10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#C9A876",
    shadowColor: "#E8C879",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  koraChipText: {
    fontFamily: FONT_WEIGHTS.mono.bold,
    fontSize: 9,
    color: "#1F1810",
    letterSpacing: 0.6,
  },
  mancheLabel: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 9,
    letterSpacing: 1.4,
    color: "rgba(245, 242, 237, 0.5)",
  },
  gameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  koraDisc: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#C9A876",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E8C879",
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  koraDiscText: {
    fontFamily: FONT_WEIGHTS.display.extrabold,
    fontSize: 36,
    color: "#1F1810",
  },
  gameStats: {
    alignItems: "center",
    gap: 4,
  },
  gameStatLabel: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 9,
    letterSpacing: 1.6,
    color: "rgba(245, 242, 237, 0.5)",
  },
  gameStatValue: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 22,
    color: COLORS.or2,
    letterSpacing: -0.4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
