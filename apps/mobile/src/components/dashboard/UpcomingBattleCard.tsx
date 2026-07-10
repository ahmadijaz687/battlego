import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import { colors, spacing } from '../../theme';
import { UpcomingBattle } from '../../types/dashboard';

interface UpcomingBattleCardProps {
  battle: UpcomingBattle;
}

export function UpcomingBattleCard({ battle }: UpcomingBattleCardProps) {
  return (
    <Card>
      <Text style={styles.title}>Upcoming Battle</Text>
      <View style={styles.opponentRow}>
        <Text style={styles.opponent}>{battle.opponent.name}</Text>
        <Text style={styles.vs}>VS</Text>
        <Text style={styles.you}>You</Text>
      </View>
      <Text style={styles.workout}>{battle.workout}</Text>
      <View style={styles.info}>
        <Text style={styles.time}>{battle.time}</Text>
        <Text style={styles.prize}>🏆 {battle.prize}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textSecondary, fontSize: 14 },
  opponentRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  opponent: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
  vs: { color: colors.primary, fontSize: 12, marginHorizontal: spacing.sm },
  you: { color: colors.textSecondary, fontSize: 16 },
  workout: { color: colors.textMuted, fontSize: 14, marginTop: spacing.xs },
  info: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  time: { color: colors.primary, fontSize: 12 },
  prize: { color: colors.warning, fontSize: 12 },
});