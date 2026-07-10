import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SocialStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import Avatar from '../../components/Avatar';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<SocialStackParamList, 'PostDetails'>;

interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

const mockComments: Comment[] = [
  { id: '1', userName: 'Jane Smith', userAvatar: 'JS', text: 'Great progress! Keep it up 💪', timestamp: '2h ago', likes: 5 },
  { id: '2', userName: 'Mike Johnson', userAvatar: 'MJ', text: 'What workout routine are you following?', timestamp: '1h ago', likes: 2 },
  { id: '3', userName: 'Sarah Wilson', userAvatar: 'SW', text: 'Amazing transformation!', timestamp: '30m ago', likes: 8 },
];

export default function PostDetailsScreen({ navigation }: Props) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(mockComments);

  const handleLike = () => setLiked((p) => !p);
  const handleSave = () => setSaved((p) => !p);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      userName: 'You',
      userAvatar: 'U',
      text: commentText.trim(),
      timestamp: 'Just now',
      likes: 0,
    };
    setComments((prev) => [newComment, ...prev]);
    setCommentText('');
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.comment}>
      <Avatar name={item.userAvatar} size={36} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUser}>{item.userName}</Text>
          <Text style={styles.commentTime}>{item.timestamp}</Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
        <View style={styles.commentActions}>
          <Pressable style={styles.commentAction}>
            <Ionicons name="heart-outline" size={14} color={colors.textMuted} />
            <Text style={styles.commentActionText}>{item.likes}</Text>
          </Pressable>
          <Pressable style={styles.commentAction}>
            <Ionicons name="chatbubble-outline" size={14} color={colors.textMuted} />
            <Text style={styles.commentActionText}>Reply</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <View style={styles.postHeader}>
              <Pressable style={styles.userRow} onPress={() => {}}>
                <Avatar name="JD" size={44} />
                <View>
                  <Text style={styles.userName}>John Doe</Text>
                  <Text style={styles.postTime}>3 hours ago</Text>
                </View>
              </Pressable>
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
            </View>

            <Text style={styles.postCaption}>
              Just finished my morning workout! Feeling great. Consistency is key! 🔑
            </Text>

            <Image
              source={{ uri: 'https://picsum.photos/400/300' }}
              style={styles.postImage}
              resizeMode="cover"
            />

            <View style={styles.postStats}>
              <Text style={styles.postStatText}>128 likes</Text>
              <Text style={styles.postStatText}>{comments.length} comments</Text>
            </View>

            <Card style={styles.actionCard}>
              <Pressable style={styles.actionBtn} onPress={handleLike}>
                <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? colors.error : colors.textPrimary} />
                <Text style={styles.actionBtnText}>Like</Text>
              </Pressable>
              <Pressable style={styles.actionBtn}>
                <Ionicons name="chatbubble-outline" size={22} color={colors.textPrimary} />
                <Text style={styles.actionBtnText}>Comment</Text>
              </Pressable>
              <Pressable style={styles.actionBtn} onPress={handleSave}>
                <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={saved ? colors.primary : colors.textPrimary} />
                <Text style={styles.actionBtnText}>Save</Text>
              </Pressable>
              <Pressable style={styles.actionBtn}>
                <Ionicons name="share-outline" size={22} color={colors.textPrimary} />
                <Text style={styles.actionBtnText}>Share</Text>
              </Pressable>
            </Card>

            <Text style={styles.commentsTitle}>Comments</Text>
          </View>
        }
        ListFooterComponent={
          comments.length === 0 ? (
            <Text style={styles.noComments}>No comments yet. Be the first!</Text>
          ) : null
        }
      />

      <View style={styles.commentInputRow}>
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Write a comment..."
          placeholderTextColor={colors.textMuted}
          style={styles.commentInput}
          onSubmitEditing={handleAddComment}
          returnKeyType="send"
        />
        <Pressable onPress={handleAddComment} disabled={!commentText.trim()} accessibilityLabel="Send comment">
          <Ionicons name="send" size={22} color={commentText.trim() ? colors.primary : colors.textDisabled} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  content: { padding: spacing.md, paddingBottom: 100 },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  userName: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  postTime: { ...typography.caption, color: colors.textMuted },
  postCaption: { ...typography.body, color: colors.textPrimary, marginBottom: spacing.md },
  postImage: { width: '100%', height: 300, borderRadius: borderRadius.md, marginBottom: spacing.md },
  postStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  postStatText: { ...typography.bodySmall, color: colors.textSecondary },
  actionCard: { flexDirection: 'row', justifyContent: 'space-around', padding: spacing.sm, marginBottom: spacing.lg },
  actionBtn: { alignItems: 'center', paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  actionBtnText: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  commentsTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  noComments: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg },
  comment: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  commentContent: { flex: 1 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commentUser: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600' },
  commentTime: { ...typography.tiny, color: colors.textMuted },
  commentText: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  commentActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  commentAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentActionText: { ...typography.tiny, color: colors.textMuted },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  commentInput: { flex: 1, ...typography.bodySmall, color: colors.textPrimary, backgroundColor: colors.surfaceTertiary, borderRadius: borderRadius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, maxHeight: 40 },
});
