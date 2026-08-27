import { fontAssets, ThemeProvider as LamapThemeProvider } from "@/design";
import { authStorage } from "@/lib/auth-storage";
import { IapProvider } from "@/providers/iap-provider";
import { ConvexAuthProvider, useConvexAuth } from "@convex-dev/auth/react";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { ConvexReactClient } from "convex/react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL ?? "";
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export const unstable_settings = { initialRouteName: "index" };

function RootNavigator() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [fontsLoaded] = useFonts(fontAssets);
  if (isLoading || !fontsLoaded) return null;

  return (
    <IapProvider enabled={isAuthenticated}>
      <ThemeProvider value={DarkTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name="welcome" />
          </Stack.Protected>
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(lobby)" />
            <Stack.Screen name="(game)" />
            <Stack.Screen
              name="settings/blocked-users"
              options={{
                headerShown: true,
                title: "Utilisateurs bloqués",
                headerStyle: { backgroundColor: "#16070B" },
                headerTintColor: "#F1E8D6",
              }}
            />
          </Stack.Protected>
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </IapProvider>
  );
}

function ConfigurationError() {
  return (
    <View style={styles.error}>
      <Text style={styles.errorTitle}>Configuration manquante</Text>
      <Text style={styles.errorText}>
        EXPO_PUBLIC_CONVEX_URL doit être définie pour démarrer Lamap.
      </Text>
    </View>
  );
}

export default function RootLayout() {
  if (!convex) return <ConfigurationError />;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ConvexAuthProvider
          client={convex}
          storage={authStorage}
          storageNamespace="lamap-ios"
          shouldHandleCode={false}
        >
          <LamapThemeProvider>
            <RootNavigator />
          </LamapThemeProvider>
        </ConvexAuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  error: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#16070B",
  },
  errorTitle: { color: "#F1E8D6", fontSize: 22, fontWeight: "700" },
  errorText: { color: "#E3C77E", marginTop: 12, textAlign: "center" },
});
