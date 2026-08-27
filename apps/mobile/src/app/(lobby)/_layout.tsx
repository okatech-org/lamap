import { Stack } from "expo-router";

export default function LobbyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ranked-matchmaking" />
      <Stack.Screen name="select-difficulty" />
    </Stack>
  );
}
