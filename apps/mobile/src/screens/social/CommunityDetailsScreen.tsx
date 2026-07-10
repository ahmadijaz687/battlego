import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import { Badge } from '../../components/Badge';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useSocialStore } from '../../store/socialStore';

type Props = NativeStackScreenProps<RootStackParamList, 'CommunityDetails'>;

interface LocalPost {
  id: string;
  userName: string;
  content: string;
  createdAt: string;
}

export default function CommunityDetailsScreen({ navigation, route }: Props) {
  const { communityId } = route.params;
  const [newPost, setNewPost] = useState('');
  const [localPosts, setLocalPosts] = useState<LocalPost[]>([]);

  const { communities, fetchCommunities, createPost, isLoading } = useSocialStore();

  useEffect(() => { fetchCommunities(); }, []);

  const community = communities?.find((c) => c.id === communityId);

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    createPost({ content: newPost.trim(), type: 'general' });
    setLocalPosts((prev) => [
      { id: Date.now().toString(), userName: 'You', content: newPost.trim(), createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setNewPost('');
  };

  const posts = localPosts;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>{community?.name || 'Community'}</Text>
        <Pressable accessibilityLabel="Notifications">
          <Ionicons name="notifications-outline" size={22} color={colors.primary} />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PremiumCard variant="glass" style={styles.postCard}>
                <Text style={styles.postUser}>{item.userName}</Text>
                <Text style={styles.postContent}>{item.content}</Text>
              </PremiumCard>
            )}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <EmptyState icon="💬" title="No posts yet" description="Be the first to post in this community" />
            }
          />
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Write a post..."
              placeholderTextColor={colors.textMuted}
              value={newPost}
              onChangeText={setNewPost}
              multiline
            />
            <Button title="Post" size="sm" onPress={handleCreatePost} disabled={!newPost.trim() || isLoading} />
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary },
  list: { paddingBottom: spacing.md },
  postCard: { padding: spacing.md, marginBottom: spacing.sm },
  postUser: { color: colors.textPrimary, fontWeight: '600' },
  postContent: { color: colors.textSecondary, marginTop: spacing.xs },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  flex: { flex: 1 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 80,
  },
});