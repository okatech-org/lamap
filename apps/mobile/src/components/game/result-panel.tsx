import { Divider, LamapButton, LamapSectionLabel } from "@/components/lamap";
import { COLORS, FONT_WEIGHTS } from "@/design";
import { useSound } from "@/hooks/use-sound";
import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type RatingPlayer = { userId: string; delta: number };

export function ResultPanel({
  visible,
  game,
  myUserId,
  onNewGame,
  onGoHome,
  onReport,
  onBlock,
}: {
  visible: boolean;
  game: {
    winnerId: string | null;
    victoryType: string | null;
    mode: "AI" | "RANKED";
    ratingResult?: {
      winner: RatingPlayer;
      loser: RatingPlayer;
      appliedAt: number;
    };
  };
  myUserId: string | null;
  onNewGame: () => void;
  onGoHome: () => void;
  onReport?: () => void;
  onBlock?: () => void;
}) {
  const { playSound } = useSound();
  const sounded = useRef(false);
  const y = useSharedValue(360);
  const opacity = useSharedValue(0);
  const isWinner = game.winnerId === myUserId;
  const ratingPlayer = game.ratingResult
    ? game.ratingResult.winner.userId === myUserId
      ? game.ratingResult.winner
      : game.ratingResult.loser
    : null;
  const special = game.victoryType?.includes("kora");

  useEffect(() => {
    y.value = visible ? withSpring(0, { damping: 20 }) : withTiming(360);
    opacity.value = withTiming(visible ? 1 : 0);
    if (visible && !sounded.current) {
      void playSound(isWinner ? (special ? "kora" : "victory") : "defeat");
      sounded.current = true;
    }
    if (!visible) sounded.current = false;
  }, [isWinner, opacity, playSound, special, visible, y]);
  const animated = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }));

  return (
    <Animated.View
      style={[styles.wrap, animated]}
      pointerEvents={visible ? "auto" : "none"}
    >
      <View style={styles.panel}>
        <Text style={[styles.title, !isWinner && styles.loss]}>
          {isWinner ? (special ? "KORA !" : "Victoire !") : "Défaite"}
        </Text>
        <Text style={styles.subtitle}>
          {game.mode === "AI"
            ? "Cette partie ne modifie pas le classement."
            : "Résultat classé appliqué."}
        </Text>
        <View style={styles.divider}>
          <Divider />
        </View>
        {ratingPlayer ? (
          <View style={styles.rating}>
            <LamapSectionLabel tone="muted">CLASSEMENT</LamapSectionLabel>
            <Text style={[styles.delta, ratingPlayer.delta < 0 && styles.loss]}>
              {ratingPlayer.delta >= 0 ? "+" : ""}
              {ratingPlayer.delta} pts
            </Text>
          </View>
        ) : null}
        <View style={styles.actions}>
          <View style={{ flex: 1 }}>
            <LamapButton
              title="Rejouer"
              variant="primary"
              onPress={onNewGame}
            />
          </View>
          <View style={{ flex: 1 }}>
            <LamapButton title="Accueil" variant="ghost" onPress={onGoHome} />
          </View>
        </View>
        {game.mode === "RANKED" && onReport && onBlock ? (
          <View style={styles.moderation}>
            <Pressable onPress={onReport}>
              <Text style={styles.moderationText}>Signaler</Text>
            </Pressable>
            <Text style={styles.dot}>·</Text>
            <Pressable onPress={onBlock}>
              <Text style={styles.moderationText}>Bloquer</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 100,
  },
  panel: {
    padding: 24,
    paddingBottom: 34,
    backgroundColor: "rgba(22,7,11,0.98)",
    borderTopWidth: 1,
    borderTopColor: "rgba(201,165,95,0.3)",
  },
  title: {
    textAlign: "center",
    fontFamily: FONT_WEIGHTS.display.extrabold,
    fontSize: 34,
    color: COLORS.or2,
  },
  loss: { color: COLORS.terre2 },
  subtitle: {
    marginTop: 7,
    textAlign: "center",
    fontFamily: FONT_WEIGHTS.body.regular,
    color: "rgba(241,232,214,0.6)",
    fontSize: 13,
  },
  divider: { marginVertical: 18 },
  rating: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  delta: {
    fontFamily: FONT_WEIGHTS.display.extrabold,
    color: COLORS.or2,
    fontSize: 20,
  },
  actions: { flexDirection: "row", gap: 10, marginTop: 20 },
  moderation: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 16,
  },
  moderationText: {
    color: "rgba(241,232,214,0.55)",
    fontSize: 12,
    textDecorationLine: "underline",
  },
  dot: { color: "rgba(241,232,214,0.3)" },
});
