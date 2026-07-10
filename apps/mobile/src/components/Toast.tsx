import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors, spacing, typography, borderRadius, motion, zIndex } from '../theme';

interface ToastProps {
  visible: boolean;
  message: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  duration?: number;
  onDismiss: () => void;
  style?: ViewStyle;
}

export function Toast({ visible, message, variant = 'default', duration = 3000, onDismiss, style }: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: motion.duration.normal, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: motion.duration.normal, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, { toValue: -100, duration: motion.duration.fast, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: motion.duration.fast, useNativeDriver: true }),
        ]).start();
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const variantColors = {
    default: colors.surface,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
  };

  return (
    <Animated.View style={[styles.toast, { backgroundColor: variantColors[variant], transform: [{ translateY }], opacity }, style]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    left: spacing.md,
    right: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    zIndex: zIndex.toast,
  },
  message: { ...typography.body, color: colors.textPrimary },
});