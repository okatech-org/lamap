import { UsernameInput } from "@/components/onboarding/UsernameInput";
import { Button } from "@/components/ui/Button";
import { Spacing } from "@/constants/spacing";
import { Typography } from "@/constants/typography";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { useColors } from "@/hooks/useColors";
import { getAutoDetectedCountry } from "@/utils/localization";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated, {
    FadeInDown,
    FadeInUp,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UsernameScreen() {
  const colors = useColors();
  const router = useRouter();
  const { convexUser } = useAuth();
  const [username, setUsername] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const setUsernameMutation = useMutation(api.onboarding.setUsername);
  const setCountryMutation = useMutation(api.onboarding.setCountry);
  const completeOnboardingMutation = useMutation(api.onboarding.completeOnboarding);
  
  const handleContinue = async () => {
    if (!convexUser?._id || !isValid) return;
    
    try {
      setIsSubmitting(true);
      
      // Set username
      await setUsernameMutation({
        userId: convexUser._id,
        username: username.toLowerCase().trim(),
      });
      
      // Auto-detect and set country
      const detectedCountry = getAutoDetectedCountry();
      await setCountryMutation({
        userId: convexUser._id,
        countryCode: detectedCountry,
      });
      
      // Complete onboarding
      await completeOnboardingMutation({ userId: convexUser._id });
      
      // Go to tutorial or main app
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Erreur lors de l'onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: Spacing.container.horizontal,  // 24px
      justifyContent: "center",
    },
    header: {
      marginBottom: Spacing.xxl,  // 48px
    },
    step: {
      fontSize: Typography.caption.fontSize,  // 14px
      color: colors.mutedForeground,
      fontWeight: Typography.captionBold.fontWeight,  // 600
      marginBottom: Spacing.sm,  // 8px
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    title: {
      fontSize: Typography.display.fontSize,  // 48px - wow factor!
      fontWeight: Typography.display.fontWeight,  // 900
      color: colors.foreground,
      marginBottom: Spacing.md,  // 16px
      lineHeight: Typography.display.lineHeight,
    },
    subtitle: {
      fontSize: Typography.body.fontSize,  // 16px
      color: colors.mutedForeground,
      lineHeight: Typography.body.lineHeight,
    },
    inputSection: {
      marginBottom: Spacing.xl,  // 32px
    },
    footer: {
      padding: Spacing.container.horizontal,  // 24px
      paddingBottom: Spacing.xl,  // 32px
    },
  });
  
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <Animated.View
            entering={FadeInUp.duration(600).delay(100)}
            style={styles.header}
          >
            <Text style={styles.step}>Configuration</Text>
            <Text style={styles.title}>Choisissez votre nom</Text>
            <Text style={styles.subtitle}>
              Ce sera votre identité dans le jeu. Choisissez quelque chose de mémorable !
            </Text>
          </Animated.View>
          
          <Animated.View
            entering={FadeInDown.duration(600).delay(200)}
            style={styles.inputSection}
          >
            <UsernameInput
              value={username}
              onChangeText={setUsername}
              userId={convexUser?._id}
              onValidationChange={setIsValid}
            />
          </Animated.View>
        </View>
        
        <Animated.View
          entering={FadeInUp.duration(600).delay(300)}
          style={styles.footer}
        >
          <Button
            title="Continuer"
            onPress={handleContinue}
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            variant="primary"
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

