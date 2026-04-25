import { CardBack } from "@/components/game/card-back";
import {
  DeepBg,
  LamapBalanceChip,
  LamapButton,
  LamapTabPillRow,
} from "@/components/lamap";
import { COLORS, FONT_WEIGHTS, RADII } from "@/design";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import { useHeaderHeight } from "@react-navigation/elements";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const TABS = [
  { id: "card_backs" as const, label: "Dos de cartes" },
  { id: "avatars" as const, label: "Avatars", disabled: true },
  { id: "effects" as const, label: "Effets", disabled: true },
];

export default function ShopScreen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { userId, convexUser } = useAuth();
  const [tab, setTab] = useState<"card_backs" | "avatars" | "effects">(
    "card_backs",
  );
  const [pendingId, setPendingId] = useState<string | null>(null);

  const user = useQuery(
    api.users.getCurrentUser,
    userId ? { clerkUserId: userId } : "skip",
  );

  const cardBacks = useQuery(
    api.cosmetics.listCardBacks,
    convexUser?._id ? { userId: convexUser._id } : "skip",
  );
  const ensureDefaults = useMutation(api.cosmetics.ensureDefaults);
  const purchase = useMutation(api.cosmetics.purchaseCardBack);
  const setActive = useMutation(api.cosmetics.setActiveCardBack);

  // Lazy-grant defaults on first visit so the shop opens with at least one owned skin.
  React.useEffect(() => {
    if (
      convexUser?._id &&
      user &&
      user.cosmeticsGrantedDefaults !== true
    ) {
      ensureDefaults({ userId: convexUser._id }).catch(() => {});
    }
  }, [convexUser?._id, user, ensureDefaults]);

  if (!user || !cardBacks) {
    return (
      <View style={styles.root}>
        <DeepBg />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.or2} />
        </View>
      </View>
    );
  }

  const handleAction = async (
    skin: (typeof cardBacks)[number],
  ) => {
    if (!convexUser?._id) return;
    if (skin.active) return;
    setPendingId(skin.id);
    try {
      if (skin.owned) {
        await setActive({ userId: convexUser._id, cardBackId: skin.id });
      } else {
        await purchase({ userId: convexUser._id, cardBackId: skin.id });
      }
    } catch (e) {
      Alert.alert(
        "Erreur",
        e instanceof Error ? e.message : "Action impossible",
      );
    } finally {
      setPendingId(null);
    }
  };

  return (
    <View style={styles.root}>
      <DeepBg />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: headerHeight + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Boutique</Text>
          <Pressable onPress={() => router.push("/wallet" as any)}>
            <LamapBalanceChip amount={user.balance ?? 0} />
          </Pressable>
        </View>

        <View style={styles.tabRow}>
          <LamapTabPillRow
            options={TABS}
            selected={tab}
            onSelect={setTab}
          />
        </View>

        {tab !== "card_backs" ? (
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={28} color={COLORS.or2} />
            <Text style={styles.emptyText}>Bientôt disponible.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {cardBacks.map((skin) => {
              const isPending = pendingId === skin.id;
              const ctaLabel = skin.active
                ? "Équipé"
                : skin.owned
                  ? "Équiper"
                  : `${skin.price.toLocaleString("fr-FR")} K`;
              const ctaVariant: "primary" | "ghost" =
                skin.active || skin.owned ? "ghost" : "primary";
              const canAfford = (user.balance ?? 0) >= skin.price;
              const disabled =
                skin.active ||
                isPending ||
                (!skin.owned && !canAfford);
              return (
                <View key={skin.id} style={styles.tile}>
                  {skin.rare ? (
                    <View style={styles.rareChip}>
                      <Text style={styles.rareText}>RARE</Text>
                    </View>
                  ) : null}
                  <View style={styles.preview}>
                    <CardBack size="medium" theme={skin.theme} />
                  </View>
                  <Text style={styles.tileName} numberOfLines={1}>
                    {skin.name}
                  </Text>
                  <LamapButton
                    title={isPending ? "…" : ctaLabel}
                    variant={ctaVariant}
                    disabled={disabled}
                    onPress={() => handleAction(skin)}
                    style={styles.ctaBtn}
                  />
                  {!skin.owned && !canAfford ? (
                    <Text style={styles.afford}>
                      Solde insuffisant
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 24,
    color: COLORS.cream,
    letterSpacing: -0.4,
  },
  tabRow: { marginBottom: 18 },
  empty: { alignItems: "center", gap: 10, paddingVertical: 80 },
  emptyText: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 14,
    color: "rgba(245, 242, 237, 0.55)",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tile: {
    flexBasis: "48%",
    flexGrow: 1,
    padding: 14,
    borderRadius: RADII.lg,
    backgroundColor: "rgba(46, 61, 77, 0.5)",
    borderWidth: 1,
    borderColor: COLORS.hairline,
    position: "relative",
    alignItems: "center",
  },
  rareChip: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "rgba(157, 91, 210, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(157, 91, 210, 0.5)",
  },
  rareText: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 9,
    letterSpacing: 1,
    color: "#C898E5",
  },
  preview: {
    paddingVertical: 12,
  },
  tileName: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 13,
    color: COLORS.cream,
    marginTop: 4,
    textAlign: "center",
  },
  ctaBtn: {
    marginTop: 10,
    minHeight: 40,
    alignSelf: "stretch",
  },
  afford: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 11,
    color: COLORS.terre2,
    marginTop: 4,
  },
});
