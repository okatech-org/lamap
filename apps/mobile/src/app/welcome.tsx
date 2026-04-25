import { LamapButton, LamapChip } from "@/components/lamap";
import { AuthBackground } from "@/components/ui/auth-background";
import { WelcomeCards } from "@/components/ui/welcome-cards";
import { COLORS, FONT_WEIGHTS } from "@/design";
import { useWarmUpBrowser } from "@/hooks/use-warm-up-browser";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  useWarmUpBrowser();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.92);
  const logoTranslateY = useSharedValue(-12);

  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(-8);

  const chipOpacity = useSharedValue(0);

  const button1Opacity = useSharedValue(0);
  const button1TranslateY = useSharedValue(16);

  const button2Opacity = useSharedValue(0);
  const button2TranslateY = useSharedValue(16);

  const footerOpacity = useSharedValue(0);

  useEffect(() => {
    const timing = (delay: number, dur = 500) => ({
      duration: dur,
      easing: Easing.out(Easing.ease),
    });

    logoOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    logoScale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    logoTranslateY.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });

    taglineOpacity.value = withDelay(180, withTiming(1, timing(180)));
    taglineTranslateY.value = withDelay(180, withTiming(0, timing(180)));

    chipOpacity.value = withDelay(320, withTiming(1, timing(320, 400)));

    button1Opacity.value = withDelay(440, withTiming(1, timing(440)));
    button1TranslateY.value = withDelay(440, withTiming(0, timing(440)));

    button2Opacity.value = withDelay(540, withTiming(1, timing(540)));
    button2TranslateY.value = withDelay(540, withTiming(0, timing(540)));

    footerOpacity.value = withDelay(
      720,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) }),
    );
  });

  const handleOAuth = async (strategy: "google" | "facebook") => {
    try {
      setLoading(strategy);
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: `oauth_${strategy}`,
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      const errorMessage = err.errors?.[0]?.message || "";
      if (errorMessage.includes("Session already exists")) {
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Erreur",
          errorMessage || "Une erreur est survenue lors de la connexion",
        );
      }
    } finally {
      setLoading(null);
    }
  };

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { translateY: logoTranslateY.value },
    ],
  }));
  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));
  const chipStyle = useAnimatedStyle(() => ({ opacity: chipOpacity.value }));
  const button1Style = useAnimatedStyle(() => ({
    opacity: button1Opacity.value,
    transform: [{ translateY: button1TranslateY.value }],
  }));
  const button2Style = useAnimatedStyle(() => ({
    opacity: button2Opacity.value,
    transform: [{ translateY: button2TranslateY.value }],
  }));
  const footerStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <AuthBackground />
      <WelcomeCards />

      <View style={styles.content}>
        <View style={styles.hero}>
          <Animated.View style={logoStyle}>
            <Text style={styles.title}>Lamap</Text>
          </Animated.View>

          <Animated.View style={taglineStyle}>
            <Text style={styles.tagline}>
              Le duel de cartes <Text style={styles.taglineAccent}>épique</Text>{" "}
              vous attend
            </Text>
          </Animated.View>

          <Animated.View style={[styles.chipRow, chipStyle]}>
            <LamapChip>GARAME · DUEL · KORA</LamapChip>
          </Animated.View>
        </View>

        <View style={styles.bottomGroup}>
          <View style={styles.buttons}>
            <Animated.View style={button1Style}>
              <LamapButton
                title="Continuer avec Google"
                variant="light"
                onPress={() => handleOAuth("google")}
                loading={loading === "google"}
                disabled={!!loading}
                icon={
                  <Ionicons name="logo-google" size={20} color={COLORS.ink} />
                }
              />
            </Animated.View>
            <Animated.View style={button2Style}>
              <LamapButton
                title="Continuer avec Facebook"
                variant="primary"
                onPress={() => handleOAuth("facebook")}
                loading={loading === "facebook"}
                disabled={!!loading}
                icon={
                  <Ionicons name="logo-facebook" size={20} color={COLORS.cream} />
                }
              />
            </Animated.View>
          </View>

          <Animated.View style={[styles.footer, footerStyle]}>
            <Text style={styles.footerText}>
              Devenez maître du Garame.{"\n"}
              Affrontez des joueurs, misez votre Kora.
            </Text>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    // Card fan peeks ~156px above the bottom edge — keep the footer clear of it.
    paddingBottom: 180,
    zIndex: 2,
  },
  hero: {
    alignItems: "center",
    gap: 14,
  },
  title: {
    fontFamily: FONT_WEIGHTS.display.bold,
    fontSize: 76,
    color: COLORS.terre2,
    textAlign: "center",
    letterSpacing: -3,
    lineHeight: 76,
  },
  tagline: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 17,
    color: "rgba(245, 242, 237, 0.85)",
    textAlign: "center",
    marginTop: 4,
  },
  taglineAccent: {
    fontFamily: FONT_WEIGHTS.body.semibold,
    color: COLORS.terre2,
    fontStyle: "italic",
  },
  chipRow: {
    alignItems: "center",
    marginTop: 6,
  },
  bottomGroup: {
    gap: 18,
  },
  buttons: {
    gap: 12,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontFamily: FONT_WEIGHTS.body.regular,
    fontSize: 12,
    color: "rgba(245,242,237,0.45)",
    textAlign: "center",
    lineHeight: 19,
  },
});
