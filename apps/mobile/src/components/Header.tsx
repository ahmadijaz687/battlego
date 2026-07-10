import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export function Header({ title, onBack, rightAction, style }: HeaderProps) {
  return (
    <View style={[styles.container, style]} accessibilityRole="header">
      {onBack ? (
        <Pressable onPress={onBack} style={styles.backButton} accessibilityLabel="Go back" accessibilityRole="button">
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.right}>{rightAction || <View style={styles.placeholder} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 52,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 24, color: colors.primary },
  title: { ...typography.h4, color: colors.textPrimary, flex: 1, textAlign: 'center' },
  right: { minWidth: 40, alignItems: 'flex-end' },
  placeholder: { width: 40 },
});
