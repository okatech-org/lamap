import { Avatar, DeepBg, LamapButton } from "@/components/lamap";
import { COLORS, FONT_WEIGHTS } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { useMatchmaking } from "@/hooks/use-matchmaking";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RankedMatchmakingScreen() {
  const router = useRouter();
  const { convexUser } = useAuth();
  const { status, gameId, opponent, joinQueue, leaveQueue } = useMatchmaking();
  const [seconds, setSeconds] = useState(0);
  const joined = useRef(false);
  const searching = useRef(false);
  searching.current = status === "searching";

  useEffect(() => {
    if (joined.current || status === "matched") return;
    joined.current = true;
    joinQueue().catch(() => {
      joined.current = false;
    });
  }, [joinQueue, status]);
  useEffect(() => {
    if (status !== "searching") return;
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [status]);
  useEffect(() => {
    if (status !== "matched" || !gameId) return;
    const timer = setTimeout(
      () => router.replace(`/(game)/match/${gameId}`),
      900,
    );
    return () => clearTimeout(timer);
  }, [gameId, router, status]);
  useEffect(
    () => () => {
      if (searching.current) void leaveQueue();
    },
    [leaveQueue],
  );

  const cancel = async () => {
    await leaveQueue();
    router.back();
  };
  const username = convexUser?.username ?? "Joueur";
  return (
    <View style={styles.root}>
      <DeepBg dustCount={18} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.top}>
          <Ionicons name="globe-outline" size={20} color={COLORS.or2} />
          <Text style={styles.topText}>
            {status === "matched" ? "ADVERSAIRE TROUVÉ" : "MATCHMAKING MONDIAL"}
          </Text>
        </View>
        <View style={styles.duel}>
          <Player name={username} avatarId={convexUser?.activeAvatarId} />
          <Text style={styles.vs}>VS</Text>
          {opponent ? (
            <Player name={opponent.username} avatarId={opponent.avatarId} />
          ) : (
            <View style={styles.searchDisc}>
              <Ionicons name="search" size={34} color={COLORS.or2} />
            </View>
          )}
        </View>
        <Text style={styles.title}>
          {status === "matched"
            ? "Le duel va commencer."
            : "Recherche en cours…"}
        </Text>
        <Text style={styles.body}>
          {status === "matched"
            ? `${opponent?.points ?? 500} points`
            : `${seconds} s · recherche mondiale`}
        </Text>
        <View style={styles.footer}>
          <LamapButton
            title="Annuler"
            variant="ghost"
            onPress={cancel}
            disabled={status === "matched"}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function Player({ name, avatarId }: { name: string; avatarId?: string }) {
  return (
    <View style={styles.player}>
      <Avatar
        initials={name.slice(0, 2).toUpperCase()}
        avatarId={avatarId}
        size={72}
      />
      <Text style={styles.playerName}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  safe: { flex: 1, padding: 24 },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
  },
  topText: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    color: COLORS.or2,
    fontSize: 10,
    letterSpacing: 1.6,
  },
  duel: {
    marginTop: 110,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  player: { width: 100, alignItems: "center", gap: 10 },
  playerName: {
    color: COLORS.cream,
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 13,
    textAlign: "center",
  },
  vs: {
    color: COLORS.terre2,
    fontFamily: FONT_WEIGHTS.display.extrabold,
    fontSize: 26,
  },
  searchDisc: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.or2,
  },
  title: {
    marginTop: 70,
    textAlign: "center",
    color: COLORS.cream,
    fontFamily: FONT_WEIGHTS.display.extrabold,
    fontSize: 28,
  },
  body: {
    marginTop: 10,
    textAlign: "center",
    color: "rgba(241,232,214,0.6)",
    fontSize: 13,
  },
  footer: { marginTop: "auto" },
});
