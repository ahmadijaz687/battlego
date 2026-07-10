import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Card } from './Card';

interface AchievementCardProps {
  icon: string;
  title: string;
  description: string;
  progress?: number;
  maxProgress?: number;
  unlocked?: boolean;
  style?: ViewStyle;
}

export function AchievementCard({ icon, title, description, progress, maxProgress, unlocked = false, style }: AchievementCardProps) {
  const percent = progress != null && maxProgress ? Math.min(progress / maxProgress, 1) : 0;

  return (
    <Card style={[styles.card, unlocked && styles.unlocked, style]} variant="glass">
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.description} numberOfLines={2}>{description}</Text>
          {progress != null && maxProgress != null && !unlocked && (
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${percent * 100}%` }]} />
              </View>
              <Text style={styles.progressText}>{progress}/{maxProgress}</Text>
            </View>
          )}
          {unlocked && <Text style={styles.unlockedText}>✓ Unlocked</Text>}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {},
  unlocked: { borderColor: colors.success, borderWidth: 1 },
  content: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceGlassStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  icon: { fontSize: 24 },
  info: { flex: 1 },
  title: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600' },
  description: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceTertiary,
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: colors.accentOrange },
  progressText: { ...typography.tiny, color: colors.textMuted },
  unlockedText: { ...typography.caption, color: colors.success, fontWeight: '600', marginTop: spacing.xs },
});
