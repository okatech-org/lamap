import { FONT_WEIGHTS } from "@/design";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AvatarProps {
  initials?: string;
  size?: number;
  ring?: boolean;
}

export function Avatar({ initials = "LG", size = 36, ring = true }: AvatarProps) {
  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: ring ? 1.5 : 0,
        },
      ]}
    >
      <LinearGradient
        colors={["#C95048", "#8E2F2A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
      />
      <Text
        style={{
          fontFamily: FONT_WEIGHTS.display.bold,
          color: "#F5F2ED",
          fontSize: size * 0.36,
          letterSpacing: size * 0.36 * 0.04,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderColor: "rgba(201, 168, 118, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
