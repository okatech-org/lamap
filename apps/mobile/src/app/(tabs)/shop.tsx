import { CardBack } from "@/components/game/card-back";
import { AppBackdrop, LamapButton, PageTitle } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Tab = "card_backs" | "avatars" | "effects";
const TABS: { id: Tab; label: string }[] = [
  { id: "card_backs", label: "Dos de cartes" },
  { id: "avatars", label: "Avatars" },
  { id: "effects", label: "Effets" },
];

export default function ShopScreen() {
  const router = useRouter();
  const theme = useTheme();
  const s = makeStyles(theme);
  const { userId, convexUser } = useAuth();
  const [tab, setTab] = useState<Tab>("card_backs");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const user = useQuery(api.users.getCurrentUser, userId ? { clerkUserId: userId } : "skip");
  const cardBacks = useQuery(
    api.cosmetics.listCardBacks,
    convexUser?._id ? { userId: convexUser._id } : "skip",
  );
  const ensureDefaults = useMutation(api.cosmetics.ensureDefaults);
  const purchase = useMutation(api.cosmetics.purchaseCardBack);
  const setActive = useMutation(api.cosmetics.setActiveCardBack);

  React.useEffect(() => {
    if (convexUser?._id && user && user.cosmeticsGrantedDefaults !== true) {
      ensureDefaults({ userId: convexUser._id }).catch(() => {});
    }
  }, [convexUser?._id, user, ensureDefaults]);

  if (!user || !cardBacks) {
    return (
      <View style={s.root}>
        <AppBackdrop />
        <SafeAreaView style={s.center}>
          <ActivityIndicator size="large" color={theme.gold} />
        </SafeAreaView>
      </View>
    );
  }

  const handleAction = async (skin: (typeof cardBacks)[number]) => {
    if (!convexUser?._id || skin.active) return;
    setPendingId(skin.id);
    try {
      if (skin.owned) await setActive({ userId: convexUser._id, cardBackId: skin.id });
      else await purchase({ userId: convexUser._id, cardBackId: skin.id });
    } catch (e) {
      Alert.alert("Erreur", e instanceof Error ? e.message : "Action impossible");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <View style={s.root}>
      <AppBackdrop dust={10} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          <View style={s.header}>
            <Text style={s.headerTitle}>Boutique</Text>
            <Pressable style={s.balanceChip} onPress={() => router.push("/(tabs)/wallet")}>
              <Text style={s.balanceDiamond}>◆</Text>
              <Text style={s.balanceText}>{(user.balance ?? 0).toLocaleString("fr-FR")}</Text>
              <Ionicons name="add" size={14} color={theme.goldBright} />
            </Pressable>
          </View>

          <PageTitle eyebrow="MAISON BANDI" title="Vedette." />

          <View style={s.tabs}>
            {TABS.map((t) => {
              const active = t.id === tab;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setTab(t.id)}
                  style={[
                    s.tab,
                    {
                      backgroundColor: active ? theme.goldA(0.18) : theme.surfA(0.55),
                      borderColor: active ? theme.goldA(0.5) : theme.goldA(0.12),
                    },
                  ]}
                >
                  <Text style={[s.tabText, { color: active ? theme.goldBright : theme.creamA(0.55) }]}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {tab !== "card_backs" ? (
            <View style={s.empty}>
              <Ionicons name="time-outline" size={28} color={theme.gold} />
              <Text style={s.emptyText}>Bientôt disponible.</Text>
            </View>
          ) : (
            <View style={s.grid}>
              {cardBacks.map((skin) => {
                const isPending = pendingId === skin.id;
                const canAfford = (user.balance ?? 0) >= skin.price;
                const ctaLabel = skin.active
                  ? "✓ Équipé"
                  : skin.owned
                    ? "Équiper"
                    : `◆ ${skin.price.toLocaleString("fr-FR")}`;
                const disabled = skin.active || isPending || (!skin.owned && !canAfford);
                return (
                  <View key={skin.id} style={s.tile}>
                    {skin.rare ? (
                      <View style={[s.rareChip, { backgroundColor: theme.accentA(0.25), borderColor: theme.accentA(0.5) }]}>
                        <Text style={[s.rareText, { color: theme.accentText }]}>RARE</Text>
                      </View>
                    ) : null}
                    <View style={s.preview}>
                      <CardBack size="medium" theme={skin.theme} />
                    </View>
                    <Text style={s.tileName} numberOfLines={1}>{skin.name}</Text>
                    <LamapButton
                      title={isPending ? "…" : ctaLabel}
                      variant={skin.active || skin.owned ? "dark" : "gold"}
                      disabled={disabled}
                      onPress={() => handleAction(skin)}
                      style={s.cta}
                    />
                    {!skin.owned && !canAfford ? (
                      <Text style={[s.afford, { color: theme.chipEmberColor }]}>Solde insuffisant</Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 4 },
    headerTitle: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 17, color: theme.cream },
    balanceChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      height: 30,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: theme.goldA(0.1),
      borderWidth: 1,
      borderColor: theme.goldA(0.28),
    },
    balanceDiamond: { fontSize: 12, color: theme.goldBright },
    balanceText: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 13, color: theme.goldBright },
    tabs: { flexDirection: "row", gap: 8, paddingHorizontal: 20, paddingBottom: 18 },
    tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
    tabText: { fontFamily: FONT_WEIGHTS.display.semibold, fontSize: 12 },
    empty: { alignItems: "center", gap: 10, paddingVertical: 80 },
    emptyText: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 14, color: theme.creamA(0.55) },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingHorizontal: 20 },
    tile: {
      flexBasis: "47%",
      flexGrow: 1,
      padding: 14,
      borderRadius: 16,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.goldA(0.12),
      alignItems: "center",
    },
    rareChip: { position: "absolute", top: 10, right: 10, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999, borderWidth: 1, zIndex: 1 },
    rareText: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 8, letterSpacing: 1 },
    preview: { paddingVertical: 12 },
    tileName: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 13, color: theme.cream, marginTop: 4, textAlign: "center" },
    cta: { marginTop: 10, minHeight: 40, alignSelf: "stretch" },
    afford: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 11, marginTop: 4 },
  });
}
