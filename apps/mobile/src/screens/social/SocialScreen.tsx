import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import { Button } from '../../components/Button';
import Avatar from '../../components/Avatar';
import { Ionicons } from '@expo/vector-icons';
import { useSocialStore } from '../../store/socialStore';
import { EmptyState } from '../../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'Social'>;

export default function SocialScreen({ navigation }: Props) {
  const { feed, stories, fetchFeed, fetchStories, likePost, createComment, isLoading, error: storeError } = useSocialStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchFeed(); fetchStories(); }, []);

  const handleLike = useCallback(async (postId: string) => {
    setError(null);
    try {
      await likePost(postId);
    } catch {
      setError('Failed to like post');
    }
  }, [likePost]);

  const handleComment = useCallback(async (postId: string) => {
    setError(null);
    try {
      await createComment(postId, 'Great post!');
    } catch {
      setError('Failed to comment on post');
    }
  }, [createComment]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Social</Text>
        <Pressable onPress={() => navigation.navigate('Messages')} accessibilityLabel="Messages">
          <Ionicons name="paper-plane-outline" size={22} color={colors.primary} />
        </Pressable>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        horizontal
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StoryRing user={item.userName} onPress={() => navigation.navigate('Stories')} />
        )}
        style={styles.stories}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContent}
        ListEmptyComponent={<Text style={styles.emptyStories}>No stories</Text>}
      />

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : storeError ? (
        <EmptyState icon="⚠️" title="Failed to load feed" description="Pull to refresh" />
      ) : !feed || feed.length === 0 ? (
        <EmptyState icon="📱" title="No posts yet" description="Be the first to share something" />
      ) : (
        <FlatList
          data={feed}
          keyExtractor={(item) => item.id}
          refreshing={isLoading}
          onRefresh={fetchFeed}
          renderItem={({ item }) => (
            <PremiumCard variant="glass" style={styles.postCard}>
              <View style={styles.postHeader}>
                <Avatar size={40} />
                <View style={styles.postInfo}>
                  <Text style={styles.userName}>{item.userName}</Text>
                  <Text style={styles.time}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</Text>
                </View>
              </View>
              <Text style={styles.content}>{item.content}</Text>
              <View style={styles.actions}>
                <Pressable onPress={() => handleLike(item.id)} style={styles.actionGroup}>
                  <Ionicons name="heart-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.actionText}>{item.likes}</Text>
                </Pressable>
                <Pressable onPress={() => handleComment(item.id)} style={styles.actionGroup}>
                  <Ionicons name="chatbubble-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.actionText}>{item.comments}</Text>
                </Pressable>
              </View>
            </PremiumCard>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

function StoryRing({ user, onPress }: { user: string; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.timing(scale, { toValue: 0.95, duration: 120, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }).start();

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
      <Animated.View style={[styles.storyRing, { transform: [{ scale }] }]}>
        <View style={styles.ringGradient} />
        <View style={styles.ringInner}>
          <Avatar size={56} />
        </View>
      </Animated.View>
      <Text style={styles.storyName}>{user}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  stories: { marginBottom: spacing.md },
  storiesContent: { paddingHorizontal: spacing.xs },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  ringGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 59, 59, 0.3)',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ringInner: {
    backgroundColor: colors.background,
    borderRadius: 28,
    padding: 2,
  },
  storyName: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.xs },
  list: { paddingBottom: spacing.md },
  postCard: { padding: spacing.md, marginBottom: spacing.sm },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  postInfo: { marginLeft: spacing.sm },
  userName: { color: colors.textPrimary, fontWeight: '600' },
  time: { color: colors.textMuted, fontSize: 12 },
  content: { color: colors.textPrimary, marginBottom: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.lg },
  actionGroup: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  actionText: { color: colors.textSecondary },
  emptyStories: { color: colors.textMuted, fontSize: 14, paddingVertical: 24 },
  errorBanner: {
    backgroundColor: colors.error + '20',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: { color: colors.error, fontSize: 14, textAlign: 'center' },
});