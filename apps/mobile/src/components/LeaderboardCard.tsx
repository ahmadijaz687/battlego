import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Card } from './Card';
import Avatar from './Avatar';

interface LeaderboardCardProps {
  rank: number;
  name: string;
  avatarUri?: string;
  xp: number;
  level: number;
  wins: number;
  matches: number;
  isCurrentUser?: boolean;
  style?: ViewStyle;
}

export function LeaderboardCard({ rank, name, avatarUri, xp, level, wins, matches, isCurrentUser = false, style }: LeaderboardCardProps) {
  const winRate = matches > 0 ? Math.round((wins / matches) * 100) : 0;

  return (
    <Card style={[styles.card, isCurrentUser && styles.highlighted, style]} variant={isCurrentUser ? 'elevated' : 'glass'}>
      <View style={styles.content}>
        <Text style={[styles.rank, rank <= 3 && styles.topRank]}>{rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}</Text>
        <Avatar uri={avatarUri} name={name} size="sm" />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.level}>Level {level}</Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.statValue}>{xp.toLocaleString()}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.statValue}>{wins}</Text>
          <Text style={styles.statLabel}>Wins</Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.statValue}>{winRate}%</Text>
          <Text style={styles.statLabel}>Win Rate</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {},
  highlighted: { borderColor: colors.primary, borderWidth: 1 },
  content: { flexDirection: 'row', alignItems: 'center' },
  rank: { ...typography.h4, color: colors.textSecondary, width: 40, textAlign: 'center' },
  topRank: { fontSize: 24 },
  info: { flex: 1, marginLeft: spacing.sm },
  name: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600' },
  level: { ...typography.caption, color: colors.textSecondary },
  stats: { alignItems: 'center', marginLeft: spacing.md },
  statValue: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '700' },
  statLabel: { ...typography.tiny, color: colors.textMuted, textTransform: 'uppercase' },
});
