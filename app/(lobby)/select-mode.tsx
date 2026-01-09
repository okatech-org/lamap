import { RankBadge } from "@/components/ranking/RankBadge";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Spacing } from "@/constants/spacing";
import { Typography } from "@/constants/typography";
import { api } from "@/convex/_generated/api";
import { getRankFromPR, INITIAL_PR } from "@/convex/ranking";
import { useAuth } from "@/hooks/useAuth";
import { useColors } from "@/hooks/useColors";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectModeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { userId, convexUser } = useAuth();

  const activeGame = useQuery(
    api.games.getActiveMatch,
    userId ? { clerkId: userId } : "skip"
  );

  const userPR = convexUser?.pr || INITIAL_PR;
  const userRank = getRankFromPR(userPR);

  const styles = StyleSheet.create({
    activeMatchCard: {
      backgroundColor: colors.accent,
      borderRadius: Spacing.radius.lg,  // 16px
      padding: Spacing.card.horizontal,  // 20px
      marginBottom: Spacing.lg,  // 24px
      borderWidth: 2,
      borderColor: colors.secondary,
    },
    activeMatchContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: Spacing.md,  // 16px
    },
    activeMatchLabel: {
      fontSize: Typography.caption.fontSize,  // 14px
      color: colors.secondary,
      fontWeight: Typography.captionBold.fontWeight,  // 600
      marginBottom: Spacing.xs,  // 4px
    },
    activeMatchInfo: {
      fontSize: Typography.body.fontSize,  // 16px
      color: colors.text,
      fontWeight: Typography.bodyBold.fontWeight,  // 600
    },
    rejoinButton: {
      minHeight: 40,
      paddingHorizontal: Spacing.md,
      backgroundColor: colors.secondary,
    },
    rejoinButtonText: {
      color: colors.secondaryForeground,
      fontSize: Typography.caption.fontSize,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: Spacing.container.horizontal,  // 24px
      paddingTop: Spacing.xl,  // 32px
    },
    header: {
      marginBottom: Spacing.xl,  // 32px
    },
    title: {
      fontSize: Typography.h1.fontSize,  // 32px
      fontWeight: Typography.h1.fontWeight,  // 700
      color: colors.text,
      textAlign: "center",
      marginBottom: Spacing.sm,  // 8px
    },
    subtitle: {
      fontSize: Typography.body.fontSize,  // 16px
      color: colors.mutedForeground,
      textAlign: "center",
    },
    modesContainer: {
      gap: Spacing.md,  // 16px
      marginBottom: Spacing.xl,  // 32px
    },
    modeCard: {
      backgroundColor: colors.card,
      borderRadius: Spacing.radius.lg,  // 16px
      padding: Spacing.card.horizontal,  // 20px
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 180,  // Larger cards for better impact
    },
    modeHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: Spacing.md,  // 16px
    },
    modeIconContainer: {
      width: 56,  // Larger icons (reference: 48px → 56px)
      height: 56,
      borderRadius: Spacing.radius.md,  // 12px
      backgroundColor: colors.secondary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: Spacing.md,  // 16px
    },
    modeInfo: {
      flex: 1,
    },
    modeTitle: {
      fontSize: Typography.h3.fontSize,  // 20px
      fontWeight: Typography.h3.fontWeight,  // 600
      color: colors.text,
      marginBottom: Spacing.xs,  // 4px
    },
    modeDescription: {
      fontSize: Typography.caption.fontSize,  // 14px
      color: colors.mutedForeground,
    },
    modeFeatures: {
      fontSize: Typography.small.fontSize,  // 12px
      lineHeight: Typography.small.lineHeight,  // 18px
      marginTop: Spacing.sm,  // 8px
      marginBottom: Spacing.xs,  // 4px
    },
    modeButton: {
      minHeight: 48,
      marginTop: Spacing.md,  // 16px
    },
    friendlySection: {
      marginTop: Spacing.lg,  // 24px
      paddingTop: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    sectionTitle: {
      fontSize: Typography.h4.fontSize,  // 18px
      fontWeight: Typography.h3.fontWeight,  // 600
      color: colors.text,
      marginBottom: Spacing.md,  // 16px
    },
    friendlyOptions: {
      gap: Spacing.md,  // 16px
    },
    friendlyButton: {
      minHeight: 56,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {activeGame && (
            <View style={styles.activeMatchCard}>
              <View style={styles.activeMatchContent}>
                <View>
                  <Text style={styles.activeMatchLabel}>Partie en cours</Text>
                  <Text style={styles.activeMatchInfo}>
                    {activeGame.mode === "AI" ?
                      "Contre l'IA"
                    : activeGame.mode === "RANKED" ?
                      "Partie Classée"
                    : "Partie Amicale"}
                  </Text>
                </View>
                <Button
                  title="Rejoindre"
                  onPress={() =>
                    router.push(`/(game)/match/${activeGame.gameId}`)
                  }
                  style={styles.rejoinButton}
                  textStyle={styles.rejoinButtonText}
                />
              </View>
            </View>
          )}

          <View style={styles.header}>
            <Text style={styles.title}>Choisir un mode</Text>
            <Text style={styles.subtitle}>Comment voulez-vous jouer ?</Text>
          </View>

          <View style={styles.modesContainer}>
            {/* Mode Classé */}
            <View
              style={[
                styles.modeCard,
                { borderColor: userRank.color, borderWidth: 2 },
              ]}
            >
              <View style={styles.modeHeader}>
                <View
                  style={[
                    styles.modeIconContainer,
                    { backgroundColor: userRank.color },
                  ]}
                >
                  <Ionicons name="trophy" size={28} color="#FFF" />
                </View>
                <View style={styles.modeInfo}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text style={styles.modeTitle}>Mode Classé</Text>
                    <RankBadge rank={userRank} size="small" />
                  </View>
                  <Text style={styles.modeDescription}>
                    Gratuit • Affecte votre classement • {userPR} PR
                  </Text>
                </View>
              </View>
              <Text
                style={[styles.modeFeatures, { color: colors.mutedForeground }]}
              >
                ✓ Matchmaking par rang{"\n"}✓ Progression compétitive{"\n"}✓
                Sans mise &apos;argent&apos;
              </Text>
              <Button
                title="Jouer en Classé"
                onPress={() => router.push("/(lobby)/ranked-matchmaking")}
                variant="primary"
                style={styles.modeButton}
              />
            </View>

            {/* Mode IA */}
            <View style={styles.modeCard}>
              <View style={styles.modeHeader}>
                <View
                  style={[
                    styles.modeIconContainer,
                    { backgroundColor: colors.muted },
                  ]}
                >
                  <Ionicons name="hardware-chip" size={28} color="#FFF" />
                </View>
                <View style={styles.modeInfo}>
                  <Text style={styles.modeTitle}>Mode IA</Text>
                  <Text style={styles.modeDescription}>
                    Entraînement • Sans classement
                  </Text>
                </View>
              </View>
              <Text
                style={[styles.modeFeatures, { color: colors.mutedForeground }]}
              >
                ✓ Pratiquez sans risque{"\n"}✓ 3 niveaux de difficulté{"\n"}✓
                N&apos;affecte pas votre classement
              </Text>
              <Button
                title="S'entraîner"
                onPress={() => router.push("/(lobby)/select-difficulty")}
                variant="secondary"
                style={styles.modeButton}
              />
            </View>
          </View>

          <Button
            title="Retour"
            onPress={() => router.back()}
            variant="ghost"
            icon={
              <IconSymbol name="arrow.left" size={24} color={colors.text} />
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
