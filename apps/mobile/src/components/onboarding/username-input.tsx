import { useColors } from "@/hooks/use-colors";
import { api } from "@lamap/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export function UsernameInput({
  value,
  onChangeText,
  onValidationChange,
}: {
  value: string;
  onChangeText: (value: string) => void;
  onValidationChange: (valid: boolean) => void;
}) {
  const colors = useColors();
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), 350);
    return () => clearTimeout(timer);
  }, [value]);
  const availability = useQuery(
    api.onboarding.checkUsernameAvailability,
    debounced.trim().length >= 3 ? { username: debounced } : "skip",
  );
  const checking = debounced !== value;
  useEffect(() => {
    onValidationChange(Boolean(availability?.available) && !checking);
  }, [availability?.available, checking, onValidationChange]);

  return (
    <View>
      <View
        style={[
          styles.inputWrap,
          { backgroundColor: colors.input, borderColor: colors.border },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={20}
          placeholder="Votre pseudo"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { color: colors.foreground }]}
        />
        {checking ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : null}
      </View>
      {value.length > 0 && !checking ? (
        <Text
          style={[
            styles.message,
            { color: availability?.available ? "#E3C77E" : colors.destructive },
          ]}
        >
          {availability?.available
            ? "Ce pseudo est disponible."
            : "Utilisez 3 à 20 lettres, chiffres, espaces, tirets ou underscores."}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  input: { flex: 1, fontSize: 18, paddingVertical: 16 },
  message: { marginTop: 8, fontSize: 13 },
});
