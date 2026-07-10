import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../theme';

interface SliderProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
  showValue?: boolean;
  style?: ViewStyle;
}

export function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled = false,
  showValue = true,
  style,
}: SliderProps) {
  const fraction = Math.min(Math.max((value - min) / (max - min), 0), 1);

  const handleLayout = useCallback(() => {
    // On native, we'd use a PanResponder or a library like @react-native-community/slider.
    // This component provides the visual shell consistent with the design system.
  }, []);

  return (
    <View style={[styles.container, disabled && styles.disabled, style]} onLayout={handleLayout}>
      {(label || showValue) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showValue && <Text style={styles.value}>{value}</Text>}
        </View>
      )}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${fraction * 100}%` }]} />
      </View>
      <View style={styles.thumbRow}>
        <View style={[styles.thumb, { left: `${fraction * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.sm },
  disabled: { opacity: 0.4 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  label: { ...typography.bodySmall, color: colors.textPrimary },
  value: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceTertiary,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  thumbRow: { position: 'relative', height: 0 },
  thumb: {
    position: 'absolute',
    top: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.background,
    marginLeft: -12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
    }),
  },
});
