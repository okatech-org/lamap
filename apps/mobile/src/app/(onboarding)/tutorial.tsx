import { CardBack } from "@/components/game/card-back";
import { PlayingCard } from "@/components/game/playing-card";
import { AppBackdrop, LamapButton } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@lamap/convex/_generated/api";
import { getCurrencyFromCountry } from "@lamap/convex/currencies";
import { useMutation } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type ArtKind = "duel" | "rule" | "kora" | "play";

interface OnboardStep {
  eyebrow: string;
  title: string;
  body: string;
  art: ArtKind;
  cta: string;
  last?: boolean;
}

const STEPS: OnboardStep[] = [
  {
    eyebrow: "BIENVENUE",
    title: "Le jeu des\nmains.",
    body: "LaMap est un duel de cartes en 5 manches. Seule la dernière main décide qui rafle la mise.",
    art: "duel",
    cta: "Continuer",
  },
  {
    eyebrow: "COMMENT JOUER",
    title: "Suis la couleur,\nou cède la main.",
    body: "Si tu as la couleur demandée, tu dois la jouer. Sinon tu défausses et tu perds la main.",
    art: "rule",
    cta: "Continuer",
  },
  {
    eyebrow: "LA RÈGLE D’OR",
    title: "Le 3 est ton\narme secrète.",
    body: "Gagner la dernière main avec un 3 déclenche une Kora — multiplicateur ×2, ×4 ou ×8 sur tes gains.",
    art: "kora",
    cta: "Continuer",
  },
  {
    eyebrow: "À TOI DE JOUER",
    title: "Lance une partie\nd’entraînement.",
    body: "On joue contre une IA, sans mise, pour bien sentir le tempo. Tu peux quitter à tout moment.",
    art: "play",
    cta: "Lancer une partie",
    last: true,
  },
];

export default function TutorialScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { convexUser } = useAuth();
  const params = useLocalSearchParams<{ step?: string }>();
  const initialStep = params.step ? parseInt(params.step, 10) - 1 : 0;
  const [currentStep, setCurrentStep] = useState(
    Math.max(0, Math.min(STEPS.length - 1, initialStep)),
  );
  const [isCompleting, setIsCompleting] = useState(false);

  const completeTutorial = useMutation(api.onboarding.completeTutorial);
  const completeOnboarding = useMutation(api.onboarding.completeOnboarding);
  const createAIGame = useMutation(api.matchmaking.createMatchVsAI);

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
      return;
    }
    if (!convexUser?._id || isCompleting) return;
    setIsCompleting(true);
    try {
      const currency = convexUser.country
        ? getCurrencyFromCountry(convexUser.country)
        : "XAF";
      const gameId = await createAIGame({
        playerId: convexUser._id,
        difficulty: "easy",
        betAmount: 0,
        currency: currency as "XAF" | "EUR" | "USD",
      });
      // Leave the onboarding group BEFORE marking it complete — otherwise the
      // (onboarding) layout's onboarded-redirect races us straight to the tabs.
      router.replace(`/(game)/match/${gameId}?tutorial=true`);
      void completeTutorial({ userId: convexUser._id }).catch((e) =>
        console.error("Tutorial completion failed:", e),
      );
    } catch (e) {
      console.error("Tutorial start failed:", e);
      setIsCompleting(false);
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
    if (convexUser?._id) {
      void completeOnboarding({ userId: convexUser._id }).catch((e) =>
        console.error("Skip onboarding failed:", e),
      );
    }
  };

  const step = STEPS[currentStep];
  const styles = makeStyles(theme);

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop dust={10} embers={6} />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={styles.topBar}>
          <Pressable onPress={handleSkip} hitSlop={8}>
            <Text style={styles.skip}>Passer</Text>
          </Pressable>
        </View>

        <Animated.View
          key={currentStep}
          entering={FadeIn.duration(280)}
          style={styles.content}
        >
          <View style={styles.art}>
            <OnboardingArt kind={step.art} theme={theme} />
          </View>

          <View style={styles.copy}>
            <Text style={styles.eyebrow}>{step.eyebrow}</Text>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.body}>{step.body}</Text>
          </View>
        </Animated.View>

        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentStep
                  ? { width: 22, backgroundColor: theme.goldBright }
                  : { width: 6, backgroundColor: theme.goldA(0.25) },
              ]}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <LamapButton
            title={
              step.last && isCompleting ? "Lancement…" : `${step.cta} →`
            }
            variant={step.last ? "gold" : "accent"}
            onPress={handleNext}
            disabled={isCompleting}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─── Art scenes ───────────────────────────────────────────

function OnboardingArt({ kind, theme }: { kind: ArtKind; theme: Theme }) {
  if (kind === "duel") {
    return (
      <View style={artStyles.stage}>
        <View style={{ transform: [{ translateX: -34 }, { rotate: "-14deg" }] }}>
          <CardBack size="xl" theme="red" />
        </View>
        <View
          style={[
            artStyles.glow,
            {
              shadowColor: theme.gold,
              transform: [{ translateX: 34 }, { rotate: "10deg" }],
            },
          ]}
        >
          <PlayingCard rank="7" suit="hearts" state="played" size="xl" />
        </View>
      </View>
    );
  }

  if (kind === "rule") {
    return (
      <View style={[artStyles.stage, { gap: 14 }]}>
        <View style={{ transform: [{ rotate: "-6deg" }] }}>
          <PlayingCard rank="9" suit="hearts" state="played" size="large" />
        </View>
        <Text style={[artStyles.arrow, { color: theme.gold }]}>→</Text>
        <View
          style={[
            artStyles.glow,
            { shadowColor: theme.gold, transform: [{ rotate: "4deg" }] },
          ]}
        >
          <PlayingCard rank="10" suit="hearts" state="selected" size="large" />
        </View>
      </View>
    );
  }

  if (kind === "kora") {
    return (
      <View style={artStyles.stage}>
        <View style={[artStyles.koraGlow, { shadowColor: theme.gold }]}>
          <PlayingCard rank="3" suit="hearts" state="selected" size="2xl" />
        </View>
        <View style={[artStyles.koraChip, { backgroundColor: theme.gold }]}>
          <Text style={artStyles.koraChipText}>KORA ×2</Text>
        </View>
      </View>
    );
  }

  // play — 5-card fan
  const fan = [
    { rank: "7", suit: "hearts" },
    { rank: "3", suit: "clubs" },
    { rank: "6", suit: "spades" },
    { rank: "9", suit: "diamonds" },
    { rank: "10", suit: "hearts" },
  ] as const;
  return (
    <View style={artStyles.fanStage}>
      {fan.map((c, i) => {
        const offset = i - 2;
        return (
          <View
            key={i}
            style={{
              marginLeft: i === 0 ? 0 : -44,
              transform: [
                { translateY: Math.abs(offset) * 6 },
                { rotate: `${offset * 5}deg` },
              ],
              zIndex: i,
            }}
          >
            <PlayingCard rank={c.rank} suit={c.suit} state="played" size="medium" />
          </View>
        );
      })}
    </View>
  );
}

const artStyles = StyleSheet.create({
  stage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fanStage: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingLeft: 20,
  },
  glow: {
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  koraGlow: {
    shadowOpacity: 0.6,
    shadowRadius: 36,
    shadowOffset: { width: 0, height: 0 },
    elevation: 14,
  },
  arrow: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 28,
  },
  koraChip: {
    position: "absolute",
    bottom: -10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  koraChipText: {
    fontFamily: FONT_WEIGHTS.display.extrabold,
    fontSize: 14,
    color: "#1F1810",
    letterSpacing: 0.4,
  },
});

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    topBar: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: 18,
      paddingTop: 8,
      height: 40,
    },
    skip: {
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 13,
      color: theme.creamA(0.55),
    },
    content: {
      flex: 1,
      justifyContent: "center",
    },
    art: {
      minHeight: 300,
      alignItems: "center",
      justifyContent: "center",
    },
    copy: {
      paddingHorizontal: 28,
      alignItems: "center",
    },
    eyebrow: {
      fontFamily: FONT_WEIGHTS.mono.semibold,
      fontSize: 10,
      letterSpacing: 2.8,
      color: theme.gold,
      marginBottom: 14,
    },
    title: {
      fontFamily: FONT_WEIGHTS.display.extrabold,
      fontSize: 32,
      lineHeight: 34,
      letterSpacing: -0.9,
      color: theme.cream,
      textAlign: "center",
    },
    body: {
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 15,
      lineHeight: 23,
      color: theme.creamA(0.65),
      textAlign: "center",
      marginTop: 14,
      maxWidth: 320,
    },
    dots: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
      marginBottom: 18,
    },
    dot: {
      height: 6,
      borderRadius: 999,
    },
    footer: {
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
  });
}
