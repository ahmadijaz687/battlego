import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import { colors, spacing } from '../../theme';
import { UserStats } from '../../types/dashboard';

interface StreakCardProps {
  stats: UserStats;
}

export function StreakCard({ stats }: StreakCardProps) {
  return (
    <Card>
      <View style={styles.content}>
        <Text style={styles.streakIcon}>🔥</Text>
        <Text style={styles.streakValue}>{stats.streak}</Text>
        <Text style={styles.streakLabel}>Day Streak</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center' },
  streakIcon: { fontSize: 24 },
  streakValue: { color: colors.warning, fontSize: 28, fontWeight: '700', marginTop: spacing.xs },
  streakLabel: { color: colors.textMuted, fontSize: 12 },
});