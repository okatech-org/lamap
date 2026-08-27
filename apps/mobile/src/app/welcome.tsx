import { LamapButton, LamapChip } from "@/components/lamap";
import { AuthBackground } from "@/components/ui/auth-background";
import { WelcomeCards } from "@/components/ui/welcome-cards";
import { PRIVACY_URL, TERMS_URL } from "@/config/legal";
import { COLORS, FONT_WEIGHTS } from "@/design";
import { useAuthActions } from "@convex-dev/auth/react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();
const OAUTH_RETURN_URL = "lamap://auth";

export default function WelcomeScreen() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState<"apple" | "google" | null>(null);

  const handleOAuth = async (provider: "apple" | "google") => {
    setLoading(provider);
    try {
      const start = await signIn(provider, { redirectTo: OAUTH_RETURN_URL });
      if (!start.redirect)
        throw new Error("Le service de connexion n’a pas répondu.");
      const browserResult = await WebBrowser.openAuthSessionAsync(
        start.redirect.toString(),
        OAUTH_RETURN_URL,
      );
      if (browserResult.type === "cancel" || browserResult.type === "dismiss")
        return;
      if (browserResult.type !== "success")
        throw new Error("Connexion interrompue.");
      const code = new URL(browserResult.url).searchParams.get("code");
      if (!code) throw new Error("Code de connexion manquant.");
      // Convex Auth expects no provider while exchanging the one-time OAuth
      // code. Its public React Native type still marks the provider as required.
      await signIn(undefined as never, { code });
      router.replace("/");
    } catch (error) {
      Alert.alert(
        "Connexion impossible",
        error instanceof Error
          ? error.message
          : "Réessayez dans quelques instants.",
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <AuthBackground />
      <WelcomeCards />
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.title}>Lamap</Text>
          <Text style={styles.tagline}>Le duel de cartes, simplement.</Text>
          <LamapChip>GARAME · DUEL · CLASSEMENT</LamapChip>
        </View>
        <View style={styles.bottom}>
          <LamapButton
            title="Continuer avec Apple"
            variant="primary"
            onPress={() => handleOAuth("apple")}
            loading={loading === "apple"}
            disabled={loading !== null}
            icon={<Ionicons name="logo-apple" size={20} color={COLORS.cream} />}
          />
          <LamapButton
            title="Continuer avec Google"
            variant="light"
            onPress={() => handleOAuth("google")}
            loading={loading === "google"}
            disabled={loading !== null}
            icon={<Ionicons name="logo-google" size={20} color={COLORS.ink} />}
          />
          <Text style={styles.legal}>
            En continuant, vous acceptez nos{" "}
            <Text
              style={styles.link}
              onPress={() => WebBrowser.openBrowserAsync(TERMS_URL)}
            >
              CGU
            </Text>{" "}
            et notre{" "}
            <Text
              style={styles.link}
              onPress={() => WebBrowser.openBrowserAsync(PRIVACY_URL)}
            >
              politique de confidentialité
            </Text>
            .
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 170,
    zIndex: 2,
  },
  hero: { alignItems: "center", gap: 16 },
  title: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 72,
    lineHeight: 76,
    color: COLORS.or2,
  },
  tagline: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 17,
    color: COLORS.cream,
  },
  bottom: { gap: 12 },
  legal: {
    marginTop: 8,
    textAlign: "center",
    color: "rgba(241,232,214,0.58)",
    fontSize: 12,
    lineHeight: 18,
  },
  link: { color: COLORS.or2, textDecorationLine: "underline" },
});
