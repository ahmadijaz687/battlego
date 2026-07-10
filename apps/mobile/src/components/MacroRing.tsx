import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressRing } from './ProgressRing';
import { colors, spacing, typography } from '../theme';

interface MacroRingProps {
  label: string;
  value: number;
  max: number;
}

export function MacroRing({ label, value, max }: MacroRingProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  const color = label === 'Protein' ? colors.secondary : label === 'Carbs' ? colors.accent : colors.warning;

  return (
    <View style={styles.container}>
      <ProgressRing size={52} strokeWidth={5} progress={percent} color={color}>
        <Text style={styles.percent}>{percent}%</Text>
      </ProgressRing>
      <View style={styles.meta}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}{label === 'Protein' ? 'g' : 'g'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  meta: { flex: 1 },
  label: { ...typography.caption, color: colors.textSecondary, textTransform: 'uppercase' },
  value: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  percent: { fontSize: 12, fontWeight: '800', color: colors.textPrimary },
});
