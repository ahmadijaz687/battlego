import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../theme';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  inset?: number;
  style?: ViewStyle;
}

export function Divider({ orientation = 'horizontal', thickness = 1, color, inset = 0, style }: DividerProps) {
  return (
    <View
      style={[
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        {
          [orientation === 'horizontal' ? 'height' : 'width']: thickness,
          backgroundColor: color || colors.border,
          marginVertical: orientation === 'horizontal' ? spacing.sm : 0,
          marginHorizontal: orientation === 'vertical' ? spacing.sm : 0,
          marginLeft: orientation === 'horizontal' ? inset : 0,
        },
        style,
      ]}
      accessibilityRole="none"
    />
  );
}

const styles = StyleSheet.create({
  horizontal: { width: '100%' },
  vertical: { height: '100%' },
});
