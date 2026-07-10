import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Card } from './Card';
import { Tag } from './Tag';

interface WorkoutCardProps {
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  calories: number;
  exerciseCount: number;
  onPress?: () => void;
  style?: ViewStyle;
}

const difficultyColor: Record<string, 'success' | 'warning' | 'error'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
};

export function WorkoutCard({ name, difficulty, duration, calories, exerciseCount, onPress, style }: WorkoutCardProps) {
  return (
    <Card style={[styles.card, style]} variant="glass">
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Tag label={difficulty} variant={difficultyColor[difficulty]} />
      </View>
      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaValue}>{duration}min</Text>
          <Text style={styles.metaLabel}>Duration</Text>
        </View>
        <View style={styles.metaDivider} />
        <View style={styles.metaItem}>
          <Text style={styles.metaValue}>{calories}</Text>
          <Text style={styles.metaLabel}>Calories</Text>
        </View>
        <View style={styles.metaDivider} />
        <View style={styles.metaItem}>
          <Text style={styles.metaValue}>{exerciseCount}</Text>
          <Text style={styles.metaLabel}>Exercises</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {},
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  name: { ...typography.h4, color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  metaItem: { alignItems: 'center' },
  metaValue: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '700' },
  metaLabel: { ...typography.tiny, color: colors.textMuted, textTransform: 'uppercase' },
  metaDivider: { width: 1, height: 24, backgroundColor: colors.border },
});
