import { Tabs } from "expo-router";

import { HomeTopBar, LamapTabBar } from "@/components/lamap";
import { TopBar } from "@/components/ui/top-bar";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: true }}
      tabBar={(props) => <LamapTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Accueil", headerShown: false }}
      />
      <Tabs.Screen
        name="social"
        options={{ title: "Social", headerShown: false }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Boutique",
          header: () => <HomeTopBar />,
          headerTransparent: true,
          headerStyle: { backgroundColor: "transparent" },
          headerShadowVisible: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profil", headerShown: false }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{ title: "Classement", headerShown: false }}
      />
      <Tabs.Screen
        name="wallet"
        options={{ href: null, header: () => <TopBar title="Wallet" /> }}
      />
      <Tabs.Screen
        name="messages"
        options={{ href: null, header: () => <TopBar title="Messages" /> }}
      />
    </Tabs>
  );
}
