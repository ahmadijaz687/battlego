import React from 'react';
import { Pressable, StyleSheet, ViewStyle, Animated, View } from 'react-native';
import { colors, borderRadius, spacing, motion, iconSize } from '../theme';

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function IconButton({ 
  icon, 
  onPress, 
  variant = 'ghost', 
  size = 'md', 
  disabled = false,
  style,
  accessibilityLabel,
}: IconButtonProps) {
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.timing(scale, { toValue: 0.92, duration: motion.duration.fast, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: motion.duration.fast, useNativeDriver: true }).start();
  };

  const sizeValues = {
    sm: { size: iconSize.sm, padding: spacing.xs },
    md: { size: iconSize.md, padding: spacing.sm },
    lg: { size: iconSize.lg, padding: spacing.md },
  };

  const variantStyles: Record<string, ViewStyle> = {
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.secondary },
    ghost: { backgroundColor: 'transparent' },
    danger: { backgroundColor: colors.error },
  };

  const iconColor = variant === 'primary' || variant === 'danger' ? colors.background : variant === 'secondary' ? colors.secondary : colors.textPrimary;

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.base,
          variantStyles[variant],
          { padding: sizeValues[size].padding, transform: [{ scale }] },
          disabled && styles.disabled,
          style,
        ]}
      >
        <View style={{ width: sizeValues[size].size, height: sizeValues[size].size, alignItems: 'center', justifyContent: 'center' }}>
          <View />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: borderRadius.full, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.5 },
});