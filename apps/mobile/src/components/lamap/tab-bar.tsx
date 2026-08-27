import { FONT_WEIGHTS, useTheme } from "@/design";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ITEMS = [
  {
    name: "index",
    label: "Jouer",
    icon: "play-circle-outline",
    active: "play-circle",
  },
  {
    name: "leaderboard",
    label: "Classement",
    icon: "podium-outline",
    active: "podium",
  },
  { name: "shop", label: "Boutique", icon: "bag-outline", active: "bag" },
  {
    name: "profile",
    label: "Profil",
    icon: "person-outline",
    active: "person",
  },
] as const;

export function LamapTabBar({ state, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const current = state.routes[state.index]?.name;
  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom }]}>
      <BlurView intensity={95} tint="dark" style={StyleSheet.absoluteFill} />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: theme.surfA(0.78),
            borderTopColor: theme.goldA(0.14),
            borderTopWidth: 1,
          },
        ]}
      />
      <View style={styles.row}>
        {ITEMS.map((item) => {
          const focused = current === item.name;
          return (
            <Pressable
              key={item.name}
              style={styles.item}
              onPress={() => navigation.navigate(item.name as never)}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
            >
              <Ionicons
                name={(focused ? item.active : item.icon) as never}
                size={22}
                color={focused ? theme.goldBright : theme.creamA(0.48)}
              />
              <Text
                style={[
                  styles.label,
                  { color: focused ? theme.goldBright : theme.creamA(0.48) },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 0, right: 0, bottom: 0, paddingTop: 8 },
  row: { height: 58, flexDirection: "row" },
  item: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 },
  label: {
    fontFamily: FONT_WEIGHTS.mono.medium,
    fontSize: 8,
    letterSpacing: 0.5,
  },
});
