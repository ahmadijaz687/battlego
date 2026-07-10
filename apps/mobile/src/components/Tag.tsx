import React from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../theme';

interface TagProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  onClose?: () => void;
  style?: ViewStyle;
}

export function Tag({ label, variant = 'default', onClose, style }: TagProps) {
  const variantStyles: Record<string, { bg: string; text: string; border: string }> = {
    default: { bg: colors.surfaceGlass, text: colors.textSecondary, border: colors.border },
    primary: { bg: colors.primarySoft, text: colors.primary, border: 'transparent' },
    success: { bg: 'rgba(48, 209, 88, 0.15)', text: colors.success, border: 'transparent' },
    warning: { bg: 'rgba(255, 214, 10, 0.15)', text: colors.warning, border: 'transparent' },
    error: { bg: 'rgba(255, 69, 58, 0.15)', text: colors.error, border: 'transparent' },
    info: { bg: 'rgba(10, 132, 255, 0.15)', text: colors.info, border: 'transparent' },
  };

  const current = variantStyles[variant];

  return (
    <View style={[styles.tag, { backgroundColor: current.bg, borderColor: current.border }, style]}>
      <Text style={[styles.label, { color: current.text }]}>{label}</Text>
      {onClose && (
        <Pressable onPress={onClose} hitSlop={8} accessibilityLabel={`Remove ${label}`} accessibilityRole="button">
          <Text style={[styles.close, { color: current.text }]}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: { ...typography.caption, fontWeight: '600', marginRight: spacing.xs },
  close: { fontSize: 10, fontWeight: '700', marginLeft: spacing.xs },
});
