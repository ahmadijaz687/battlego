import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Image as RNImage } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Card } from './Card';
import Avatar from './Avatar';

interface ProfileCardProps {
  coverUri?: string;
  avatarUri?: string;
  name: string;
  bio?: string;
  followers: number;
  following: number;
  workouts: number;
  style?: ViewStyle;
}

export function ProfileCard({ coverUri, avatarUri, name, bio, followers, following, workouts, style }: ProfileCardProps) {
  return (
    <Card style={[styles.card, style]} variant="elevated">
      {coverUri ? (
        <RNImage source={{ uri: coverUri }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder]} />
      )}
      <View style={styles.avatarContainer}>
        <Avatar uri={avatarUri} name={name} size="xl" />
      </View>
      <Text style={styles.name}>{name}</Text>
      {bio && <Text style={styles.bio} numberOfLines={2}>{bio}</Text>}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{followers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{following.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{workouts.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 0, overflow: 'hidden', alignItems: 'center' },
  cover: { width: '100%', height: 120 },
  coverPlaceholder: { backgroundColor: colors.surfaceTertiary },
  avatarContainer: { marginTop: -32, marginBottom: spacing.sm },
  name: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.xs },
  bio: { ...typography.small, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: spacing.md, marginBottom: spacing.md },
  stats: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.lg, width: '100%', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { ...typography.h4, color: colors.textPrimary, fontWeight: '700' },
  statLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: colors.border },
});
