import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, Animated } from 'react-native';
import { colors, spacing, typography, borderRadius, motion } from '../theme';

interface ListItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
}

export function ListItem({ title, subtitle, onPress, leading, trailing, style, disabled = false }: ListItemProps) {
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.timing(scale, { toValue: 0.98, duration: motion.duration.fast, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: motion.duration.fast, useNativeDriver: true }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      <Animated.View style={[styles.container, style, { transform: [{ scale }] }]}>
        {leading && <View style={styles.leading}>{leading}</View>}
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {trailing && <View style={styles.trailing}>{trailing}</View>}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  leading: { marginRight: spacing.md },
  content: { flex: 1 },
  title: { ...typography.body, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textMuted },
  trailing: { marginLeft: spacing.sm },
});