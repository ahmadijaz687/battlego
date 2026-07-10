import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

interface GlassContainerProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  blurAmount?: number;
}

export function GlassContainer({ children, style }: GlassContainerProps) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
});