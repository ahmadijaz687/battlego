import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: any;
  variant?: 'surface' | 'glass' | 'elevated';
}

export function Card({ children, style, variant = 'surface' }: CardProps) {
  return (
    <View style={[styles.base, variant === 'glass' && styles.glass, variant === 'elevated' && styles.elevated, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.card,
    padding: spacing.md,
  },
  surface: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  glass: {
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    backgroundColor: colors.surface,
    shadowColor: colors.glassShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});