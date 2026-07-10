import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import Avatar from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { SearchBar } from '../../components/SearchBar';
import { EmptyState } from '../../components/EmptyState';
import { useSocialStore } from '../../store/socialStore';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Messages'>;

export default function MessagesScreen({ navigation }: Props) {
  const { conversations, fetchConversations, isLoading } = useSocialStore();

  useEffect(() => { fetchConversations(); }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Messages</Text>
      </View>

      <SearchBar placeholder="Search messages..." style={styles.search} />

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PremiumCard variant="glass" pressable onPress={() => navigation.navigate('Chat', { conversationId: item.id })} style={styles.convoCard}>
              <View style={styles.convoRow}>
                <Avatar size={48} />
                <View style={styles.convoInfo}>
                  <Text style={styles.convoName}>{item.participantNames.join(', ')}</Text>
                  <Text style={styles.convoMsg} numberOfLines={1}>{item.lastMessage}</Text>
                </View>
                <View style={styles.convoMeta}>
                  <Text style={styles.convoTime}>{item.lastMessageAt ? new Date(item.lastMessageAt).toLocaleDateString() : ''}</Text>
                  {item.unreadCount > 0 && <Badge label={String(item.unreadCount)} variant="primary" size="sm" />}
                </View>
              </View>
            </PremiumCard>
          )}
          ListEmptyComponent={<EmptyState icon="💬" title="No messages" description="Start a conversation with a friend" />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  search: { marginBottom: spacing.md },
  convoCard: { padding: spacing.md },
  convoRow: { flexDirection: 'row', alignItems: 'center' },
  convoInfo: { flex: 1, marginLeft: spacing.md },
  convoName: { color: colors.textPrimary, fontWeight: '600' },
  convoMsg: { color: colors.textSecondary },
  convoMeta: { alignItems: 'flex-end' },
  convoTime: { color: colors.textMuted, fontSize: 12 },
});