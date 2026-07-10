import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../Button';
import { colors, spacing, typography, borderRadius } from '../../../theme';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  icon = 'alert-circle-outline',
  style,
}: ErrorStateProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify().damping(14).stiffness(120)}
      style={[styles.container, style]}
      accessibilityRole="alert"
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={48} color={colors.error} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <View style={styles.actionContainer}>
          <Button
            title={retryLabel}
            onPress={onRetry}
            variant="primary"
            size="md"
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    minHeight: 260,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.error}1A`,
    borderWidth: 1,
    borderColor: `${colors.error}4D`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  actionContainer: {
    marginTop: spacing.lg,
  },
});
