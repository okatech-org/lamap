import { AppBackdrop, AppBar, LamapButton, PageTitle, SectionHeader } from "@/components/lamap";
import { FONT_WEIGHTS, useTheme, type Theme } from "@/design";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Stub — gift transfer mutation (+ anti-collusion) not built yet.
const FRIENDS = [
  { name: "Le Grand Bandi", initials: "LB", sub: "En match" },
  { name: "Maestro", initials: "MA", sub: "En ligne" },
  { name: "D. Tigre", initials: "DT", sub: "En ligne" },
];
const AMOUNTS = [100, 500, 1000, 2000];

export default function GiftScreen() {
  const theme = useTheme();
  const s = makeStyles(theme);
  const [amount, setAmount] = useState(500);
  const [friend, setFriend] = useState(0);

  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBackdrop dust={10} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <AppBar title="Offrir des Kora" />
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <PageTitle eyebrow="CADEAU EN KORA" title="Fais plaisir." />

          <SectionHeader title="Pour qui ?" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.friends}>
            {FRIENDS.map((f, i) => {
              const active = i === friend;
              return (
                <Pressable
                  key={f.name}
                  onPress={() => setFriend(i)}
                  style={[
                    s.friendCard,
                    {
                      backgroundColor: active ? theme.goldA(0.18) : theme.surfA(0.55),
                      borderColor: active ? theme.goldA(0.5) : theme.goldA(0.12),
                    },
                  ]}
                >
                  <View style={[s.friendAvatar, { backgroundColor: theme.accent }]}>
                    <Text style={s.friendInitials}>{f.initials}</Text>
                  </View>
                  <Text style={s.friendName} numberOfLines={1}>{f.name}</Text>
                  <Text style={s.friendSub}>{f.sub}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <SectionHeader title="Montant" />
          <View style={s.amountGrid}>
            {AMOUNTS.map((a) => {
              const active = a === amount;
              return (
                <Pressable
                  key={a}
                  onPress={() => setAmount(a)}
                  style={[
                    s.amountBtn,
                    {
                      backgroundColor: active ? theme.goldA(0.2) : theme.surfA(0.55),
                      borderColor: active ? theme.goldA(0.5) : theme.goldA(0.12),
                    },
                  ]}
                >
                  <Text style={[s.amountText, { color: theme.goldBright }]}>◆ {a.toLocaleString("fr-FR")}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={s.messageCard}>
            <Text style={s.messageLabel}>UN PETIT MOT (OPTIONNEL)</Text>
            <Text style={s.messagePlaceholder}>« Tiens, pour ta prochaine Kora »</Text>
          </View>

          <View style={s.recap}>
            <View style={s.recapRow}>
              <Text style={s.recapLabel}>Tu envoies</Text>
              <Text style={s.recapValue}>◆ {amount.toLocaleString("fr-FR")}</Text>
            </View>
            <View style={s.recapRow}>
              <Text style={s.recapLabel}>Solde après envoi</Text>
              <Text style={s.recapValueSm}>◆ {(12480 - amount).toLocaleString("fr-FR")}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={s.footer}>
          <LamapButton
            title={`Envoyer à ${FRIENDS[friend].name.split(" ")[0]} →`}
            variant="gold"
            onPress={() => {}}
          />
          <Text style={s.footNote}>MAX 5 000 K / JOUR · ANTI-FRAUDE</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.abyss },
    friends: { paddingHorizontal: 20, gap: 10, paddingBottom: 6 },
    friendCard: { width: 96, padding: 12, borderRadius: 14, borderWidth: 1, alignItems: "center", gap: 8 },
    friendAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
    friendInitials: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 14, color: theme.cream },
    friendName: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 11, color: theme.cream, maxWidth: 80 },
    friendSub: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 7, letterSpacing: 1.2, color: theme.creamA(0.5) },
    amountGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, gap: 8 },
    amountBtn: { flexBasis: "47%", flexGrow: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, alignItems: "center" },
    amountText: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 16 },
    messageCard: {
      marginHorizontal: 20,
      marginTop: 12,
      padding: 14,
      borderRadius: 14,
      backgroundColor: theme.surfA(0.6),
      borderWidth: 1,
      borderColor: theme.goldA(0.12),
    },
    messageLabel: { fontFamily: FONT_WEIGHTS.mono.semibold, fontSize: 9, letterSpacing: 1.8, color: theme.gold, marginBottom: 6 },
    messagePlaceholder: { fontFamily: FONT_WEIGHTS.body.regular, fontStyle: "italic", fontSize: 13, color: theme.creamA(0.6) },
    recap: {
      marginHorizontal: 20,
      marginTop: 16,
      padding: 14,
      borderRadius: 14,
      backgroundColor: "rgba(0,0,0,0.3)",
      borderWidth: 1,
      borderColor: theme.goldA(0.12),
      gap: 4,
    },
    recapRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
    recapLabel: { fontFamily: FONT_WEIGHTS.body.regular, fontSize: 12, color: theme.creamA(0.55) },
    recapValue: { fontFamily: FONT_WEIGHTS.display.extrabold, fontSize: 18, color: theme.goldBright },
    recapValueSm: { fontFamily: FONT_WEIGHTS.display.bold, fontSize: 13, color: theme.cream },
    footer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 28,
      backgroundColor: theme.surfA(0.92),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.goldA(0.12),
    },
    footNote: { fontFamily: FONT_WEIGHTS.mono.medium, fontSize: 8, letterSpacing: 1.6, color: theme.creamA(0.4), textAlign: "center", marginTop: 10 },
  });
}
