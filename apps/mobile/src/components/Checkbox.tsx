import React from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../theme';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Checkbox({ label, checked, onPress, disabled = false, style }: CheckboxProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[styles.container, disabled && styles.disabled, style]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[styles.label, checked && styles.labelChecked, disabled && styles.labelDisabled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs },
  disabled: { opacity: 0.4 },
  box: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.xs,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  boxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkmark: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', lineHeight: 16 },
  label: { ...typography.bodySmall, color: colors.textPrimary, flex: 1 },
  labelChecked: { color: colors.textPrimary },
  labelDisabled: { color: colors.textDisabled },
});
