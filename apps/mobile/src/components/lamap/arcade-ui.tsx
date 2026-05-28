import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

/** Compact top app bar — back chevron + centered title + optional right slot. */
export function AppBar({
  title,
  onBack,
  right,
}: {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  const theme = useTheme();
  const router = useRouter();
  const back = onBack ?? (() => router.back());
  return (
    <View style={abStyles.bar}>
      <Pressable
        onPress={back}
        style={[abStyles.backBtn, { backgroundColor: theme.surfA(0.7), borderColor: theme.goldA(0.18) }]}
        accessibilityRole="button"
        accessibilityLabel="Retour"
      >
        <Ionicons name="chevron-back" size={18} color={theme.cream} />
      </Pressable>
      <Text style={[abStyles.title, { color: theme.cream }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={abStyles.right}>{right}</View>
    </View>
  );
}

const abStyles = StyleSheet.create({
  bar: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 15 },
  right: { width: 36, alignItems: "flex-end" },
});

/** Big editorial page title — eyebrow + display title + optional action. */
export function PageTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={ptStyles.wrap}>
      <View style={{ flex: 1 }}>
        {eyebrow ? (
          <Text style={[ptStyles.eyebrow, { color: theme.gold }]}>{eyebrow}</Text>
        ) : null}
        <Text style={[ptStyles.title, { color: theme.cream }]}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

const ptStyles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  eyebrow: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 10,
    letterSpacing: 2.6,
    marginBottom: 8,
  },
  title: {
    fontFamily: FONT_WEIGHTS.display.extrabold,
    fontSize: 30,
    lineHeight: 32,
    letterSpacing: -0.7,
  },
});

/** Section header inside scrollable content. */
export function SectionHeader({
  title,
  more,
  onMore,
}: {
  title: string;
  more?: string;
  onMore?: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={shStyles.row}>
      <Text style={[shStyles.title, { color: theme.cream }]}>{title}</Text>
      {more ? (
        <Pressable onPress={onMore}>
          <Text style={[shStyles.more, { color: theme.goldBright }]}>{more}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const shStyles = StyleSheet.create({
  row: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  title: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 17, letterSpacing: -0.2 },
  more: { fontFamily: FONT_WEIGHTS.body.medium, fontSize: 13 },
});

export type ChipTone = "gold" | "accent" | "ember" | "neutral";

/** Mono uppercase pill. */
export function Chip({
  children,
  tone = "gold",
  style,
}: {
  children: React.ReactNode;
  tone?: ChipTone;
  style?: ViewStyle;
}) {
  const theme = useTheme();
  const map = {
    gold: { bg: theme.goldA(0.1), border: theme.goldA(0.28), color: theme.gold },
    accent: { bg: theme.accentA(0.14), border: theme.accentA(0.4), color: theme.accentText },
    ember: { bg: theme.emberA(0.12), border: theme.emberA(0.4), color: theme.chipEmberColor },
    neutral: { bg: theme.surfA(0.6), border: theme.goldA(0.12), color: theme.creamA(0.65) },
  }[tone];
  return (
    <View
      style={[
        chipStyles.chip,
        { backgroundColor: map.bg, borderColor: map.border },
        style,
      ]}
    >
      <Text style={[chipStyles.text, { color: map.color }]}>{children}</Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 26,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontFamily: FONT_WEIGHTS.mono.semibold,
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
});

/** Themed surface container (card). */
export function Surface({
  children,
  style,
  elevated,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  elevated?: boolean;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: elevated ? theme.surfaceElev : theme.surface,
          borderColor: theme.goldA(0.1),
          borderWidth: 1,
          borderRadius: 18,
        },
        style as ViewStyle,
      ]}
    >
      {children}
    </View>
  );
}

/** Round icon container. */
export function RoundIcon({
  name,
  tone = "accent",
  size = 36,
}: {
  name: keyof typeof Ionicons.glyphMap;
  tone?: ChipTone;
  size?: number;
}) {
  const theme = useTheme();
  const map = {
    gold: { bg: theme.goldA(0.18), color: theme.goldBright },
    accent: { bg: theme.accentA(0.18), color: theme.accentText },
    ember: { bg: theme.emberA(0.18), color: theme.chipEmberColor },
    neutral: { bg: theme.surfA(0.6), color: theme.creamA(0.6) },
  }[tone];
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: map.bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name={name} size={size * 0.46} color={map.color} />
    </View>
  );
}

/** List row — leading icon, title, subtitle, trailing slot. */
export function Row({
  icon,
  title,
  subtitle,
  right,
  onPress,
  last,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  last?: boolean;
}) {
  const theme = useTheme();
  const Container: any = onPress ? Pressable : View;
  return (
    <Container
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
        borderBottomColor: theme.goldA(0.1),
      }}
    >
      {icon}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{ fontFamily: FONT_WEIGHTS.body.semibold, fontSize: 14, color: theme.cream }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              fontFamily: FONT_WEIGHTS.body.regular,
              fontSize: 12,
              color: theme.creamA(0.55),
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </Container>
  );
}

/** Helper to build a screen's themed StyleSheet root quickly. */
export function screenRoot(theme: Theme): ViewStyle {
  return { flex: 1, backgroundColor: theme.abyss };
}
