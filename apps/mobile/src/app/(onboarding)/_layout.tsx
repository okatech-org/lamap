import { useAuth } from "@/hooks/use-auth";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function OnboardingLayout() {
  const { isLoaded, isSignedIn, isConvexUserLoaded, needsOnboarding } =
    useAuth();
  if (!isLoaded || (isSignedIn && !isConvexUserLoaded)) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#16070B",
        }}
      >
        <ActivityIndicator color="#E3C77E" />
      </View>
    );
  }
  if (isSignedIn && needsOnboarding === false)
    return <Redirect href="/(tabs)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
