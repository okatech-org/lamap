import {
  DeepBg,
  LamapButton,
  LamapKoraCoin,
  LamapSectionLabel,
} from "@/components/lamap";
import { COLORS, FONT_WEIGHTS } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { useEconomy } from "@/hooks/use-economy";
import { Ionicons } from "@expo/vector-icons";
import { Stack, type ErrorBoundaryProps, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BuyKoraSheet } from "@/components/wallet/buy-kora-sheet";

const KORA_TO_XAF = 10;

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const router = useRouter();
  return (
    <View style={styles.root}>
      <DeepBg />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={styles.errorWrap}>
          <Ionicons name="alert-circle" size={64} color={COLORS.terre2} />
          <Text style={styles.errorTitle}>Erreur de chargement</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          <View style={styles.errorActions}>
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

export default function WalletScreen() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { balance, currency, transactions } = useEconomy();
  const [buySheetVisible, setBuySheetVisible] = useState(false);

  if (!isSignedIn) {
    return (
      <View style={styles.root}>
        <DeepBg />
        <View style={styles.center}>
          <Text style={styles.body}>Veuillez vous connecter</Text>
        </View>
      </View>
    );
  }

  const xafApprox = Math.round(balance * KORA_TO_XAF);

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <DeepBg />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={22} color={COLORS.or2} />
          </Pressable>
          <Text style={styles.topTitle}>Wallet</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroBg} pointerEvents="none" />

          {/* Balance hero */}
          <View style={styles.hero}>
            <LamapSectionLabel>Solde Kora</LamapSectionLabel>
            <View style={styles.balanceRow}>
              <LamapKoraCoin size="lg" />
              <Text style={styles.balanceText}>
                {balance.toLocaleString("fr-FR")}
              </Text>
            </View>
            <Text style={styles.balanceSub}>
              ≈ {xafApprox.toLocaleString("fr-FR")} {currency} · 1 Kora ={" "}
              {KORA_TO_XAF} {currency}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <LamapButton
              title="+ Acheter du Kora"
              variant="primary"
              onPress={() => setBuySheetVisible(true)}
            />
          </View>

          {/* History */}
          <View style={styles.section}>
            <LamapSectionLabel>Historique</LamapSectionLabel>
            <View style={styles.transactionList}>
              {transactions.length === 0 ? (
                <Text style={styles.empty}>Aucune transaction.</Text>
              ) : (
                transactions.slice(0, 30).map((tx, i) => {
                  const positive = tx.amount >= 0;
                  const isKora =
                    typeof tx.description === "string" &&
                    tx.description.toLowerCase().includes("kora");
                  return (
                    <View key={tx._id ?? i} style={styles.txRow}>
                      <View style={{ flex: 1 }}>
                        <View style={styles.txTitleRow}>
                          <Text style={styles.txTitle} numberOfLines={1}>
                            {tx.description || formatType(tx.type)}
                          </Text>
                          {isKora ? (
                            <View style={styles.koraChip}>
                              <Text style={styles.koraChipText}>KORA</Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={styles.txDate}>
                          {formatDate(tx.createdAt)}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.txAmount,
                          {
                            color: positive ? COLORS.or2 : COLORS.terre2,
                          },
                        ]}
                      >
                        {positive ? "+" : "−"}
                        {Math.abs(tx.amount).toLocaleString("fr-FR")} K
                      </Text>
                    </View>
                  );
                })
              )}
            </View>
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </SafeAreaView>

      <BuyKoraSheet
        visible={buySheetVisible}
        onClose={() => setBuySheetVisible(false)}
      />
    </View>
  );
}

function formatType(type: string) {
  switch (type) {
    case "win":
      return "Victoire";
    case "loss":
      return "Défaite";
    case "shop_purchase":
      return "Achat";
    case "recharge":
      return "Recharge";
    default:
      return type;
  }
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `il y a ${Math.max(1, diffMins)} min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays < 7) return `il y a ${diffDays}j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  body: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 14,
    color: COLORS.cream,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.hairline,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 17,
    color: COLORS.cream,
    letterSpacing: -0.2,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 24 },
  heroBg: {
    position: "absolute",
    top: -40,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: "rgba(166, 130, 88, 0.12)",
    borderRadius: 280,
    transform: [{ scaleX: 1.6 }],
  },
  hero: {
    alignItems: "center",
    gap: 14,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 6,
  },
  balanceText: {
    fontFamily: FONT_WEIGHTS.display.extrabold,
    fontSize: 56,
    color: COLORS.cream,
    letterSpacing: -2.4,
    lineHeight: 56,
  },
  balanceSub: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 13,
    color: "rgba(245, 242, 237, 0.55)",
  },
  actionsRow: {
    marginTop: 24,
  },
  section: { marginTop: 32 },
  transactionList: { marginTop: 12 },
  empty: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 13,
    color: "rgba(245, 242, 237, 0.5)",
    textAlign: "center",
    paddingVertical: 16,
  },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(201, 168, 118, 0.1)",
    gap: 10,
  },
  txTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  txTitle: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    fontSize: 13,
    color: COLORS.cream,
    flexShrink: 1,
  },
  koraChip: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: "#C9A876",
  },
  koraChipText: {
    fontFamily: FONT_WEIGHTS.mono.bold,
    fontSize: 9,
    color: "#1F1810",
  },
  txDate: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 10,
    color: "rgba(245, 242, 237, 0.45)",
    marginTop: 2,
  },
  txAmount: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 14,
    letterSpacing: -0.2,
  },
  errorWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 16,
  },
  errorTitle: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 24,
    color: COLORS.cream,
    textAlign: "center",
  },
  errorMessage: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 14,
    color: "rgba(245, 242, 237, 0.7)",
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 20,
  },
  errorActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
});
