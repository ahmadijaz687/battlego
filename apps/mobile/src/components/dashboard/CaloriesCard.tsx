import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {  } from '../StatisticCard';
import { Card } from '../Card';
import { colors, spacing } from '../../theme';

interface CaloriesCardProps {
  current: number;
  goal: number;
  burned: number;
}

export function CaloriesCard({ current, goal, burned }: CaloriesCardProps) {
  const progress = (current / goal) * 100;

  return (
    <Card>
      <Text style={styles.title}>Calories</Text>
      <View style={styles.content}>
        <Text style={styles.value}>{current}</Text>
        <Text style={styles.unit}>/{goal}</Text>
        <Text style={styles.burned}>🔥 {burned} burned</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textSecondary, fontSize: 14 },
  content: { flexDirection: 'row', alignItems: 'baseline', marginTop: spacing.xs },
  value: { color: colors.textPrimary, fontSize: 24, fontWeight: '700' },
  unit: { color: colors.textMuted, fontSize: 16 },
  burned: { color: colors.warning, fontSize: 12, marginLeft: spacing.sm },
});