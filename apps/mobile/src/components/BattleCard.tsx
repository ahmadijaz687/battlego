import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Card } from './Card';
import { Button } from './Button';
import { Tag } from './Tag';

interface BattleCardProps {
  title: string;
  status: 'open' | 'in_progress' | 'completed';
  participantsCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  date: string;
  onPress?: () => void;
  style?: ViewStyle;
}

const difficultyColor: Record<string, 'success' | 'warning' | 'error'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
};

const statusLabel: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export function BattleCard({ title, status, participantsCount, difficulty, date, onPress, style }: BattleCardProps) {
  return (
    <Card style={[styles.card, style]} variant="glass">
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Tag label={statusLabel[status]} variant={status === 'completed' ? 'success' : status === 'in_progress' ? 'primary' : 'default'} />
      </View>
      <View style={styles.meta}>
        <Text style={styles.metaText}>👥 {participantsCount} participants</Text>
        <Text style={styles.metaText}>📅 {date}</Text>
      </View>
      <View style={styles.footer}>
        <Tag label={difficulty} variant={difficultyColor[difficulty]} />
        {onPress && status === 'open' && <Button title="Join Battle" size="sm" onPress={onPress} />}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {},
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  title: { ...typography.h4, color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
  meta: { flexDirection: 'row', marginBottom: spacing.sm, gap: spacing.md },
  metaText: { ...typography.small, color: colors.textSecondary },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs },
});
