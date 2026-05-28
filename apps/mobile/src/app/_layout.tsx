import { fontAssets } from "@/design";
import { useColors } from "@/hooks/use-colors";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import {
  ClerkProvider,
  useAuth,
  useAuth as useClerkAuth,
} from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL || "";
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

const convex = new ConvexReactClient(convexUrl);

export const unstable_settings = {
  initialRouteName: "welcome",
};

function RootLayoutNav() {
  const { isSignedIn, isLoaded } = useClerkAuth();
  const colors = useColors();
  const [fontsLoaded] = useFonts(fontAssets);
  usePushNotifications();

  if (!isLoaded || !fontsLoaded) {
    return null;
  }

  const modalHeaderOptions = {
    headerStyle: {
      backgroundColor: colors.background,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: colors.secondary,
    headerTitleStyle: {
      fontSize: 22,
      fontWeight: "700" as const,
      color: colors.secondary,
    },
    headerShadowVisible: false,
    contentStyle: {
      backgroundColor: colors.background,
    },
    ...(Platform.OS === "android" && {
      headerTitleAlign: "center" as const,
      headerBackTitleVisible: false,
    }),
  };

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(lobby)" options={{ headerShown: false }} />
          <Stack.Screen name="(game)" options={{ headerShown: false }} />
          <Stack.Screen name="(messages)" options={{ headerShown: false }} />
          <Stack.Screen
            name="settings"
            options={{
              title: "Paramètres",
              headerBackTitle: "Retour",
              headerShown: true,
              ...modalHeaderOptions,
            }}
          />
          <Stack.Screen
            name="notifications"
            options={{
              title: "Notifications",
              headerBackTitle: "Retour",
              presentation: "modal",
              ...modalHeaderOptions,
            }}
          />
          <Stack.Screen
            name="challenges/[challengeId]"
            options={{
              title: "Défis",
              headerBackTitle: "Retour",
              ...modalHeaderOptions,
            }}
          />
          <Stack.Screen name="user" options={{ headerShown: false }} />
          <Stack.Screen name="leaderboard/ranks" options={{ headerShown: false }} />
          <Stack.Screen name="card-poc" options={{ headerShown: false }} />
          <Stack.Screen name="card-poc-hand" options={{ headerShown: false }} />
          <Stack.Screen
            name="settings/blocked-users"
            options={{
              title: "Utilisateurs bloqués",
              headerBackTitle: "Retour",
              headerShown: true,
              ...modalHeaderOptions,
            }}
          />
        </Stack.Protected>
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

function ConfigurationError({ missing }: { missing: string[] }) {
  return (
    <View style={configErrorStyles.root}>
      <Text style={configErrorStyles.title}>Configuration manquante</Text>
      <Text style={configErrorStyles.body}>
        L&apos;application n&apos;a pas pu démarrer car les variables suivantes
        sont absentes&nbsp;:
      </Text>
      {missing.map((key) => (
        <Text key={key} style={configErrorStyles.item}>
          • {key}
        </Text>
      ))}
      <Text style={configErrorStyles.hint}>
        Contactez le support à{"\n"}support@lamap.okatech.fr
      </Text>
    </View>
  );
}

const configErrorStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0F1620",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F5F2ED",
    marginBottom: 12,
    textAlign: "center",
  },
  body: {
    fontSize: 14,
    color: "rgba(245, 242, 237, 0.75)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
  },
  item: {
    fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
    fontSize: 13,
    color: "#C9A876",
    marginVertical: 2,
  },
  hint: {
    marginTop: 24,
    fontSize: 13,
    color: "rgba(245, 242, 237, 0.5)",
    textAlign: "center",
    lineHeight: 18,
  },
});

export default function RootLayout() {
  const missing: string[] = [];
  if (!clerkPublishableKey) missing.push("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
  if (!convexUrl) missing.push("EXPO_PUBLIC_CONVEX_URL");

  if (missing.length > 0) {
    return (
      <SafeAreaProvider>
        <ConfigurationError missing={missing} />
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ClerkProvider
          publishableKey={clerkPublishableKey}
          tokenCache={tokenCache}
        >
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <RootLayoutNav />
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
