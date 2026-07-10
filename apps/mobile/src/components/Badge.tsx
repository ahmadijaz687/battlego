import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'primary';
  size?: 'sm' | 'md';
}

export function Badge({ label, variant = 'default', size = 'md' }: BadgeProps) {
  const bgMap: Record<string, string> = {
    default: 'rgba(255,255,255,0.08)',
    success: 'rgba(0,255,163,0.15)',
    warning: 'rgba(255,178,32,0.15)',
    error: 'rgba(255,71,87,0.15)',
    primary: 'rgba(255,59,59,0.15)',
  };

  const colorMap: Record<string, string> = {
    default: colors.textSecondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    primary: colors.primary,
  };

  const borderMap: Record<string, string> = {
    default: colors.border,
    success: 'rgba(0,255,163,0.35)',
    warning: 'rgba(255,178,32,0.35)',
    error: 'rgba(255,71,87,0.35)',
    primary: 'rgba(255,59,59,0.35)',
  };

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: bgMap[variant], borderColor: borderMap[variant] },
        size === 'sm' && styles.sm,
        size === 'md' && styles.md,
      ]}
    >
      <Text style={[styles.text, { color: colorMap[variant] }, size === 'sm' && styles.textSm]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: borderRadius.full, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  sm: { paddingHorizontal: 8, paddingVertical: 3 },
  md: { paddingHorizontal: 10, paddingVertical: 4 },
  text: { ...typography.caption, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  textSm: { fontSize: 11 },
});
