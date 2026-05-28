import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { api } from "@lamap/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { useMutation, useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConversationScreen() {
  const colors = useColors();
  const router = useRouter();
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const { userId } = useAuth();
  const user = useQuery(
    api.users.getCurrentUser,
    userId ? { clerkUserId: userId } : "skip"
  );
  const myUserId = user?._id;

  const isValidConversationId = conversationId && 
    conversationId !== "sso-callback" && 
    !conversationId.startsWith("_") &&
    conversationId.length > 10;

  useEffect(() => {
    if (conversationId && !isValidConversationId) {
      router.replace("/(tabs)/messages");
    }
  }, [conversationId, isValidConversationId, router]);

  const conversation = useQuery(
    (api as any).messaging.getConversations,
    myUserId ? { userId: myUserId } : "skip"
  )?.find((c: any) => c._id === conversationId);

  const messages = useQuery(
    (api as any).messaging.getMessages,
    isValidConversationId && conversationId ? { conversationId: conversationId as any } : "skip"
  );

  const sendMessage = useMutation((api as any).messaging.sendMessage);
  const markAsRead = useMutation((api as any).messaging.markAsRead);
  const reportContent = useMutation((api as any).moderation.reportContent);
  const blockUser = useMutation((api as any).moderation.blockUser);

  const reasonLabels: Record<string, string> = {
    spam: "Spam",
    harassment: "Harcèlement",
    sexual: "Contenu sexuel",
    other: "Autre",
  };

  const submitReport = async (
    targetType: "message" | "user",
    targetId: string,
    reason: "spam" | "harassment" | "sexual" | "other"
  ) => {
    if (!myUserId) return;
    try {
      await reportContent({
        reporterId: myUserId,
        targetType,
        targetId,
        reason,
      });
      Alert.alert(
        "Signalement envoyé",
        "Merci. Notre équipe va examiner ce contenu, conformément à nos CGU.",
      );
    } catch (err) {
      Alert.alert(
        "Erreur",
        err instanceof Error ? err.message : "Impossible d'envoyer le signalement.",
      );
    }
  };

  const showReportSheet = (
    targetType: "message" | "user",
    targetId: string,
  ) => {
    const reasons: ("spam" | "harassment" | "sexual" | "other")[] = [
      "spam",
      "harassment",
      "sexual",
      "other",
    ];
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "Signaler",
          message: "Choisissez un motif (conformément à nos CGU)",
          options: [...reasons.map((r) => reasonLabels[r]), "Annuler"],
          cancelButtonIndex: reasons.length,
        },
        (idx) => {
          if (idx >= 0 && idx < reasons.length) {
            submitReport(targetType, targetId, reasons[idx]);
          }
        },
      );
    } else {
      Alert.alert(
        "Signaler",
        "Choisissez un motif (conformément à nos CGU)",
        [
          ...reasons.map((r) => ({
            text: reasonLabels[r],
            onPress: () => submitReport(targetType, targetId, r),
          })),
          { text: "Annuler", style: "cancel" as const },
        ],
      );
    }
  };

  const confirmBlock = (blockedId: string, blockedName: string) => {
    Alert.alert(
      "Bloquer l'utilisateur",
      `Voulez-vous bloquer ${blockedName} ? Vous ne verrez plus ses messages, conformément à nos CGU.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Bloquer",
          style: "destructive",
          onPress: async () => {
            if (!myUserId) return;
            try {
              await blockUser({
                blockerId: myUserId,
                blockedId: blockedId as any,
              });
              Alert.alert(
                "Utilisateur bloqué",
                `${blockedName} a été bloqué.`,
              );
              router.back();
            } catch (err) {
              Alert.alert(
                "Erreur",
                err instanceof Error
                  ? err.message
                  : "Impossible de bloquer cet utilisateur.",
              );
            }
          },
        },
      ],
    );
  };

  const showMessageMenu = (msg: any, isMine: boolean) => {
    if (isMine) return;
    const senderId = msg.sender?._id;
    const senderName = msg.sender?.username || "cet utilisateur";
    if (!senderId) return;

    const options = ["Signaler", "Bloquer l'utilisateur", "Annuler"];
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        },
        (idx) => {
          if (idx === 0) showReportSheet("message", msg._id);
          else if (idx === 1) confirmBlock(senderId, senderName);
        },
      );
    } else {
      Alert.alert(senderName, undefined, [
        {
          text: "Signaler",
          onPress: () => showReportSheet("message", msg._id),
        },
        {
          text: "Bloquer l'utilisateur",
          style: "destructive",
          onPress: () => confirmBlock(senderId, senderName),
        },
        { text: "Annuler", style: "cancel" },
      ]);
    }
  };
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isValidConversationId && conversationId && myUserId) {
      markAsRead({
        conversationId: conversationId as any,
        userId: myUserId,
      }).catch(console.error);
    }
  }, [isValidConversationId, conversationId, myUserId, markAsRead]);

  useEffect(() => {
    if (messages && messages.length > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim() || !isValidConversationId || !conversationId || !myUserId || sending) {
      return;
    }

    setSending(true);
    try {
      await sendMessage({
        conversationId: conversationId as any,
        senderId: myUserId,
        content: messageText.trim(),
      });
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 12,
    },
    backButton: {
      minWidth: 40,
      minHeight: 40,
      padding: 0,
    },
    headerInfo: {
      flex: 1,
    },
    headerName: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    content: {
      flex: 1,
    },
    messagesContainer: {
      flex: 1,
    },
    messagesContent: {
      padding: 16,
      paddingBottom: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 48,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 48,
    },
    emptyText: {
      fontSize: 16,
      color: colors.mutedForeground,
    },
    messageWrapper: {
      flexDirection: "row",
      marginBottom: 12,
      alignItems: "flex-end",
    },
    myMessageWrapper: {
      flexDirection: "row-reverse",
    },
    messageAvatar: {
      marginHorizontal: 8,
    },
    messageBubble: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 12,
      maxWidth: "70%",
    },
    myMessageBubble: {
      backgroundColor: colors.secondary,
    },
    messageUsername: {
      fontSize: 12,
      color: colors.mutedForeground,
      marginBottom: 4,
      fontWeight: "600",
    },
    messageText: {
      fontSize: 14,
      color: colors.text,
    },
    myMessageText: {
      color: colors.secondaryForeground,
    },
    inputContainer: {
      flexDirection: "row",
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 12,
      alignItems: "flex-end",
    },
    input: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: colors.text,
      fontSize: 14,
      maxHeight: 100,
    },
    sendButton: {
      minHeight: 44,
      paddingHorizontal: 20,
    },
  });

  if (!isValidConversationId || !conversationId) {
    return null;
  }

  if (!conversation) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </SafeAreaView>
    );
  }

  const otherParticipant = conversation.otherParticipant;

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.header}>
        <Button
          title="←"
          onPress={() => router.back()}
          variant="ghost"
          style={styles.backButton}
        />
        <Avatar name={otherParticipant?.username || "Utilisateur"} size={40} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>
            {otherParticipant?.username || "Utilisateur"}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.content}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
        >
          {messages === undefined ?
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.secondary} />
            </View>
          : messages.length === 0 ?
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun message pour le moment</Text>
            </View>
          : messages.map((msg: any) => {
              const isMyMessage = msg.sender?._id === myUserId;
              return (
                <View
                  key={msg._id}
                  style={[
                    styles.messageWrapper,
                    isMyMessage ? styles.myMessageWrapper : null,
                  ]}
                >
                  {!isMyMessage && msg.sender && (
                    <Avatar
                      name={msg.sender.username}
                      size={32}
                      style={styles.messageAvatar}
                    />
                  )}
                  <Pressable
                    onLongPress={() => showMessageMenu(msg, isMyMessage)}
                    delayLongPress={350}
                    style={[
                      styles.messageBubble,
                      isMyMessage ? styles.myMessageBubble : null,
                    ]}
                  >
                    {!isMyMessage && msg.sender && (
                      <Text style={styles.messageUsername}>
                        {msg.sender.username}
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.messageText,
                        isMyMessage ? styles.myMessageText : null,
                      ]}
                    >
                      {msg.content}
                    </Text>
                  </Pressable>
                </View>
              );
            })
          }
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Tapez un message..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
          />
          <Button
            title="Envoyer"
            onPress={handleSend}
            disabled={!messageText.trim() || sending}
            loading={sending}
            style={styles.sendButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
