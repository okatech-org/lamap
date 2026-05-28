import { LamapButton, LamapKoraCoin } from "@/components/lamap";
import { COLORS, FONT_WEIGHTS, RADII } from "@/design";
import { KORA_PACKS, type KoraPack } from "@/config/kora-packs";
import { useIap } from "@/hooks/use-iap";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface BuyKoraSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function BuyKoraSheet({ visible, onClose }: BuyKoraSheetProps) {
  const { buy, restore, purchasing } = useIap();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Acheter du Kora</Text>
          <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={COLORS.or2} />
          </Pressable>
        </View>

        <Text style={styles.sub}>
          Le Kora s&apos;utilise pour les cosmétiques. Pas remboursable, pas
          échangeable contre de l&apos;argent réel.
        </Text>

        <ScrollView contentContainerStyle={styles.list}>
          {KORA_PACKS.map((pack) => (
            <PackRow
              key={pack.id}
              pack={pack}
              loading={purchasing === pack.id}
              disabled={purchasing !== null && purchasing !== pack.id}
              onPress={() => buy(pack.id)}
            />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <LamapButton
            title="Restaurer mes achats"
            variant="ghost"
            onPress={restore}
          />
        </View>
      </View>
    </Modal>
  );
}

function PackRow({
  pack,
  loading,
  disabled,
  onPress,
}: {
  pack: KoraPack;
  loading: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.row,
        pressed && !disabled ? styles.rowPressed : null,
        disabled ? styles.rowDisabled : null,
      ]}
    >
      <View style={styles.rowLeft}>
        <LamapKoraCoin size="md" />
        <View>
          <Text style={styles.amount}>
            {pack.amount.toLocaleString("fr-FR")} Kora
          </Text>
          {pack.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {pack.badge === "popular" ? "POPULAIRE" : "MEILLEUR PRIX"}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      <Text style={styles.price}>
        {loading ? "…" : pack.priceLabel}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(15, 22, 32, 0.7)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "85%",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    borderTopLeftRadius: RADII.xl,
    borderTopRightRadius: RADII.xl,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderColor: COLORS.hairlineStrong,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 22,
    color: COLORS.cream,
    letterSpacing: -0.4,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sub: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 12,
    color: "rgba(245, 242, 237, 0.55)",
    lineHeight: 17,
  },
  list: {
    paddingTop: 6,
    paddingBottom: 6,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: RADII.md,
    backgroundColor: COLORS.bg2,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    gap: 12,
  },
  rowPressed: {
    backgroundColor: "rgba(201, 168, 118, 0.12)",
  },
  rowDisabled: {
    opacity: 0.5,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  amount: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 16,
    color: COLORS.cream,
    letterSpacing: -0.2,
  },
  badge: {
    alignSelf: "flex-start",
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "#C9A876",
  },
  badgeText: {
    fontFamily: FONT_WEIGHTS.mono.bold,
    fontSize: 9,
    color: "#1F1810",
    letterSpacing: 0.6,
  },
  price: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 16,
    color: COLORS.or2,
    letterSpacing: -0.2,
  },
  footer: {
    paddingTop: 4,
  },
});
