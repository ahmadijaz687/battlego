import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, PressableProps, ViewStyle, Animated, ActivityIndicator, StyleProp } from 'react-native';
import { colors, borderRadius, spacing, motion } from '../theme';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
}

export function Button({ title, variant = 'primary', size = 'md', fullWidth = false, style, onPress, disabled, loading, ...props }: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!loading && !disabled) {
      Animated.spring(scale, { toValue: 0.96, friction: 8, tension: 100, useNativeDriver: true }).start();
    }
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }).start();
  };

  const variants: Record<string, ViewStyle> = {
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.secondary },
    outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.border },
    ghost: { backgroundColor: 'transparent' },
    glass: { backgroundColor: colors.surfaceGlass, borderWidth: 1, borderColor: colors.border },
    danger: { backgroundColor: colors.error },
    success: { backgroundColor: colors.success },
  };

  const sizes: Record<string, ViewStyle> = {
    sm: { paddingVertical: 10, paddingHorizontal: 16, minWidth: 80 },
    md: { paddingVertical: 14, paddingHorizontal: 20, minWidth: 120 },
    lg: { paddingVertical: 18, paddingHorizontal: 24, minWidth: 160 },
  };

  const textVariants: Record<string, { color: string }> = {
    primary: { color: '#FFFFFF' },
    secondary: { color: colors.secondary },
    outline: { color: colors.textPrimary },
    ghost: { color: colors.primary },
    glass: { color: colors.textPrimary },
    danger: { color: '#FFFFFF' },
    success: { color: '#FFFFFF' },
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={loading ? undefined : onPress}
      disabled={disabled || loading}
      accessibilityLabel={loading ? `${title} loading` : title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      {...props}
    >
      <Animated.View
        style={[
          styles.base,
          variants[variant],
          sizes[size],
          fullWidth && styles.fullWidth,
          (disabled || loading) && styles.disabled,
          { transform: [{ scale }] },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textVariants[variant].color} />
        ) : (
          <Text style={[styles.text, textVariants[variant]]}>{title}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: borderRadius.button, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.4 },
  text: { fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});
