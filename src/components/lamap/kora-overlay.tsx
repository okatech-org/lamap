import { COLORS, FONT_WEIGHTS } from "@/design";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { LamapButton } from "./button";
import { Sparks } from "./sparks";

interface LamapKoraOverlayProps {
  visible: boolean;
  multiplier?: 2 | 3 | 4 | 8;
  message?: string;
  onNewGame?: () => void;
  onRevenge?: () => void;
  onGoHome?: () => void;
  revengeStatus?: "none" | "sent" | "received" | "accepted";
  onAcceptRevenge?: () => void;
  onRejectRevenge?: () => void;
}

/**
 * Full-screen Kora reveal — fired when the player wins a round with a 3 or
 * triggers a special victory. Deep terre radial bg, gold KORA wordmark with
 * glow, multiplier coin, 32 confetti sparks, and the same action stack as the
 * regular ResultPanel so the player isn't trapped on the celebration screen.
 */
export function LamapKoraOverlay({
  visible,
  multiplier = 2,
  message = "Tu remportes la 5ème manche avec un 3.\nTes gains sont doublés.",
  onNewGame,
  onRevenge,
  onGoHome,
  revengeStatus = "none",
  onAcceptRevenge,
  onRejectRevenge,
}: LamapKoraOverlayProps) {
  if (!visible) return null;

  return (
    <View style={styles.root} pointerEvents="auto">
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="kora-bg" cx="50%" cy="50%" rx="70%" ry="60%">
            <Stop offset="0%" stopColor="#6E2520" stopOpacity={0.92} />
            <Stop offset="70%" stopColor="#0F1620" stopOpacity={0.97} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#kora-bg)" />
      </Svg>

      <Sparks count={32} trigger={visible ? 1 : 0} />

      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>VICTOIRE SPÉCIALE</Text>
          <Text style={styles.title}>KORA</Text>
          <View style={styles.multiplierWrap}>
            <LinearGradient
              colors={["#C9A876", "#6E5536"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
            />
            <Text style={styles.multiplierText}>×{multiplier}</Text>
          </View>
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>

        <View style={styles.actions}>
          {revengeStatus === "received" &&
          onAcceptRevenge &&
          onRejectRevenge ? (
            <View style={styles.revengeInvite}>
              <Text style={styles.revengeInviteText}>
                Votre adversaire veut une revanche !
              </Text>
              <View style={styles.row}>
                <View style={styles.flex1}>
                  <LamapButton
                    title="Refuser"
                    variant="ghost"
                    onPress={onRejectRevenge}
                  />
                </View>
                <View style={styles.flex1}>
                  <LamapButton
                    title="Accepter"
                    variant="primary"
                    onPress={onAcceptRevenge}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.row}>
              {onNewGame ? (
                <View style={styles.flex1}>
                  <LamapButton
                    title="Nouvelle partie"
                    variant="primary"
                    onPress={onNewGame}
                  />
                </View>
              ) : null}
              {onRevenge ? (
                <View style={styles.flex1}>
                  <LamapButton
                    title={revengeStatus === "sent" ? "Envoyée" : "Revanche"}
                    variant="ghost"
                    onPress={onRevenge}
                    disabled={revengeStatus === "sent"}
                  />
                </View>
              ) : null}
            </View>
          )}

          {onGoHome ? (
            <Pressable
              onPress={onGoHome}
              style={styles.goHomeBtn}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Retour à l'accueil"
            >
              <Text style={styles.goHomeText}>← Retour à l&apos;accueil</Text>
            </Pressable>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  eyebrow: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 13,
    letterSpacing: 4.4,
    color: COLORS.or2,
    marginBottom: 12,
    textAlign: "center",
  },
  title: {
    fontFamily: FONT_WEIGHTS.display.extrabold,
    fontSize: 84,
    color: COLORS.or2,
    letterSpacing: -3.5,
    lineHeight: 84,
    textShadowColor: "rgba(232, 200, 121, 0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
  multiplierWrap: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "#E8C879",
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  multiplierText: {
    fontFamily: FONT_WEIGHTS.display.extrabold,
    fontSize: 28,
    color: "#1F1810",
    letterSpacing: -0.6,
  },
  message: {
    marginTop: 18,
    maxWidth: 300,
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 14,
    color: "rgba(245, 242, 237, 0.85)",
    lineHeight: 22,
    textAlign: "center",
  },
  actions: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  flex1: {
    flex: 1,
  },
  revengeInvite: {
    gap: 12,
  },
  revengeInviteText: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 13,
    color: COLORS.cream,
    textAlign: "center",
  },
  goHomeBtn: {
    alignSelf: "center",
    padding: 8,
  },
  goHomeText: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 13,
    color: "rgba(245, 242, 237, 0.65)",
  },
});
