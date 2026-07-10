import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import { colors, spacing } from '../../theme';

interface StepsCardProps {
  current: number;
  goal: number;
}

export function StepsCard({ current, goal }: StepsCardProps) {
  const progress = (current / goal) * 100;

  return (
    <Card>
      <Text style={styles.title}>Steps</Text>
      <View style={styles.content}>
        <Text style={styles.value}>{current.toLocaleString()}</Text>
        <Text style={styles.unit}>/{goal.toLocaleString()}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textSecondary, fontSize: 14 },
  content: { flexDirection: 'row', alignItems: 'baseline', marginTop: spacing.xs },
  value: { color: colors.textPrimary, fontSize: 24, fontWeight: '700' },
  unit: { color: colors.textMuted, fontSize: 16 },
});