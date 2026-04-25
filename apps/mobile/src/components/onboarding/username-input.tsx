import { Colors } from "@/constants/theme";
import { useColors } from "@/hooks/use-colors";
import { api } from "@lamap/convex/_generated/api";
import type { Id } from "@lamap/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface UsernameInputProps {
  value: string;
  onChangeText: (text: string) => void;
  userId?: Id<"users">;
  onValidationChange?: (isValid: boolean) => void;
}

export function UsernameInput({
  value,
  onChangeText,
  userId,
  onValidationChange,
}: UsernameInputProps) {
  const colors = useColors();
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [value]);
  
  const availability = useQuery(
    api.onboarding.checkUsernameAvailability,
    debouncedValue.length >= 3
      ? { username: debouncedValue, currentUserId: userId }
      : "skip"
  );
  
  useEffect(() => {
    if (availability && onValidationChange) {
      onValidationChange(availability.available);
    }
  }, [availability, onValidationChange]);
  
  const isChecking = debouncedValue !== value && value.length >= 3;
  
  return (
    <View style={styles.container}>
      <View style={[styles.inputWrapper, { backgroundColor: colors.input, borderColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.foreground }]}
          value={value}
          onChangeText={onChangeText}
          placeholder="nom_utilisateur"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={20}
        />
        {isChecking && (
          <ActivityIndicator size="small" color={colors.primary} />
        )}
      </View>
      
      {value.length > 0 && !isChecking && availability && (
        <Text
          style={[
            styles.message,
            {
              color: availability.available
                ? Colors.gameUI.orSable
                : colors.destructive,
            },
          ]}
        >
          {availability.message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 12,
    fontWeight: "500",
  },
  message: {
    marginTop: 8,
    fontSize: 14,
    paddingHorizontal: 4,
  },
});

