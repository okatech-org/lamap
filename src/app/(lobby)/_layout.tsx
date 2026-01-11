import { TopBar } from "@/components/ui/top-bar";
import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "select-mode",
};

export default function LobbyLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: () => <TopBar />,
      }}
    >
      <Stack.Screen name="select-mode" />
      <Stack.Screen name="select-difficulty" />
      <Stack.Screen name="matchmaking" />
      <Stack.Screen
        name="room/[roomId]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="create-friendly" />
      <Stack.Screen name="join-friendly" />
    </Stack>
  );
}
