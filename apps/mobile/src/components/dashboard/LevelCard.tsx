import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import { colors, spacing } from '../../theme';
import { UserStats } from '../../types/dashboard';

interface LevelCardProps {
  stats: UserStats;
}

export function LevelCard({ stats }: LevelCardProps) {
  return (
    <Card>
      <View style={styles.content}>
        <Text style={styles.levelBadge}>Lvl {stats.level}</Text>
        <Text style={styles.levelTitle}>Current Level</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center' },
  levelBadge: {
    color: colors.primary,
    fontSize: 48,
    fontWeight: '800',
  },
  levelTitle: { color: colors.textSecondary, fontSize: 14 },
});