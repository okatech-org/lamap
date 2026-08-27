import { UsernameInput } from "@/components/onboarding/username-input";
import { Button } from "@/components/ui/button";
import { useColors } from "@/hooks/use-colors";
import { api } from "@lamap/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UsernameScreen() {
  const colors = useColors();
  const router = useRouter();
  const finalize = useMutation(api.onboarding.finalizeUsername);
  const [username, setUsername] = useState("");
  const [valid, setValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!valid) return;
    setSubmitting(true);
    try {
      await finalize({ username });
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Pseudo indisponible",
        error instanceof Error ? error.message : "Choisissez un autre pseudo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>
            BIENVENUE
          </Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Choisissez votre pseudo.
          </Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            Il sera visible dans les parties et le classement mondial.
          </Text>
          <View style={styles.input}>
            <UsernameInput
              value={username}
              onChangeText={setUsername}
              onValidationChange={setValid}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <Button
            title="Commencer"
            variant="primary"
            onPress={submit}
            disabled={!valid || submitting}
            loading={submitting}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, justifyContent: "center", padding: 24 },
  eyebrow: { fontSize: 12, fontWeight: "800", letterSpacing: 2 },
  title: { fontSize: 38, lineHeight: 42, fontWeight: "900", marginTop: 12 },
  body: { fontSize: 16, lineHeight: 23, marginTop: 12 },
  input: { marginTop: 32 },
  footer: { padding: 24 },
});
