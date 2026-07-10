import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Button } from './Button';
import { colors, spacing } from '../theme';

interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  action?: { label: string; onPress: () => void };
  style?: ViewStyle;
  message?: string;
}

export function EmptyState({ icon, title, description, action, style, message }: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.title}>{title || message}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {action && (
        <Button title={action.label} onPress={action.onPress} style={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  icon: { fontSize: 48, marginBottom: spacing.md },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '600', textAlign: 'center' },
  description: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.sm, textAlign: 'center' },
  button: { marginTop: spacing.lg },
});