import { CardBack } from "@/components/game/card-back";
import {
  AppBackdrop,
  Avatar,
  LamapButton,
  PageTitle,
} from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { useIap } from "@/hooks/use-iap";
import { api } from "@lamap/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ShopTab = "card_back" | "avatar";
const CARD_THEMES = {
  bandi_classic: "red",
  bleu_royal: "blue",
  or_sable: "gold",
  ombre_tribale: "dark",
} as const;

export default function ShopScreen() {
  const theme = useTheme();
  const s = styles(theme);
  const [tab, setTab] = useState<ShopTab>("card_back");
  const catalog = useQuery(api.cosmetics.listCatalog, {});
  const equip = useMutation(api.cosmetics.equip);
  const { products, purchasing, buy } = useIap();
  const storeProducts = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );
  if (!catalog)
    return (
      <View style={s.loading}>
        <ActivityIndicator color={theme.gold} />
      </View>
    );
  const items = catalog.filter((item) => item.type === tab);

  const act = async (item: (typeof catalog)[number]) => {
    if (item.active) return;
    try {
      if (item.owned) await equip({ cosmeticId: item.id });
      else if (item.productId) await buy(item.productId);
    } catch (error) {
      Alert.alert(
        "Action impossible",
        error instanceof Error ? error.message : "Réessayez.",
      );
    }
  };

  return (
    <View style={s.root}>
      <AppBackdrop dust={8} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          <PageTitle eyebrow="COSMÉTIQUES" title="Personnalise ton jeu." />
          <View style={s.tabs}>
            <Tab
              label="Dos de cartes"
              active={tab === "card_back"}
              onPress={() => setTab("card_back")}
              theme={theme}
            />
            <Tab
              label="Avatars"
              active={tab === "avatar"}
              onPress={() => setTab("avatar")}
              theme={theme}
            />
          </View>
          <Text style={s.storeNote}>
            Les noms et tarifs payants sont fournis par l’App Store.
          </Text>
          <View style={s.grid}>
            {items.map((item) => {
              const product = item.productId
                ? storeProducts.get(item.productId)
                : null;
              const disabled =
                item.active ||
                purchasing === item.productId ||
                (!item.owned && !product);
              const title = item.active
                ? "Équipé"
                : item.owned
                  ? "Équiper"
                  : (product?.displayPrice ?? "Indisponible");
              return (
                <View key={item.id} style={s.tile}>
                  <View style={s.preview}>
                    {item.type === "card_back" ? (
                      <CardBack
                        size="medium"
                        theme={
                          CARD_THEMES[item.id as keyof typeof CARD_THEMES] ??
                          "red"
                        }
                      />
                    ) : (
                      <Avatar
                        initials={item.name.slice(0, 2).toUpperCase()}
                        avatarId={item.id}
                        size={82}
                      />
                    )}
                  </View>
                  <Text style={s.name} numberOfLines={2}>
                    {product?.displayName || product?.title || item.name}
                  </Text>
                  <LamapButton
                    title={purchasing === item.productId ? "Achat…" : title}
                    variant={item.owned ? "dark" : "gold"}
                    disabled={disabled}
                    onPress={() => act(item)}
                    style={s.button}
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Tab({
  label,
  active,
  onPress,
  theme,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: Theme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles(theme).tab,
        {
          backgroundColor: active ? theme.goldA(0.16) : theme.surfA(0.55),
          borderColor: active ? theme.goldA(0.5) : theme.goldA(0.12),
        },
      ]}
    >
      <Text
        style={[
          styles(theme).tabText,
          { color: active ? theme.goldBright : theme.creamA(0.55) },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function styles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    loading: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.abyss,
    },
    scroll: { paddingBottom: 120 },
    tabs: { flexDirection: "row", gap: 8, paddingHorizontal: 20 },
    tab: {
      paddingHorizontal: 15,
      paddingVertical: 9,
      borderRadius: 999,
      borderWidth: 1,
    },
    tabText: { fontFamily: FONT_WEIGHTS.display.semibold, fontSize: 12 },
    storeNote: {
      paddingHorizontal: 20,
      marginTop: 14,
      marginBottom: 18,
      color: theme.creamA(0.46),
      fontSize: 11,
    },
    grid: {
      paddingHorizontal: 20,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    tile: {
      flexBasis: "47%",
      flexGrow: 1,
      alignItems: "center",
      padding: 14,
      borderRadius: 17,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.goldA(0.12),
    },
    preview: { height: 105, alignItems: "center", justifyContent: "center" },
    name: {
      minHeight: 38,
      textAlign: "center",
      fontFamily: FONT_WEIGHTS.display.bold,
      fontSize: 13,
      lineHeight: 17,
      color: theme.cream,
    },
    button: { alignSelf: "stretch", marginTop: 10, minHeight: 40 },
  });
}
