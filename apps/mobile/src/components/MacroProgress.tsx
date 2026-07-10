import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../theme';

interface MacroProgressProps {
  label: string;
  current: number;
  goal: number;
  color?: string;
  style?: ViewStyle;
}

export function MacroProgress({ label, current, goal, color = colors.primary, style }: MacroProgressProps) {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.values}>
          {Math.round(current)}/{goal}g
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  label: { color: colors.textSecondary, fontSize: 12 },
  values: { color: colors.textPrimary, fontSize: 12, fontWeight: '600' },
  track: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4 },
});