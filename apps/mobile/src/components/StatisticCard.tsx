import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

interface StatisticCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: { value: number; positive: boolean };
  style?: ViewStyle;
}

export function StatisticCard({ title, value, unit, icon, trend, style }: StatisticCardProps) {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.valueRow}>
          <Text style={styles.value}>{value}</Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
        {trend && (
          <Text style={[styles.trend, trend.positive ? styles.positiveTrend : styles.negativeTrend]}>
            {trend.positive ? '+' : ''}{trend.value}%
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: { marginRight: spacing.sm },
  content: { flex: 1 },
  title: { color: colors.textSecondary, fontSize: 12, fontWeight: '500' },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  value: { color: colors.textPrimary, fontSize: 24, fontWeight: '700' },
  unit: { color: colors.textSecondary, fontSize: 14, marginLeft: 4 },
  trend: { fontSize: 12, marginTop: 4 },
  positiveTrend: { color: colors.success },
  negativeTrend: { color: colors.error },
});