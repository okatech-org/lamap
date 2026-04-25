import { COLORS, FONT_WEIGHTS } from "@/design";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { HomeTopBar } from "@/components/lamap";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TopBar } from "@/components/ui/top-bar";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.terre2,
        tabBarInactiveTintColor: "rgba(245, 242, 237, 0.55)",
        headerShown: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.tabBgTint} />
          </View>
        ),
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Jouer",
          header: () => <HomeTopBar />,
          headerTransparent: true,
          headerStyle: { backgroundColor: "transparent" },
          headerShadowVisible: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gamecontroller.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Classement",
          header: () => <TopBar title="Classement" />,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chart.bar.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Boutique",
          header: () => <TopBar title="Boutique" />,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="bag.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          header: () => <TopBar title="Mon profil" />,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          href: null,
          header: () => <TopBar title="Messages" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
    backgroundColor: "transparent",
    elevation: 0,
  },
  tabLabel: {
    fontFamily: FONT_WEIGHTS.body.medium,
    fontSize: 10,
    letterSpacing: -0.1,
    marginTop: 2,
  },
  tabBgTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 22, 32, 0.7)",
  },
});
