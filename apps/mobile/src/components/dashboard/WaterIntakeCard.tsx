import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import { colors, spacing } from '../../theme';

interface WaterIntakeCardProps {
  current: number;
  goal: number;
}

export function WaterIntakeCard({ current, goal }: WaterIntakeCardProps) {
  const cups = Math.round(current / 250);

  return (
    <Card>
      <Text style={styles.title}>Water Intake</Text>
      <View style={styles.content}>
        <Text style={styles.value}>{cups}</Text>
        <Text style={styles.unit}>cups</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textSecondary, fontSize: 14 },
  content: { flexDirection: 'row', alignItems: 'baseline', marginTop: spacing.xs },
  value: { color: colors.textPrimary, fontSize: 24, fontWeight: '700' },
  unit: { color: colors.textMuted, fontSize: 16, marginLeft: spacing.xs },
});