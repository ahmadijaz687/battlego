import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import { colors, spacing } from '../../theme';
import { UserStats } from '../../types/dashboard';

interface XPCardProps {
  stats: UserStats;
}

export function XPCard({ stats }: XPCardProps) {
  const progress = (stats.xp / (stats.xp + stats.xpToNextLevel)) * 100;

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>XP Progress</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.xpValue}>{stats.xp.toLocaleString()}</Text>
        <Text style={styles.xpLabel}>XP to Level {stats.level + 1}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.sm },
  title: { color: colors.textSecondary, fontSize: 14 },
  content: {},
  xpValue: { color: colors.primary, fontSize: 32, fontWeight: '700' },
  xpLabel: { color: colors.textMuted, fontSize: 12 },
});