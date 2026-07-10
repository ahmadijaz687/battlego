import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle, Pressable } from 'react-native';
import { colors, spacing, typography, borderRadius, motion, zIndex } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface SnackbarProps {
  visible: boolean;
  message: string;
  action?: { label: string; onPress: () => void };
  duration?: number;
  onDismiss: () => void;
  style?: ViewStyle;
}

export function Snackbar({ visible, message, action, duration = 4000, onDismiss, style }: SnackbarProps) {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: motion.duration.normal, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: motion.duration.normal, useNativeDriver: true }),
      ]).start();

      if (duration > 0) {
        const timer = setTimeout(() => {
          Animated.parallel([
            Animated.timing(translateY, { toValue: 100, duration: motion.duration.fast, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: motion.duration.fast, useNativeDriver: true }),
          ]).start();
          onDismiss();
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [visible]);

  return (
    <Animated.View style={[styles.snackbar, { transform: [{ translateY }], opacity }, style]}>
      <Text style={styles.message}>{message}</Text>
      {action && (
        <Pressable onPress={action.onPress}>
          <Text style={styles.action}>{action.label}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    bottom: 40,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceGlassStrong,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: zIndex.toast,
  },
  message: { ...typography.bodySmall, color: colors.textPrimary, flex: 1 },
  action: { ...typography.button, color: colors.primary },
});