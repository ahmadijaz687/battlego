import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import { colors, spacing } from '../../theme';
import { WorkoutSummary } from '../../types/dashboard';

interface WorkoutSummaryCardProps {
  summary: WorkoutSummary;
}

export function WorkoutSummaryCard({ summary }: WorkoutSummaryCardProps) {
  return (
    <Card>
      <Text style={styles.title}>Workouts</Text>
      <Text style={styles.value}>{summary.weeklyWorkouts}x this week</Text>
      <Text style={styles.duration}>{summary.totalMinutes} min total</Text>
      <Text style={styles.favorite}>Favorite: {summary.favoriteType}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textSecondary, fontSize: 14 },
  value: { color: colors.textPrimary, fontSize: 20, fontWeight: '600', marginTop: spacing.xs },
  duration: { color: colors.textMuted, fontSize: 14 },
  favorite: { color: colors.primary, fontSize: 12, marginTop: spacing.xs },
});