import React from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../theme';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  layout?: 'horizontal' | 'vertical';
  disabled?: boolean;
  style?: ViewStyle;
}

export function RadioGroup({ options, selectedValue, onSelect, layout = 'vertical', disabled = false, style }: RadioGroupProps) {
  return (
    <View style={[styles.container, layout === 'horizontal' && styles.horizontal, style]} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = selectedValue === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={disabled ? undefined : () => onSelect(option.value)}
            disabled={disabled}
            style={[styles.row, layout === 'horizontal' && styles.horizontalRow]}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled }}
            accessibilityLabel={option.label}
          >
            <View style={[styles.ring, selected && styles.ringSelected, disabled && styles.ringDisabled]}>
              {selected && <View style={[styles.dot, disabled && styles.dotDisabled]} />}
            </View>
            <Text style={[styles.label, selected && styles.labelSelected, disabled && styles.labelDisabled]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  horizontal: { flexDirection: 'row', flexWrap: 'wrap' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, marginRight: spacing.lg },
  horizontalRow: { marginRight: spacing.lg },
  ring: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  ringSelected: { borderColor: colors.primary },
  ringDisabled: { opacity: 0.4 },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  dotDisabled: { backgroundColor: colors.textDisabled },
  label: { ...typography.bodySmall, color: colors.textPrimary, flex: 1 },
  labelSelected: { color: colors.textPrimary },
  labelDisabled: { color: colors.textDisabled },
});
