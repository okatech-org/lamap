import { BattleZone } from "@/components/game/battle-zone";
import { CardHand, type Card } from "@/components/game/card-hand";
import { GameTimer } from "@/components/game/game-timer";
import { PlaceholderCardHand } from "@/components/game/placeholder-card-hand";
import { ResultAnimation } from "@/components/game/result-animation";
import { ResultPanel } from "@/components/game/result-panel";
import { TurnHistory } from "@/components/game/turn-history";
import {
  LamapButton,
  LamapGameTopBar,
  LamapKoraOverlay,
  LamapLeadSuitChip,
  LamapOpponentBar,
  LamapTurnBadge,
  TableBg,
} from "@/components/lamap";
import { GameTutorial } from "@/components/tutorial/game-tutorial";
import { COLORS, FONT_WEIGHTS } from "@/design";
import { api } from "@convex/_generated/api";
import { Rank, Suit } from "@convex/validators";
import { useAuth } from "@/hooks/use-auth";
import { useGame } from "@/hooks/use-game";
import { useGameTimer } from "@/hooks/use-game-timer";
import { useMatchmaking } from "@/hooks/use-matchmaking";
import { useSettings } from "@/hooks/use-settings";
import { useSound } from "@/hooks/use-sound";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "convex/react";
import {
    useLocalSearchParams,
    useRouter,
    type ErrorBoundaryProps,
} from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const router = useRouter();
  return (
    <View style={errorStyles.root}>
      <TableBg dust={false} />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={errorStyles.content}>
          <Ionicons name="alert-circle" size={64} color={COLORS.terre2} />
          <Text style={errorStyles.title}>Erreur de chargement</Text>
          <Text style={errorStyles.message}>{error.message}</Text>
          <View style={errorStyles.actions}>
            <LamapButton title="Réessayer" variant="primary" onPress={retry} />
            <LamapButton
              title="Retour"
              variant="ghost"
              onPress={() => router.back()}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const errorStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  title: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 24,
    color: COLORS.cream,
    textAlign: "center",
  },
  message: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 14,
    color: "rgba(245, 242, 237, 0.7)",
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 20,
  },
  actions: { flexDirection: "row", gap: 12, marginTop: 8 },
});

export default function MatchScreen() {
  const params = useLocalSearchParams<{ matchId: string; tutorial?: string }>();
  const { matchId } = params;
  const isTutorial = params.tutorial === "true";
  const router = useRouter();
  const { playAreaMode, battleLayout } = useSettings();

  const {
    game,
    myHand,
    currentPlays,
    turnResults,
    isMyTurn,
    playCard,
    canPlayCard,
    myUserId,
  } = useGame(matchId || null);

  const { userId } = useAuth();
  const concedeGameMutation = useMutation(api.games.concedeGame);
  const { playSound } = useSound();
  const startGame = useMutation(api.games.startGame);
  const { createMatchVsAI } = useMatchmaking();
  const sendRevengeRequest = useMutation(api.games.sendRevengeRequest);
  const acceptRevengeRequest = useMutation(api.games.acceptRevengeRequest);
  const rejectChallenge = useMutation(api.challenges.rejectChallenge);

  const gameMessages = useQuery(
    api.chat.getGameMessages,
    matchId ? { gameId: matchId } : "skip"
  );
  const [lastSeenTimestamp, setLastSeenTimestamp] = useState<number | null>(
    null
  );
  const [unreadCount, setUnreadCount] = useState(0);

  const revengeStatus = useQuery(
    api.games.getRevengeRequestStatus,
    game?.status === "ENDED" && matchId && myUserId ?
      { gameId: matchId, userId: myUserId }
    : "skip"
  );

  const prChange = useQuery(
    api.ranking.getPRChangeForGame,
    (
      game?.status === "ENDED" &&
        matchId &&
        myUserId &&
        (game.mode === "RANKED" || game.competitive)
    ) ?
      { gameId: matchId, userId: myUserId }
    : "skip"
  );

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previousTurnResults, setPreviousTurnResults] = useState<any[]>([]);
  const [previousIsMyTurn, setPreviousIsMyTurn] = useState<boolean | undefined>(
    undefined
  );
  const [previousGameStatus, setPreviousGameStatus] = useState<
    string | undefined
  >(undefined);
  const [resultPanelVisible, setResultPanelVisible] = useState(false);
  const hasStartedGameRef = useRef(false);
  const currentGameIdRef = useRef<string | null>(null);

  const {
    enabled: isTimerActive,
    timeRemaining,
    totalTime,
    timers: allTimers,
  } = useGameTimer(game?.gameId, myUserId || null);

  // Redirect to new game when revenge is accepted
  useEffect(() => {
    if (
      revengeStatus?.status === "accepted" &&
      "newGameId" in revengeStatus &&
      revengeStatus.newGameId
    ) {
      setResultPanelVisible(false);
      router.replace(`/(game)/match/${revengeStatus.newGameId}`);
    }
  }, [revengeStatus, router]);

  useEffect(() => {
    if (game?.gameId && game.gameId !== currentGameIdRef.current) {
      currentGameIdRef.current = game.gameId;
      hasStartedGameRef.current = false;
    }
  }, [game?.gameId]);

  useEffect(() => {
    if (turnResults && turnResults.length > previousTurnResults.length) {
      const newResult = turnResults[turnResults.length - 1];
      if (newResult && newResult.winnerId === myUserId) {
        playSound("victory");
      }
    }
    setPreviousTurnResults(turnResults || []);
  }, [turnResults, myUserId, playSound, previousTurnResults.length]);

  useEffect(() => {
    if (
      game?.victoryType &&
      game.victoryType.includes("kora") &&
      game.winnerId === myUserId
    ) {
      playSound("kora");
    }
  }, [game?.victoryType, game?.winnerId, myUserId, playSound]);

  useEffect(() => {
    if (previousGameStatus !== "PLAYING" && game?.status === "PLAYING") {
      playSound("gameStart");
    }
    setPreviousGameStatus(game?.status);
  }, [game?.status, previousGameStatus, playSound]);

  useEffect(() => {
    if (
      previousIsMyTurn !== undefined &&
      previousIsMyTurn !== isMyTurn &&
      game?.status === "PLAYING"
    ) {
      playSound("turnChange");
    }
    setPreviousIsMyTurn(isMyTurn);
  }, [isMyTurn, previousIsMyTurn, game?.status, playSound]);

  useEffect(() => {
    if (game?.status === "ENDED") {
      setResultPanelVisible(true);
    }
  }, [game?.status]);

  useEffect(() => {
    const loadLastSeenTimestamp = async () => {
      if (!matchId) return;
      try {
        const key = `gameChatLastSeen_${matchId}`;
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          setLastSeenTimestamp(parseInt(stored, 10));
        } else {
          setLastSeenTimestamp(Date.now());
        }
      } catch (error) {
        console.error("Error loading last seen timestamp:", error);
      }
    };
    loadLastSeenTimestamp();
  }, [matchId]);

  useEffect(() => {
    if (!gameMessages || !myUserId || lastSeenTimestamp === null) {
      setUnreadCount(0);
      return;
    }

    const unread = gameMessages.filter(
      (msg: any) =>
        msg.timestamp > lastSeenTimestamp && msg.playerId !== myUserId
    ).length;
    setUnreadCount(unread);
  }, [gameMessages, myUserId, lastSeenTimestamp]);

  const handleChatPress = useCallback(async () => {
    if (!matchId) return;
    try {
      const key = `gameChatLastSeen_${matchId}`;
      const now = Date.now();
      await AsyncStorage.setItem(key, now.toString());
      setLastSeenTimestamp(now);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error saving last seen timestamp:", error);
    }
    router.push(`/(game)/chat/${matchId}`);
  }, [matchId, router]);

  useEffect(() => {
    if (
      game?.status === "WAITING" &&
      game.players.length >= 2 &&
      !hasStartedGameRef.current
    ) {
      hasStartedGameRef.current = true;

      const startGameAsync = async () => {
        try {
          await startGame({ gameId: game.gameId });
        } catch (error: any) {
          if (!error?.message?.includes("Game already started")) {
            console.error("Error starting game:", error);
            hasStartedGameRef.current = false;
          }
        }
      };

      const delay = game.mode === "ONLINE" ? 1000 : 0;
      setTimeout(startGameAsync, delay);
    }
  }, [game?.status, game?.players.length, game?.gameId, game?.mode, startGame]);

  const handleCardSelect = useCallback(
    (card: Card) => {
      if (canPlayCard(card)) {
        setSelectedCard(card);
        playSound("cardSelect");
      }
    },
    [canPlayCard, playSound]
  );

  const handleDoubleTapCard = useCallback(
    async (card: Card) => {
      if (isPlaying) return;

      setIsPlaying(true);
      playSound("cardPlay");
      setSelectedCard(card);

      try {
        await playCard(card);
        setSelectedCard(null);
      } catch (error: any) {
        Alert.alert(
          "Carte non jouable",
          error.message ||
            "Cette carte ne peut pas être jouée pour le moment. Vérifiez que c'est votre tour et que vous suivez la couleur demandée."
        );
      } finally {
        setIsPlaying(false);
      }
    },
    [isPlaying, playCard, playSound]
  );

  const handleConcede = useCallback(async () => {
    if (!userId || !matchId) return;

    try {
      await concedeGameMutation({
        gameId: matchId,
        clerkUserId: userId,
      });

      Alert.alert(
        "Partie abandonnée",
        "Vous avez abandonné la partie. Votre adversaire a gagné.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(tabs)");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error ?
          error.message
        : "Impossible d'abandonner la partie",
        [{ text: "OK" }]
      );
    }
  }, [userId, matchId, concedeGameMutation, router]);

  // Styles are static — defined at module bottom (`screenStyles`).
  const styles = screenStyles;

  if (!matchId) {
    return (
      <View style={styles.root}>
        <TableBg dust={false} />
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <Text style={styles.loadingText}>Match ID manquant</Text>
        </SafeAreaView>
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.root}>
        <TableBg />
        <LamapGameTopBar current={0} total={5} />
        <SafeAreaView style={styles.contentArea} edges={["bottom"]}>
          <LamapOpponentBar name="?" cardsRemaining={5} />
          <View style={styles.playArea}>
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.or2} />
              <Text style={styles.loadingLabel}>
                Chargement de la partie…
              </Text>
            </View>
          </View>
          <View style={styles.handArea}>
            <PlaceholderCardHand cardCount={5} />
            <View style={styles.quitButtonContainer}>
              <LamapButton
                title="Quitter"
                variant="ghost"
                onPress={() => router.back()}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (game.status === "WAITING") {
    const opponent = game.players.find((p) => {
      const playerId = p.userId || p.botId;
      return playerId !== myUserId;
    });

    return (
      <View style={styles.root}>
        <TableBg />
        <LamapGameTopBar current={0} total={game.maxRounds || 5} />
        <SafeAreaView style={styles.contentArea} edges={["bottom"]}>
          <LamapOpponentBar
            name={opponent?.username || "?"}
            cardsRemaining={5}
          />
          <View style={styles.playArea}>
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.or2} />
              <Text style={styles.loadingLabel}>
                Préparation de la partie…
              </Text>
            </View>
          </View>
          <View style={styles.handArea}>
            <PlaceholderCardHand cardCount={5} />
            <View style={styles.quitButtonContainer}>
              <LamapButton
                title="Quitter"
                variant="ghost"
                onPress={() => router.back()}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const hasHandPlayer = game.players.find((p) => {
    const playerId = p.userId || p.botId;
    return playerId === game.hasHandPlayerId;
  });

  const opponent = game.players.find((p) => {
    const playerId = p.userId || p.botId;
    return playerId !== myUserId;
  });

  const opponentHasHand =
    hasHandPlayer && (hasHandPlayer.userId || hasHandPlayer.botId) !== myUserId;
  const iHaveHand =
    hasHandPlayer && (hasHandPlayer.userId || hasHandPlayer.botId) === myUserId;

  const opponentCardsRemaining = opponent?.hand?.length || 0;

  const opponentId = opponent?.userId || opponent?.botId;
  const opponentTimer =
    opponentId ? allTimers.find((t) => t.playerId === opponentId) : null;
  const opponentTimeRemaining = opponentTimer?.timeRemaining || 0;
  const isOpponentTurn = opponentId === game?.currentTurnPlayerId;

  // Visible header pip data is now derived from `wonRoundIndices` below.

  const opponentPlayedCard = currentPlays?.find(
    (pc) => pc.playerId !== myUserId
  )?.card;
  const playerPlayedCard = currentPlays?.find(
    (pc) => pc.playerId === myUserId
  )?.card;

  const firstPlayedCard =
    currentPlays && currentPlays.length > 0 ?
      currentPlays.reduce((earliest, current) =>
        current.timestamp < earliest.timestamp ? current : earliest
      )
    : null;

  const leadSuit = firstPlayedCard?.card?.suit;

  const includeCurrentPlays = game.status !== "ENDED";

  const allOpponentCards = [
    ...(turnResults
      ?.map(
        (result) =>
          game.playedCards
            ?.filter((pc: any) => pc.round === result.turn)
            .find((pc: any) => pc.playerId !== myUserId)?.card
      )
      .filter(Boolean) || []),
    ...(includeCurrentPlays && opponentPlayedCard ? [opponentPlayedCard] : []),
  ].filter(Boolean);

  const allPlayerCards = [
    ...(turnResults
      ?.map(
        (result) =>
          game.playedCards
            ?.filter((pc: any) => pc.round === result.turn)
            .find((pc: any) => pc.playerId === myUserId)?.card
      )
      .filter(Boolean) || []),
    ...(includeCurrentPlays && playerPlayedCard ? [playerPlayedCard] : []),
  ].filter(Boolean);

  const wonRoundIndices: number[] = (turnResults || [])
    .map((r, i) => (r.winnerId === myUserId ? i : -1))
    .filter((i) => i >= 0);

  const showKoraOverlay =
    game.status === "ENDED" &&
    !!game.victoryType &&
    typeof game.victoryType === "string" &&
    game.victoryType.toLowerCase().includes("kora") &&
    game.winnerId === myUserId &&
    resultPanelVisible;

  const koraMultiplier: 2 | 3 | 4 | 8 = (() => {
    const vt = (game.victoryType || "").toLowerCase();
    if (vt.includes("triple")) return 8;
    if (vt.includes("double")) return 4;
    return 2;
  })();

  // ─── End-game handlers (shared between ResultPanel and the Kora overlay) ──
  const handleRevenge = async () => {
    if (!myUserId || !matchId) return;
    const isAIMatch = game.aiDifficulty !== null;
    const isRankedMatch = game.mode === "RANKED";

    if (isAIMatch) {
      try {
        const difficulty = game.aiDifficulty as "easy" | "medium" | "hard";
        const newGameId = await createMatchVsAI(0, difficulty, "XAF");
        setResultPanelVisible(false);
        router.replace(`/(game)/match/${newGameId}`);
      } catch (error) {
        Alert.alert(
          "Erreur",
          error instanceof Error
            ? error.message
            : "Impossible de créer la revanche",
        );
      }
    } else if (isRankedMatch) {
      try {
        await sendRevengeRequest({
          originalGameId: matchId,
          senderId: myUserId,
        });
      } catch (error) {
        console.error("Erreur sendRevengeRequest:", error);
        Alert.alert(
          "Erreur",
          error instanceof Error
            ? error.message
            : "Impossible d'envoyer la proposition de revanche",
        );
      }
    }
  };

  const handleNewGame = () => {
    setResultPanelVisible(false);
    const isAIMatch = game.aiDifficulty !== null;
    const isRankedMatch = game.mode === "RANKED";
    if (isAIMatch) router.push(`/(lobby)/select-difficulty`);
    else if (isRankedMatch) router.replace("/(lobby)/ranked-matchmaking");
    else router.replace("/(lobby)/select-mode");
  };

  const handleGoHome = () => {
    setResultPanelVisible(false);
    router.replace("/(tabs)");
  };

  const handleAcceptRevenge = async () => {
    if (!myUserId || !revengeStatus?.challengeId) return;
    try {
      const result = await acceptRevengeRequest({
        challengeId: revengeStatus.challengeId,
        userId: myUserId,
      });
      setResultPanelVisible(false);
      router.replace(`/(game)/match/${result.gameId}`);
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error
          ? error.message
          : "Impossible d'accepter la revanche",
      );
    }
  };

  const handleRejectRevenge = async () => {
    if (!revengeStatus?.challengeId || !myUserId) return;
    try {
      await rejectChallenge({
        challengeId: revengeStatus.challengeId,
        userId: myUserId,
      });
    } catch (error) {
      console.error("Error rejecting revenge:", error);
    }
  };

  const normalizedRevengeStatus: "none" | "sent" | "received" | "accepted" =
    revengeStatus?.status === "sent"
      ? "sent"
      : revengeStatus?.status === "accepted"
        ? "sent"
        : revengeStatus?.status === "received"
          ? "received"
          : "none";

  const gameScreen = (
    <View style={styles.root}>
      <TableBg />
      <LamapGameTopBar
        current={Math.max(0, (game.currentRound || 1) - 1)}
        total={game.maxRounds}
        won={wonRoundIndices}
        onConcede={game.status === "PLAYING" ? handleConcede : undefined}
        rightSlot={
          <View style={styles.headerExtras}>
            {isTimerActive && game.status === "PLAYING" && (
              <GameTimer
                timeRemaining={timeRemaining}
                totalTime={totalTime}
                isMyTurn={isMyTurn}
                isActive={true}
                isOpponentTimer={false}
              />
            )}
            {game.mode !== "AI" && (
              <TouchableOpacity
                onPress={handleChatPress}
                style={styles.chatButton}
                accessibilityRole="button"
                accessibilityLabel="Chat de la partie"
              >
                <Ionicons name="chatbubble" size={22} color={COLORS.or2} />
                {unreadCount > 0 && (
                  <View style={styles.chatBadge}>
                    <Text style={styles.chatBadgeText}>
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        }
      />

      <SafeAreaView style={styles.contentArea} edges={["bottom"]}>
        {opponent && (
          <LamapOpponentBar
            name={opponent.username || "?"}
            hasHand={!!opponentHasHand}
            cardsRemaining={opponentCardsRemaining}
          />
        )}

        {leadSuit ? (
          <View style={styles.leadSuitWrap}>
            <LamapLeadSuitChip suit={leadSuit as any} />
          </View>
        ) : null}

        {/* Subtle indicator while we wait for the opponent — replaces the
            heavy isOpponentTurn pulse from the legacy OpponentZone. */}
        {isOpponentTurn && game.status === "PLAYING" && opponentTimeRemaining > 0 ? (
          <View style={styles.opponentTurnHint}>
            <Text style={styles.opponentTurnText}>
              Tour de {opponent?.username || "l'adversaire"}…
            </Text>
          </View>
        ) : null}

        <View style={styles.playArea}>
          {playAreaMode === "battle" ?
            <BattleZone
              opponentCards={allOpponentCards.map((card: any) => ({
                suit: card?.suit as Suit,
                rank: card?.rank as Rank,
              }))}
              playerCards={allPlayerCards.map((card: any) => ({
                suit: card?.suit as Suit,
                rank: card?.rank as Rank,
              }))}
              // leadSuit chip is rendered above the play area via
              // <LamapLeadSuitChip /> — don't double up here.
              battleLayout={battleLayout}
            />
          : <TurnHistory
              results={turnResults}
              myPlayerId={myUserId}
              game={game}
              currentPlays={currentPlays}
              currentRound={game.currentRound}
            />
          }
        </View>

        <View style={styles.handArea}>
          <View style={styles.turnBadgeContainer}>
            <LamapTurnBadge
              visible={isMyTurn && game.status === "PLAYING"}
              label={iHaveHand ? "À toi de mener" : "À toi de jouer"}
            />
          </View>
          <CardHand
            cards={myHand}
            isMyTurn={isMyTurn}
            onCardSelect={handleCardSelect}
            onCardDoubleTap={handleDoubleTapCard}
            selectedCard={selectedCard}
            disabled={isPlaying}
          />
        </View>

        {game.status === "ENDED" && game.victoryType && !showKoraOverlay && (
          <>
            <ResultAnimation
              visible={resultPanelVisible}
              victoryType={game.victoryType}
              isWinner={game.winnerId === myUserId}
            />
            <ResultPanel
              visible={resultPanelVisible}
              game={game}
              myUserId={myUserId ?? null}
              prChange={prChange?.change ?? null}
              onRevenge={handleRevenge}
              onNewGame={handleNewGame}
              onGoHome={handleGoHome}
              revengeStatus={normalizedRevengeStatus}
              onAcceptRevenge={handleAcceptRevenge}
              onRejectRevenge={handleRejectRevenge}
            />
          </>
        )}
      </SafeAreaView>

      <LamapKoraOverlay
        visible={showKoraOverlay}
        multiplier={koraMultiplier}
        message={`Tu remportes la manche avec un Kora.\nTes gains sont multipliés ×${koraMultiplier}.`}
        onNewGame={handleNewGame}
        onRevenge={handleRevenge}
        onGoHome={handleGoHome}
        revengeStatus={normalizedRevengeStatus}
        onAcceptRevenge={handleAcceptRevenge}
        onRejectRevenge={handleRejectRevenge}
      />
    </View>
  );

  if (isTutorial) {
    return (
      <GameTutorial
        gameState={game}
        currentRound={game?.currentRound || 1}
        isMyTurn={isMyTurn || false}
        onTutorialComplete={() => {
          router.push("/(onboarding)/tutorial");
        }}
      >
        {gameScreen}
      </GameTutorial>
    );
  }

  return gameScreen;
}

const screenStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  contentArea: {
    flex: 1,
  },
  loadingText: {
    fontFamily: FONT_WEIGHTS.body.regular,
    color: COLORS.cream,
    marginTop: 16,
    fontSize: 14,
    textAlign: "center",
  },
  headerExtras: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  chatButton: {
    padding: 4,
    position: "relative",
  },
  chatBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.terre,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.bg,
  },
  chatBadgeText: {
    fontFamily: FONT_WEIGHTS.body.bold,
    fontSize: 10,
    color: COLORS.cream,
  },
  leadSuitWrap: {
    alignItems: "center",
    marginTop: 8,
  },
  opponentTurnHint: {
    alignSelf: "center",
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(15, 22, 32, 0.7)",
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  opponentTurnText: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 10,
    letterSpacing: 1.4,
    color: "rgba(245, 242, 237, 0.7)",
    textTransform: "uppercase",
  },
  playArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  handArea: {
    paddingTop: 20,
    height: 200,
    position: "relative",
    backgroundColor: "transparent",
  },
  turnBadgeContainer: {
    alignItems: "center",
    paddingVertical: 8,
    position: "absolute",
    width: "100%",
    top: -60,
    zIndex: 5,
  },
  loadingOverlay: {
    alignItems: "center",
    gap: 12,
  },
  loadingLabel: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 14,
    color: "rgba(245, 242, 237, 0.7)",
  },
  quitButtonContainer: {
    position: "absolute",
    bottom: 24,
    minWidth: 150,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100,
  },
});
