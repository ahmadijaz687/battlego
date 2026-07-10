import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import Avatar from '../Avatar';
import { colors, spacing } from '../../theme';
import { LeaderboardEntry } from '../../types/dashboard';

interface LeaderboardPreviewProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardPreview({ entries }: LeaderboardPreviewProps) {
  return (
    <Card>
      <Text style={styles.title}>Leaderboard</Text>
      {entries.slice(0, 3).map((entry, index) => (
        <View key={entry.user.id} style={styles.row}>
          <Text style={styles.rank}>#{entry.rank}</Text>
          <Avatar name={entry.user.name} size={32} />
          <Text style={styles.name}>{entry.user.name}</Text>
          <Text style={styles.xp}>{entry.xp} XP</Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textSecondary, fontSize: 14, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  rank: { color: colors.textMuted, fontSize: 14, width: 40 },
  name: { color: colors.textPrimary, fontSize: 14, flex: 1, marginLeft: spacing.sm },
  xp: { color: colors.primary, fontSize: 12 },
});