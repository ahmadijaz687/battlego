import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import { colors, spacing } from '../../theme';

interface ActiveMinutesCardProps {
  current: number;
  goal: number;
}

export function ActiveMinutesCard({ current, goal }: ActiveMinutesCardProps) {
  return (
    <Card>
      <Text style={styles.title}>Active Minutes</Text>
      <View style={styles.content}>
        <Text style={styles.value}>{current}</Text>
        <Text style={styles.unit}>/{goal}</Text>
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