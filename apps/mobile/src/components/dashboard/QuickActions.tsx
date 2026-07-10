import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {  } from '../Card';
import { colors, spacing, borderRadius } from '../../theme';

interface QuickActionsProps {
  onActionPress: (action: string) => void;
}

const actions = [
  { id: 'workout', icon: '💪', label: 'Workout' },
  { id: 'battle', icon: '⚔️', label: 'Battle' },
  { id: 'food', icon: '🍎', label: 'Food' },
  { id: 'water', icon: '💧', label: 'Water' },
];

export function QuickActions({ onActionPress }: QuickActionsProps) {
  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <Pressable
          key={action.id}
          style={styles.action}
          onPress={() => onActionPress(action.id)}
        >
          <Text style={styles.icon}>{action.icon}</Text>
          <Text style={styles.label}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  action: { alignItems: 'center' },
  icon: { fontSize: 24 },
  label: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.xs },
});