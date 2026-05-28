import { AppBackdrop, AppBar, LamapButton, RoundIcon, SectionHeader, Surface } from "@/components/lamap";
import { BuyKoraSheet } from "@/components/wallet/buy-kora-sheet";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { useEconomy } from "@/hooks/use-economy";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, type ErrorBoundaryProps, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const KORA_TO_XAF = 10;

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const theme = useTheme();
  const router = useRouter();
  const s = makeStyles(theme);
  return (
    <View style={s.root}>
      <AppBackdrop />
      <SafeAreaView style={s.center}>
        <Ionicons name="alert-circle" size={56} color={theme.accentGlow} />
        <Text style={s.errorTitle}>Erreur de chargement</Text>
        <Text style={s.errorMessage}>{error.message}</Text>
        <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
          <LamapButton title="Réessayer" variant="gold" onPress={retry} />
          <LamapButton title="Retour" variant="ghost" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    </View>
  );
}

export default function WalletScreen() {
  const theme = useTheme();
  const s = makeStyles(theme);
  const { isSignedIn } = useAuth();
  const { balance, currency, transactions } = useEconomy();
  const [buyVisible, setBuyVisible] = useState(false);

  if (!isSignedIn) {
    return (
      <View style={s.root}>
        <AppBackdrop />
        <SafeAreaView style={s.center}>
          <Text style={{ color: theme.cream, fontFamily: FONT_WEIGHTS.body.regular }}>
            Veuillez vous connecter
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  const xaf = Math.round(balance * KORA_TO_XAF);

  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop dust={10} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AppBar title="Mon Kora" />
        <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          {/* Balance hero */}
          <View style={s.hero}>
            <LinearGradient
              colors={[theme.goldA(0.22), theme.goldA(0.06)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={s.eyebrow}>SOLDE KORA</Text>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
              <Text style={s.diamond}>◆</Text>
              <Text style={s.balance}>{balance.toLocaleString("fr-FR")}</Text>
              <Text style={s.unit}>K</Text>
            </View>
            <Text style={s.approx}>
              ≈ {xaf.toLocaleString("fr-FR")} {currency} · disponible immédiatement
            </Text>
            <View style={s.actions}>
              <View style={{ flex: 1 }}>
                <LamapButton title="+ Recharger" variant="gold" onPress={() => setBuyVisible(true)} />
              </View>
              <View style={{ flex: 1 }}>
                <LamapButton title="↗ Retirer" variant="dark" onPress={() => {}} />
              </View>
            </View>
          </View>

          <SectionHeader title="Mouvements récents" />
          <Surface style={s.txList}>
            {transactions.length === 0 ? (
              <Text style={s.empty}>Aucune transaction.</Text>
            ) : (
              transactions.slice(0, 30).map((tx, i, arr) => {
                const positive = tx.amount >= 0;
                return (
                  <View
                    key={tx._id ?? i}
                    style={[
                      s.txRow,
                      i === arr.length - 1 ? null : { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.goldA(0.08) },
                    ]}
                  >
                    <RoundIcon name={positive ? "arrow-up" : "arrow-down"} tone={positive ? "accent" : "ember"} />
                    <View style={{ flex: 1 }}>
                      <Text style={s.txTitle} numberOfLines={1}>
                        {tx.description || formatType(tx.type)}
                      </Text>
                      <Text style={s.txDate}>{formatDate(tx.createdAt)}</Text>
                    </View>
                    <Text style={[s.txAmount, { color: positive ? theme.accentText : theme.chipEmberColor }]}>
                      {positive ? "+" : "−"}
                      {Math.abs(tx.amount).toLocaleString("fr-FR")} K
                    </Text>
                  </View>
                );
              })
            )}
          </Surface>
        </ScrollView>
      </SafeAreaView>

      <BuyKoraSheet visible={buyVisible} onClose={() => setBuyVisible(false)} />
    </View>
  );
}

function formatType(type: string) {
  return { win: "Victoire", loss: "Défaite", shop_purchase: "Achat", recharge: "Recharge", bet: "Mise", tutorial_reward: "Récompense tutoriel" }[type] ?? type;
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 60) return `il y a ${Math.max(1, mins)} min`;
  if (mins < 1440) return `il y a ${Math.floor(mins / 60)} h`;
  if (mins < 10080) return `il y a ${Math.floor(mins / 1440)} j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, gap: 12 },
    hero: {
      margin: 20,
      marginTop: 8,
      padding: 24,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.goldA(0.4),
      overflow: "hidden",
    },
    eyebrow: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 10, letterSpacing: 2.4, color: theme.gold, marginBottom: 8 },
    diamond: { fontSize: 30, color: theme.goldBright },
    balance: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 52, color: theme.cream, letterSpacing: -1.5, lineHeight: 54 },
    unit: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 11, color: theme.gold },
    approx: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 12, color: theme.creamA(0.6), marginTop: 8 },
    actions: { flexDirection: "row", gap: 10, marginTop: 18 },
    txList: { marginHorizontal: 20, paddingHorizontal: 4 },
    empty: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 13, color: theme.creamA(0.5), textAlign: "center", paddingVertical: 18 },
    txRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12, paddingVertical: 12 },
    txTitle: { fontFamily: FONT_WEIGHTS.body.semibold, fontSize: 13, color: theme.cream },
    txDate: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 10, color: theme.creamA(0.45), marginTop: 2 },
    txAmount: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 14 },
    errorTitle: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 22, color: theme.cream, textAlign: "center" },
    errorMessage: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 14, color: theme.creamA(0.7), textAlign: "center", maxWidth: 300, lineHeight: 20 },
  });
}
