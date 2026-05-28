import { FONT_WEIGHTS, useTheme } from "@/design";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavItem = {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
};

// Two items each side of the central "Jouer" action.
const LEFT: NavItem[] = [
  { name: "index", label: "Accueil", icon: "home-outline", activeIcon: "home" },
  { name: "social", label: "Social", icon: "people-outline", activeIcon: "people" },
];
const RIGHT: NavItem[] = [
  { name: "shop", label: "Boutique", icon: "bag-outline", activeIcon: "bag" },
  { name: "profile", label: "Profil", icon: "person-outline", activeIcon: "person" },
];

/**
 * Custom bottom bar — ports the Arcade `MBottomNav`: dark blurred bar, gold
 * active tint, and a raised gold "Jouer" action button in the middle that
 * launches the play flow (not a tab).
 */
export function LamapTabBar({ state, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const activeName = state.routes[state.index]?.name;

  const go = (name: string) => {
    const route = state.routes.find((r) => r.name === name);
    if (!route) return;
    const isFocused = activeName === name;
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(name as never);
    }
  };

  const renderItem = (it: NavItem) => {
    const active = activeName === it.name;
    return (
      <Pressable key={it.name} style={styles.item} onPress={() => go(it.name)}>
        <Ionicons
          name={active ? it.activeIcon : it.icon}
          size={22}
          color={active ? theme.goldBright : theme.creamA(0.45)}
        />
        <Text
          style={[
            styles.label,
            { color: active ? theme.goldBright : theme.creamA(0.45) },
          ]}
        >
          {it.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom }]}>
      <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: theme.surfA(0.72),
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: theme.goldA(0.12),
          },
        ]}
      />
      <View style={styles.row}>
        {LEFT.map(renderItem)}
        <View style={styles.item} />
        {RIGHT.map(renderItem)}
      </View>

      {/* Central "Jouer" action */}
      <View
        style={[styles.centerWrap, { bottom: insets.bottom + 14 }]}
        pointerEvents="box-none"
      >
        <Pressable
          style={[styles.centerBtn, { borderColor: theme.goldA(0.5) }]}
          onPress={() => router.push("/(lobby)/select-mode")}
          accessibilityRole="button"
          accessibilityLabel="Jouer"
        >
          <LinearGradient
            colors={[theme.goldBright, theme.gold, theme.goldDeep]}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.7, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Ionicons name="play" size={22} color="#1F1810" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  label: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 8,
    letterSpacing: 0.6,
  },
  centerWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  centerBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
