import { BattleLayoutPreview } from "@/components/settings/battle-layout-preview";
import { CardLayoutPreview } from "@/components/settings/card-layout-preview";
import { Button } from "@/components/ui/button";
import { PRIVACY_URL, TERMS_URL } from "@/config/legal";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { useSettings } from "@/hooks/use-settings";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@lamap/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const colors = useColors();
  const { convexUser } = useAuth();
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const {
    cardLayout,
    battleLayout,
    setCardLayout,
    setBattleLayout,
    isLoading,
  } = useSettings();
  const deleteAccount = useMutation(api.users.deleteAccount);
  const [deleting, setDeleting] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [signOut, router]);

  const handleOpenPrivacy = useCallback(() => {
    WebBrowser.openBrowserAsync(PRIVACY_URL).catch(() => {});
  }, []);

  const handleOpenTerms = useCallback(() => {
    WebBrowser.openBrowserAsync(TERMS_URL).catch(() => {});
  }, []);

  const handleDeleteAccount = useCallback(() => {
    if (!convexUser?._id) return;
    Alert.alert(
      "Supprimer mon compte",
      "Cette action est irréversible. Vous perdrez votre solde Kora, votre classement, votre historique de parties et tous vos cosmétiques.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Continuer",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Confirmer la suppression",
              "Toutes vos données seront définitivement effacées. Êtes-vous absolument sûr ?",
              [
                { text: "Annuler", style: "cancel" },
                {
                  text: "Supprimer définitivement",
                  style: "destructive",
                  onPress: async () => {
                    setDeleting(true);
                    try {
                      await deleteAccount({ userId: convexUser._id });
                      await clerkUser?.delete();
                      await signOut();
                      router.replace("/");
                    } catch (err) {
                      console.error("Account deletion failed:", err);
                      Alert.alert(
                        "Erreur",
                        err instanceof Error
                          ? err.message
                          : "La suppression a échoué. Réessayez plus tard.",
                      );
                    } finally {
                      setDeleting(false);
                    }
                  },
                },
              ],
            );
          },
        },
      ],
    );
  }, [clerkUser, convexUser?._id, deleteAccount, router, signOut]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 24,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    optionContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: colors.border,
    },
    optionContainerSelected: {
      borderColor: colors.secondary,
      backgroundColor: colors.accent,
    },
    optionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    optionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    optionDescription: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginTop: 4,
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
    },
    settingInfo: {
      flex: 1,
      marginRight: 16,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 14,
      color: colors.mutedForeground,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    closeButton: {
      padding: 8,
    },
    layoutOptions: {
      flexDirection: "row",
      gap: 12,
      marginTop: 12,
    },
    layoutOption: {
      alignItems: "center",
      gap: 8,
    },
    layoutLabel: {
      fontSize: 12,
      color: colors.text,
      textAlign: "center",
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      </SafeAreaView>
    );
  }



  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compte</Text>

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Nom d&apos;utilisateur</Text>
                <Text style={styles.settingDescription}>
                  {convexUser?.username || "Non défini"}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>

            <View style={{ height: 12 }} />

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Pays</Text>
                <Text style={styles.settingDescription}>
                  {convexUser?.country || "Non défini"}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>

            <View style={{ height: 12 }} />

          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disposition des cartes</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingDescription}>
                  Choisissez comment vos cartes sont affichées dans votre main
                </Text>
              </View>
            </View>
            <View style={styles.layoutOptions}>
              <TouchableOpacity
                style={styles.layoutOption}
                onPress={() => setCardLayout("fan")}
              >
                <CardLayoutPreview
                  layout="fan"
                  isSelected={cardLayout === "fan"}
                />
                <Text style={styles.layoutLabel}>Éventail</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.layoutOption}
                onPress={() => setCardLayout("linear")}
              >
                <CardLayoutPreview
                  layout="linear"
                  isSelected={cardLayout === "linear"}
                />
                <Text style={styles.layoutLabel}>Linéaire</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.layoutOption}
                onPress={() => setCardLayout("compact")}
              >
                <CardLayoutPreview
                  layout="compact"
                  isSelected={cardLayout === "compact"}
                />
                <Text style={styles.layoutLabel}>Compact</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Affichage des cartes jouées</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingDescription}>
                  Choisissez comment les cartes jouées sont affichées pendant la
                  partie
                </Text>
              </View>
            </View>
            <View style={styles.layoutOptions}>
              <TouchableOpacity
                style={styles.layoutOption}
                onPress={() => setBattleLayout("vertical")}
              >
                <BattleLayoutPreview
                  layout="vertical"
                  isSelected={battleLayout === "vertical"}
                />
                <Text style={styles.layoutLabel}>Côte à côte</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.layoutOption}
                onPress={() => setBattleLayout("horizontal")}
              >
                <BattleLayoutPreview
                  layout="horizontal"
                  isSelected={battleLayout === "horizontal"}
                />
                <Text style={styles.layoutLabel}>Haut/Bas</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sécurité</Text>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => router.push("/settings/blocked-users")}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Utilisateurs bloqués</Text>
                <Text style={styles.settingDescription}>
                  Gérez la liste des comptes que vous avez bloqués
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aide</Text>
            <Button
              title="Révoir le tutoriel"
              onPress={() => router.push("/(onboarding)/tutorial")}
              variant="outline"
              style={{ marginBottom: 12 }}
            />
            <Button
              title="POC carte Skia"
              onPress={() => router.push("/card-poc")}
              variant="outline"
              style={{ marginBottom: 12 }}
            />
            <Button
              title="POC #2 — Main de cartes"
              onPress={() => router.push("/card-poc-hand")}
              variant="outline"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Légal</Text>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleOpenPrivacy}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  Politique de confidentialité
                </Text>
              </View>
              <Ionicons
                name="open-outline"
                size={20}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
            <View style={{ height: 12 }} />
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleOpenTerms}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  Conditions d&apos;utilisation
                </Text>
              </View>
              <Ionicons
                name="open-outline"
                size={20}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Button
              title="Se déconnecter"
              onPress={handleSignOut}
              variant="destructive"
              style={{ marginBottom: 12 }}
            />
            <Button
              title={
                deleting
                  ? "Suppression…"
                  : "Supprimer mon compte / Delete account"
              }
              onPress={handleDeleteAccount}
              variant="destructive"
              disabled={deleting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
