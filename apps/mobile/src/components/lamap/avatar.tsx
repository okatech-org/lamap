import { COLORS, FONT_WEIGHTS } from "@/design";
import { AVATAR_ASSETS, type PortraitAvatarId } from "@/config/avatar-assets";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AvatarProps {
  initials?: string;
  size?: number;
  ring?: boolean;
  avatarId?: string;
}

export function Avatar({
  initials = "LG",
  size = 36,
  ring = true,
  avatarId,
}: AvatarProps) {
  const portrait =
    avatarId && avatarId in AVATAR_ASSETS
      ? AVATAR_ASSETS[avatarId as PortraitAvatarId]
      : null;
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
        colors={[COLORS.terre2, COLORS.terreDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
      />
      {portrait ? (
        <Image
          source={portrait}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
      ) : (
        <Text
          style={{
            fontFamily: FONT_WEIGHTS.display.bold,
            color: COLORS.cream,
            fontSize: size * 0.36,
            letterSpacing: size * 0.36 * 0.04,
          }}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderColor: "rgba(201, 165, 95, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
