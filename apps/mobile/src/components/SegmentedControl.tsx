import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface SegmentedControlProps {
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
  style?: ViewStyle;
}

export function SegmentedControl({ options, value, onChange, style }: SegmentedControlProps) {
  return (
    <View style={[styles.container, style]}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          style={styles.segment}
          onPress={() => onChange(option.value)}
        >
          <View style={[styles.segmentBase, value === option.value && styles.selectedSegment]}>
            <Text style={[styles.label, value === option.value && styles.selectedLabel]}>{option.label}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
  },
  segment: { alignItems: 'center', justifyContent: 'center' },
  segmentBase: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  selectedSegment: { backgroundColor: colors.primary },
  label: { ...typography.caption, color: colors.textMuted, fontWeight: '600' },
  selectedLabel: { color: colors.background },
});