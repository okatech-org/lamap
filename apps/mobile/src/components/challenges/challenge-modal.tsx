import { Button } from "@/components/ui/button";
import { api } from "@lamap/convex/_generated/api";
import { Currency } from "@lamap/convex/currencies";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { useMutation } from "convex/react";
import { useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

interface ChallengeModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (challengeId?: string) => void;
  challengedUserId: string;
  challengedUsername: string;
  currency: Currency;
}

export function ChallengeModal({
  visible,
  onClose,
  onSuccess,
  challengedUserId,
  challengedUsername,
  currency,
}: ChallengeModalProps) {
  const colors = useColors();
  const { convexUser } = useAuth();
  const mode = "RANKED"; // Free-to-play: only RANKED challenges allowed
  const [loading, setLoading] = useState(false);

  const sendChallenge = useMutation(api.challenges.sendChallenge);

  const handleSendChallenge = async () => {
    if (!convexUser?._id) {
      Alert.alert("Erreur", "Vous devez être connecté pour défier un joueur.");
      return;
    }

    setLoading(true);
    try {
      const result = await sendChallenge({
        challengerId: convexUser._id,
        challengedId: challengedUserId as any,
        mode: "RANKED",
        betAmount: undefined,
        currency: undefined,
        competitive: undefined,
      });

      onClose();

      if (onSuccess && result?.challengeId) {
        onSuccess(result.challengeId);
      } else if (result?.challengeId) {
        Alert.alert(
          "Défi envoyé",
          `Votre défi a été envoyé à ${challengedUsername}.`
        );
      }
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Impossible d'envoyer le défi.");
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      width: "90%",
      maxWidth: 500,
      maxHeight: "80%",
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    modalSubtitle: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginBottom: 24,
    },
    modeSelector: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 24,
    },
    modeButton: {
      flex: 1,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
    },
    competitiveToggle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    toggleLabel: {
      flex: 1,
      marginRight: 12,
    },
    toggleTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    toggleDescription: {
      fontSize: 13,
      color: colors.mutedForeground,
    },
    actions: {
      flexDirection: "row",
      gap: 12,
      marginTop: 8,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Défier {challengedUsername}</Text>
            <Text style={styles.modalSubtitle}>
              Défi en mode Classé (gratuit)
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Partie Classée</Text>
              <Text
                style={{ color: colors.mutedForeground, marginBottom: 12 }}
              >
                • Pas de mise{"\n"}• Affecte votre classement PR
              </Text>
            </View>

            <View style={styles.actions}>
              <Button
                title="Défier"
                onPress={handleSendChallenge}
                variant="primary"
                loading={loading}
                style={{ flex: 1 }}
              />
              <Button
                title="Annuler"
                onPress={onClose}
                variant="ghost"
                style={{ flex: 1 }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
