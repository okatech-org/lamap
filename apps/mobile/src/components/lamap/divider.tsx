import { COLORS } from "@/design";
import React from "react";
import { StyleSheet, View } from "react-native";

export function Divider() {
  return (
    <View style={styles.wrap}>
      <View style={styles.line} />
      <View style={styles.diamond} />
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(201,168,118,0.25)",
  },
  diamond: {
    width: 6,
    height: 6,
    backgroundColor: COLORS.or,
    transform: [{ rotate: "45deg" }],
  },
});
