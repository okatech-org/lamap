import { useAuth } from "@/hooks/use-auth";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export const unstable_settings = {
  initialRouteName: "username",
};

export default function OnboardingLayout() {
  const { isSignedIn, isLoaded, isConvexUserLoaded, convexUser } = useAuth();

  if (!isLoaded || (isSignedIn && !isConvexUserLoaded)) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#141923",
        }}
      >
        <ActivityIndicator size="large" color="#A68258" />
      </View>
    );
  }

  const onboarded = convexUser?.metadata?.onboardingCompleted;
  if (isSignedIn && convexUser && onboarded === true) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="username" />
      <Stack.Screen name="tutorial" />
    </Stack>
  );
}
