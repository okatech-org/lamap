import { GameTableSkia, type Card } from "@/components/game/game-table-skia";
import { ResultAnimation } from "@/components/game/result-animation";
import { ResultPanel } from "@/components/game/result-panel";
import {
  LamapGameTopBar,
  LamapLeadSuitChip,
  LamapOpponentBar,
  LamapTurnBadge,
  TableBg,
} from "@/components/lamap";
import { COLORS, FONT_WEIGHTS } from "@/design";
import { useGame } from "@/hooks/use-game";
import { useSound } from "@/hooks/use-sound";
import { api } from "@lamap/convex/_generated/api";
import type { Rank, Suit } from "@lamap/convex/validators";
import { useMutation } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function MatchScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { playSound } = useSound();
  const { game, myHand, currentPlays, isMyTurn, playCard, myUserId } = useGame(
    matchId ?? null,
  );
  const concede = useMutation(api.games.concedeGame);
  const report = useMutation(api.moderation.reportUser);
  const block = useMutation(api.moderation.blockUser);
  const [selected, setSelected] = useState<Card | null>(null);
  const [playing, setPlaying] = useState(false);

  const opponent = game?.players.find((player) => player.userId !== myUserId);
  const myStack = currentPlays
    .filter((played) => played.playerId === myUserId)
    .map((played) => played.card);
  const opponentStack = currentPlays
    .filter((played) => played.playerId !== myUserId)
    .map((played) => played.card);
  const leadSuit = currentPlays[0]?.card.suit;
  const wonRounds = useMemo(
    () =>
      game?.history
        .filter(
          (entry) =>
            entry.action === "round_won" && entry.playerId === myUserId,
        )
        .map((entry) => entry.data?.round ?? 0) ?? [],
    [game?.history, myUserId],
  );

  if (!game || !myUserId) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={COLORS.or2} />
        <Text style={styles.loadingText}>Chargement de la partie…</Text>
      </View>
    );
  }

  const play = async (card: Card) => {
    if (!card.playable || playing) return;
    setPlaying(true);
    try {
      await playCard(card);
      setSelected(null);
      void playSound("cardPlay");
    } catch (error) {
      Alert.alert(
        "Carte non jouable",
        error instanceof Error ? error.message : "Réessayez.",
      );
    } finally {
      setPlaying(false);
    }
  };
  const askConcede = () =>
    Alert.alert("Abandonner ?", "Une défaite classée fera perdre des points.", [
      { text: "Continuer", style: "cancel" },
      {
        text: "Abandonner",
        style: "destructive",
        onPress: () => void concede({ gameId: game.gameId }),
      },
    ]);
  const newGame = () =>
    router.replace(
      game.mode === "AI"
        ? "/(lobby)/select-difficulty"
        : "/(lobby)/ranked-matchmaking",
    );
  const opponentUserId = opponent?.userId;

  return (
    <View style={styles.root}>
      <TableBg />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <LamapGameTopBar
          current={game.currentRound}
          total={game.maxRounds}
          won={wonRounds}
          onConcede={game.status === "PLAYING" ? askConcede : undefined}
        />
        <LamapOpponentBar
          name={opponent?.username ?? "Adversaire"}
          cardsRemaining={opponent?.handCount ?? 0}
          hasHand={
            game.hasHandPlayerId === (opponent?.userId ?? opponent?.botId)
          }
          cardBackId={opponent?.cardBackId}
        />
        <View style={styles.table}>
          <View style={styles.lead}>
            {leadSuit ? <LamapLeadSuitChip suit={leadSuit} /> : null}
          </View>
          <GameTableSkia
            myHand={myHand as Card[]}
            playerStack={myStack.map((card) => ({
              suit: card.suit as Suit,
              rank: card.rank as Rank,
            }))}
            opponentStack={opponentStack.map((card) => ({
              suit: card.suit as Suit,
              rank: card.rank as Rank,
            }))}
            leadSuit={leadSuit as Suit | undefined}
            isMyTurn={isMyTurn}
            disabled={playing || game.status !== "PLAYING"}
            selectedCard={selected}
            onCardSelect={(card) => {
              setSelected(card);
              void playSound("cardSelect");
            }}
            onCardDoubleTap={(card) => void play(card)}
            bottomInset={insets.bottom}
          />
          <View style={styles.turn}>
            <LamapTurnBadge
              visible={isMyTurn && game.status === "PLAYING"}
              label={
                game.hasHandPlayerId === myUserId
                  ? "À toi de mener"
                  : "À toi de jouer"
              }
            />
          </View>
        </View>
        {game.status === "ENDED" && game.victoryType ? (
          <>
            <ResultAnimation
              visible
              victoryType={game.victoryType}
              isWinner={game.winnerId === myUserId}
            />
            <ResultPanel
              visible
              game={game}
              myUserId={myUserId}
              onNewGame={newGame}
              onGoHome={() => router.replace("/(tabs)")}
              onReport={
                opponentUserId
                  ? () =>
                      void report({
                        targetUserId: opponentUserId,
                        reason: "other",
                        note: `Signalement après la partie ${game.gameId}`,
                      }).then(() => Alert.alert("Signalement envoyé"))
                  : undefined
              }
              onBlock={
                opponentUserId
                  ? () =>
                      void block({ blockedId: opponentUserId }).then(() =>
                        Alert.alert("Joueur bloqué"),
                      )
                  : undefined
              }
            />
          </>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bg,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.cream,
    fontFamily: FONT_WEIGHTS.body.regular,
  },
  table: { flex: 1, position: "relative" },
  lead: {
    position: "absolute",
    top: 8,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  turn: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 190,
    alignItems: "center",
    zIndex: 10,
  },
});
