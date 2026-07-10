import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import Avatar from '../../components/Avatar';
import { Button } from '../../components/Button';
import { useSocialStore } from '../../store/socialStore';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export default function ChatScreen({ navigation, route }: Props) {
  const { conversationId } = route.params;
  const { chatMessages, fetchChatMessages, sendMessage, isLoading } = useSocialStore();
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchChatMessages(conversationId); }, [conversationId]);

  const handleSend = () => {
    if (!msg.trim()) return;
    sendMessage(conversationId, msg.trim());
    setMsg('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Avatar size={32} />
          <Text style={styles.title}>Chat</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={chatMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble text={item.content} fromMe={item.senderId === 'me'} />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <PremiumCard variant="glass" style={styles.inputBar}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textMuted}
            value={msg}
            onChangeText={setMsg}
            accessibilityLabel="Message input"
          />
          <Button variant="primary" title="Send" onPress={handleSend} size="sm" loading={isLoading} disabled={!msg.trim()} />
        </View>
      </PremiumCard>
    </SafeAreaView>
  );
}

function MessageBubble({ text, fromMe }: { text: string; fromMe: boolean }) {
  return (
    <View style={[styles.msgRow, fromMe ? styles.msgMe : styles.msgThem]}>
      <View style={[styles.msgBubble, fromMe ? styles.bubbleMe : styles.bubbleThem]}>
        <Text style={fromMe ? styles.msgTextMe : styles.msgTextThem}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  headerInfo: { flexDirection: 'row', alignItems: 'center', marginLeft: spacing.md },
  title: { ...typography.h2, color: colors.textPrimary },
  list: { paddingBottom: spacing.md },
  msgRow: { marginBottom: spacing.sm },
  msgMe: { flexDirection: 'row', justifyContent: 'flex-end' },
  msgThem: { flexDirection: 'row', justifyContent: 'flex-start' },
  msgBubble: { maxWidth: '80%', padding: spacing.md, borderRadius: borderRadius.md, borderBottomRightRadius: 4, borderBottomLeftRadius: 4 },
  bubbleMe: { backgroundColor: colors.primary },
  bubbleThem: { backgroundColor: colors.surfaceGlass },
  msgTextMe: { color: colors.background },
  msgTextThem: { color: colors.textPrimary },
  inputBar: { padding: spacing.sm, marginBottom: spacing.sm },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  input: { flex: 1, backgroundColor: colors.surfaceGlass, color: colors.textPrimary, padding: spacing.sm, borderRadius: 20, paddingHorizontal: spacing.md },
});