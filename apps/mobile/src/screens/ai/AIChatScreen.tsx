import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useAIStore } from '../../store/aiStore';

type Props = NativeStackScreenProps<RootStackParamList, 'AIChat'>;

export default function AIChatScreen({ navigation }: Props) {
  const { conversations, activeConversationId, isTyping, error, sendMessage } = useAIStore();
  const [input, setInput] = useState('');
  const activeConvo = conversations.find((c) => c.id === activeConversationId);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(headerOpacity, { toValue: 1, duration: 320, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View style={{ opacity: headerOpacity }}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text style={styles.title}>AI Chat</Text>
        </View>
      </Animated.View>

      {!activeConversationId ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No active conversation</Text>
          <Text style={styles.emptyDesc}>Start a new conversation to chat with your AI coach</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={activeConvo?.messages || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatBubble content={item.content} role={item.role} />
            )}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyDesc}>Start the conversation by sending a message below</Text>
              </View>
            }
          />

          {isTyping && <TypingIndicator />}

          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </>
      )}

      <PremiumCard variant="glass" style={styles.inputBar}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            accessibilityLabel="Chat input"
            onSubmitEditing={handleSend}
          />
          <Button variant="primary" title="Send" onPress={handleSend} size="sm" />
        </View>
      </PremiumCard>
    </SafeAreaView>
  );
}

function ChatBubble({ content, role }: { content: string; role: 'user' | 'assistant' }) {
  const isAI = role === 'assistant';

  return (
    <View style={[styles.msgRow, isAI ? styles.msgAI : styles.msgUser]}>
      <View style={[styles.bubble, isAI ? styles.bubbleAI : styles.bubbleUser]}>
        <Text style={isAI ? styles.msgTextAI : styles.msgTextUser}>{content}</Text>
      </View>
    </View>
  );
}

function TypingIndicator() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 320, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 320, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.typing}>
      <Animated.View style={[styles.typingDot, { opacity, backgroundColor: colors.primary }]} />
      <Animated.View style={[styles.typingDot, { opacity, backgroundColor: colors.secondary }]} />
      <Animated.View style={[styles.typingDot, { opacity, backgroundColor: colors.accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  list: { paddingBottom: spacing.md },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '600', marginTop: spacing.md },
  emptyDesc: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.sm, textAlign: 'center' },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: 'rgba(255, 107, 107, 0.1)', padding: spacing.sm, borderRadius: borderRadius.sm, marginBottom: spacing.sm },
  errorText: { color: colors.error, fontSize: 13 },
  msgRow: { marginBottom: spacing.sm },
  msgUser: { flexDirection: 'row', justifyContent: 'flex-end' },
  msgAI: { flexDirection: 'row', justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', padding: spacing.md, borderRadius: borderRadius.md, borderBottomRightRadius: 4, borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: colors.primary },
  bubbleAI: { backgroundColor: colors.surfaceGlass, borderLeftWidth: 3, borderLeftColor: colors.primary },
  msgTextUser: { color: colors.background },
  msgTextAI: { color: colors.textPrimary },
  typing: { flexDirection: 'row', gap: spacing.xs, padding: spacing.sm },
  typingDot: { width: 8, height: 8, borderRadius: 4 },
  inputBar: { padding: spacing.sm, marginBottom: spacing.sm },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  input: { flex: 1, backgroundColor: colors.surfaceGlass, color: colors.textPrimary, padding: spacing.sm, borderRadius: 20, paddingHorizontal: spacing.md },
});