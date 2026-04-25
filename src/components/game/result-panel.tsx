import { Divider, LamapButton, LamapSectionLabel } from "@/components/lamap";
import { COLORS, FONT_WEIGHTS } from "@/design";
import { useSound } from "@/hooks/use-sound";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const PANEL_HEIGHT = 320;

interface ResultPanelProps {
  visible: boolean;
  game: {
    winnerId: string | null;
    victoryType: string | null;
    bet: { amount: number; currency: string };
    players: { userId: string | null; balance: number }[];
    aiDifficulty?: string | null;
    mode?: string;
    competitive?: boolean;
  };
  myUserId: string | null;
  onRevenge: () => void;
  onNewGame: () => void;
  onGoHome: () => void;
  revengeStatus?: "none" | "sent" | "received" | "accepted";
  onAcceptRevenge?: () => void;
  onRejectRevenge?: () => void;
  prChange?: number | null;
}

export function ResultPanel({
  visible,
  game,
  myUserId,
  onRevenge,
  onNewGame,
  onGoHome,
  revengeStatus = "none",
  onAcceptRevenge,
  onRejectRevenge,
  prChange,
}: ResultPanelProps) {
  const { playSound } = useSound();
  const soundPlayedRef = useRef(false);
  const [countedGains, setCountedGains] = useState(0);

  const translateY = useSharedValue(PANEL_HEIGHT);
  const opacity = useSharedValue(0);

  const isWinner = game.winnerId === myUserId;
  const totalBet = game.bet.amount * 2;
  const platformFee = totalBet * 0.02;
  const opponentBet = game.bet.amount;

  let winnings = 0;
  let multiplier = 1;
  if (isWinner) {
    if (game.victoryType === "triple_kora") {
      multiplier = 3;
      winnings = opponentBet * multiplier - platformFee;
    } else if (game.victoryType === "double_kora") {
      multiplier = 2;
      winnings = opponentBet * multiplier - platformFee;
    } else if (game.victoryType === "simple_kora") {
      multiplier = 1.5;
      winnings = opponentBet * multiplier - platformFee;
    } else if (game.victoryType === "forfeit") {
      winnings = opponentBet * 2 - platformFee;
    } else {
      winnings = opponentBet - platformFee;
    }
  }

  const getVictoryTitle = () => {
    if (game.victoryType === "triple_kora") return "333 EXPORT !";
    if (game.victoryType === "double_kora") return "33 EXPORT !";
    if (game.victoryType === "simple_kora") return "KORA !";
    if (game.victoryType === "auto_sum") return "MAIN FAIBLE !";
    if (game.victoryType === "auto_sevens") return "TRIPLE 7 !";
    if (game.victoryType === "forfeit") return "ABANDON !";
    return "BANDI !";
  };

  const isFreeGame = game.bet.amount === 0;
  const showMoneyRow = !isFreeGame;
  const showPrRow = prChange != null;

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
      opacity.value = withTiming(1, {
        duration: 240,
        easing: Easing.out(Easing.ease),
      });

      if (isWinner && winnings > 0) {
        const duration = 1000;
        const steps = 30;
        const increment = winnings / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= winnings) {
            setCountedGains(Math.round(winnings));
            clearInterval(timer);
          } else {
            setCountedGains(Math.floor(current));
          }
        }, duration / steps);
        return () => clearInterval(timer);
      }
    } else {
      translateY.value = withTiming(PANEL_HEIGHT, {
        duration: 220,
        easing: Easing.in(Easing.ease),
      });
      opacity.value = withTiming(0, { duration: 180 });
      soundPlayedRef.current = false;
      setCountedGains(0);
    }
  }, [visible, translateY, opacity, isWinner, winnings]);

  useEffect(() => {
    if (visible && game && !soundPlayedRef.current) {
      if (isWinner) {
        if (game.victoryType === "triple_kora") playSound("koraTriple");
        else if (game.victoryType === "double_kora") playSound("koraDouble");
        else if (game.victoryType === "simple_kora") playSound("kora");
        else if (
          game.victoryType === "auto_sum" ||
          game.victoryType === "auto_sevens"
        )
          playSound("autoVictory");
        else playSound("victory");
      } else {
        playSound("defeat");
      }
      soundPlayedRef.current = true;
    }
  }, [visible, game, isWinner, playSound]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, panelStyle]} pointerEvents="box-none">
      <View style={styles.panel}>
        <LinearGradient
          colors={[
            "rgba(15,22,32,0)",
            "rgba(15,22,32,0.85)",
            "rgba(15,22,32,0.97)",
          ]}
          locations={[0, 0.18, 0.55]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Gold corner ornaments */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                isWinner ? styles.titleWin : styles.titleLoss,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {isWinner ? getVictoryTitle() : "Vous avez perdu"}
            </Text>
            {!isWinner ? <Text style={styles.skull}>💀</Text> : null}
          </View>

          {isWinner && multiplier > 1 ? (
            <View style={styles.multiplierWrap}>
              <LinearGradient
                colors={["#C9A876", "#6E5536"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
              />
              <Text style={styles.multiplierText}>
                ×{multiplier === 1.5 ? "1.5" : multiplier}
              </Text>
            </View>
          ) : null}

          <View style={styles.dividerWrap}>
            <Divider />
          </View>

          {showPrRow ? (
            <View style={styles.statRow}>
              <LamapSectionLabel tone="muted">
                {prChange! >= 0 ? "Gain" : "Perte"}
              </LamapSectionLabel>
              <Text
                style={[
                  styles.statValue,
                  prChange! >= 0 ? styles.statGain : styles.statLoss,
                ]}
              >
                {prChange! >= 0 ? "+" : ""}
                {prChange} PR
              </Text>
            </View>
          ) : null}

          {showMoneyRow ? (
            <View style={styles.statRow}>
              <LamapSectionLabel tone="muted">
                {isWinner ? "Gains" : "Perte"}
              </LamapSectionLabel>
              <Text
                style={[
                  styles.statValue,
                  isWinner ? styles.statGain : styles.statLoss,
                ]}
              >
                {isWinner ? "+" : "−"}
                {(isWinner
                  ? countedGains
                  : game.bet.amount
                ).toLocaleString("fr-FR")}{" "}
                {game.bet.currency}
              </Text>
            </View>
          ) : null}

          {/* Revenge received — invitation row above the buttons */}
          {revengeStatus === "received" &&
          onAcceptRevenge &&
          onRejectRevenge ? (
            <View style={styles.revengeInvite}>
              <Text style={styles.revengeInviteText}>
                Votre adversaire veut une revanche !
              </Text>
              <View style={styles.actionsRow}>
                <View style={styles.actionFlex}>
                  <LamapButton
                    title="Refuser"
                    variant="ghost"
                    onPress={onRejectRevenge}
                  />
                </View>
                <View style={styles.actionFlex}>
                  <LamapButton
                    title="Accepter"
                    variant="primary"
                    onPress={onAcceptRevenge}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.actionsRow}>
              <View style={styles.actionFlex}>
                <LamapButton
                  title="Nouvelle partie"
                  variant="primary"
                  onPress={onNewGame}
                />
              </View>
              <View style={styles.actionFlex}>
                <LamapButton
                  title={revengeStatus === "sent" ? "Envoyée" : "Revanche"}
                  variant="ghost"
                  onPress={onRevenge}
                  disabled={revengeStatus === "sent"}
                />
              </View>
            </View>
          )}

          <Pressable
            onPress={onGoHome}
            style={styles.goHomeBtn}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Retour à l'accueil"
          >
            <Text style={styles.goHomeText}>← Retour à l&apos;accueil</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  panel: {
    position: "relative",
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "rgba(201, 168, 118, 0.3)",
  },
  corner: {
    position: "absolute",
    width: 22,
    height: 22,
    borderColor: COLORS.or,
    opacity: 0.7,
  },
  cornerTL: {
    top: 14,
    left: 14,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
  },
  cornerTR: {
    top: 14,
    right: 14,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
  },
  cornerBL: {
    bottom: 14,
    left: 14,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
  },
  cornerBR: {
    bottom: 14,
    right: 14,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
  },
  content: {
    gap: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  title: {
    fontFamily: FONT_WEIGHTS.display.extrabold,
    fontSize: 30,
    letterSpacing: -0.6,
    textAlign: "center",
  },
  titleWin: {
    color: COLORS.or2,
    textShadowColor: "rgba(232, 200, 121, 0.45)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  titleLoss: {
    color: COLORS.cream,
  },
  skull: {
    fontSize: 28,
  },
  multiplierWrap: {
    alignSelf: "center",
    marginTop: 12,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "#E8C879",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  multiplierText: {
    fontFamily: FONT_WEIGHTS.display.extrabold,
    fontSize: 18,
    color: "#1F1810",
    letterSpacing: -0.4,
  },
  dividerWrap: {
    marginTop: 18,
    marginBottom: 18,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statValue: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 22,
    letterSpacing: -0.4,
  },
  statGain: {
    color: COLORS.or2,
  },
  statLoss: {
    color: COLORS.terre2,
  },
  revengeInvite: {
    gap: 12,
    marginBottom: 6,
  },
  revengeInviteText: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 13,
    color: COLORS.cream,
    textAlign: "center",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionFlex: {
    flex: 1,
  },
  goHomeBtn: {
    marginTop: 16,
    alignSelf: "center",
    padding: 8,
  },
  goHomeText: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 13,
    color: "rgba(245, 242, 237, 0.6)",
  },
});
