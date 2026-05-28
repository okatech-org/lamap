import { AppBackdrop, AppBar, PageTitle } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Tier = {
  id: string;
  name: string;
  mise: number;
  min: number;
  players: string;
  kicker: string;
  sub: string;
  tone: "accent" | "gold" | "amber";
};

const TIERS: Tier[] = [
  { id: "d", name: "Découverte", mise: 50, min: 200, players: "1 482", kicker: "Pour s'amuser", sub: "Tables douces — risque limité, idéal pour apprendre.", tone: "accent" },
  { id: "s", name: "Standard", mise: 200, min: 800, players: "628", kicker: "Le cœur du jeu", sub: "Où ça joue vraiment. Mises sérieuses, pots qui montent.", tone: "gold" },
  { id: "v", name: "VIP", mise: 1000, min: 4000, players: "94", kicker: "Pour les gros", sub: "Réservé aux soldes confortables. Statut & prestige.", tone: "amber" },
];

const fmt = (n: number) => n.toLocaleString("fr-FR");

export default function TablesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const s = makeStyles(theme);
  const { convexUser } = useAuth();
  const balance = convexUser?.balance ?? 0;

  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop dust={10} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AppBar
          title=""
          right={
            <View style={s.balanceChip}>
              <Text style={s.balanceDiamond}>◆</Text>
              <Text style={s.balanceText}>{fmt(balance)}</Text>
            </View>
          }
        />
        <PageTitle eyebrow="MISE LIBRE" title={"Choisis ta\ntable."} />
        <Text style={s.intro}>La mise est antéposée à chaque main. 5 % de rake sur le pot.</Text>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 12 }} showsVerticalScrollIndicator={false}>
          {TIERS.map((t) => {
            const locked = balance < t.min;
            const accent = t.tone === "accent" ? theme.accentText : theme.goldBright;
            const bg = t.tone === "amber" ? theme.goldA(0.25) : t.tone === "gold" ? theme.goldA(0.15) : theme.surfA(0.55);
            const border = locked ? theme.goldA(0.1) : t.tone === "amber" ? theme.goldA(0.5) : t.tone === "gold" ? theme.goldA(0.25) : theme.goldA(0.12);
            return (
              <Pressable
                key={t.id}
                disabled={locked}
                onPress={() => router.push("/(lobby)/matchmaking")}
                style={[s.card, { backgroundColor: bg, borderColor: border, opacity: locked ? 0.6 : 1 }]}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
                  <View
                    style={[
                      s.icon,
                      {
                        backgroundColor: locked ? theme.surfA(0.7) : `${accent}22`,
                        borderColor: locked ? theme.goldA(0.15) : `${accent}55`,
                      },
                    ]}
                  >
                    <Ionicons name={locked ? "lock-closed" : t.tone === "amber" ? "star" : "ellipse"} size={16} color={locked ? theme.creamA(0.4) : accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
                      <Text style={s.name}>{t.name}</Text>
                      <Text style={s.kicker}>· {t.kicker}</Text>
                    </View>
                    <Text style={s.sub}>{t.sub}</Text>
                    <View style={s.metaRow}>
                      <Meta theme={theme} label="MISE / MAIN" value={`◆ ${fmt(t.mise)}`} accent={accent} />
                      <View style={s.metaDivider} />
                      <Meta theme={theme} label="SOLDE MIN." value={`◆ ${fmt(t.min)}`} />
                      <View style={s.metaDivider} />
                      <Meta theme={theme} label="JOUEURS" value={t.players} />
                    </View>
                  </View>
                </View>
                {locked ? (
                  <View style={[s.lockedBar, { backgroundColor: theme.emberA(0.12), borderColor: theme.emberA(0.3) }]}>
                    <Text style={[s.lockedText, { color: theme.chipEmberColor }]}>
                      Il te manque ◆ {fmt(t.min - balance)}
                    </Text>
                    <Text style={[s.rechargeLink, { color: theme.goldBright }]}>RECHARGER ›</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}

          <Text style={s.footNote}>KORA · ×2 SI 3 SUR LE DERNIER PLI · ×4 SUR DOUBLE-KORA</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Meta({ theme, label, value, accent }: { theme: Theme; label: string; value: string; accent?: string }) {
  return (
    <View>
      <Text style={{ fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 7, letterSpacing: 1.4, color: theme.creamA(0.5) }}>
        {label}
      </Text>
      <Text style={{ fontFamily: FONT_WEIGHTS.display.bold, fontSize: 14, color: accent ?? theme.cream, marginTop: 2 }}>
        {value}
      </Text>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    balanceChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      height: 28,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.goldA(0.1),
      borderWidth: 1,
      borderColor: theme.goldA(0.28),
    },
    balanceDiamond: { fontSize: 11, color: theme.goldBright },
    balanceText: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 12, color: theme.goldBright },
    intro: {
      paddingHorizontal: 20,
      paddingBottom: 18,
      marginTop: -8,
      fontFamily: FONT_WEIGHTS.body.regular,
      fontSize: 13,
      lineHeight: 19,
      color: theme.creamA(0.6),
    },
    card: { padding: 16, borderRadius: 18, borderWidth: 1 },
    icon: { width: 46, height: 46, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
    name: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 19, color: theme.cream },
    kicker: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 9, color: theme.creamA(0.45) },
    sub: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 12, lineHeight: 17, color: theme.creamA(0.55), marginTop: 4 },
    metaRow: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 12 },
    metaDivider: { width: 1, height: 22, backgroundColor: theme.goldA(0.12) },
    lockedBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
    },
    lockedText: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 11 },
    rechargeLink: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 9, letterSpacing: 1 },
    footNote: {
      fontFamily: FONT_WEIGHTS.mono.medium,
      fontSize: 8,
      letterSpacing: 1.4,
      color: theme.creamA(0.4),
      textAlign: "center",
      lineHeight: 14,
      marginTop: 12,
    },
  });
}
