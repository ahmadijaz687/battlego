import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Button } from './Button';
import { colors, spacing } from '../theme';

interface OfflineStateProps {
  onRetry?: () => void;
  style?: ViewStyle;
}

export function OfflineState({ onRetry, style }: OfflineStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>📡</Text>
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.message}>You are offline. Check your connection and try again.</Text>
      {onRetry && (
        <Button title="Retry" onPress={onRetry} style={styles.button} />
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
  message: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.sm, textAlign: 'center' },
  button: { marginTop: spacing.lg },
});