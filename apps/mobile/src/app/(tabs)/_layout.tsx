import { LamapTabBar } from "@/components/lamap";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <LamapTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Jouer" }} />
      <Tabs.Screen name="leaderboard" options={{ title: "Classement" }} />
      <Tabs.Screen name="shop" options={{ title: "Boutique" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}
