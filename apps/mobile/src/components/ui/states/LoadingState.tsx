import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius } from '../../../theme';

interface LoadingStateProps {
  message?: string;
  variant?: 'spinner' | 'pulse' | 'skeleton';
  style?: ViewStyle;
}

export function LoadingState({
  message = 'Loading...',
  variant = 'spinner',
  style,
}: LoadingStateProps) {
  return (
    <View style={[styles.container, style]}>
      {variant === 'spinner' && <SpinnerVariant />}
      {variant === 'pulse' && <PulseVariant />}
      {variant === 'skeleton' && <SkeletonVariant />}

      {message && (
        <Animated.View entering={FadeIn.delay(300).duration(300)}>
          <Text style={styles.message}>{message}</Text>
        </Animated.View>
      )}
    </View>
  );
}

function SpinnerVariant() {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

function PulseVariant() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 800, easing: Easing.inOut(Easing.cubic) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.cubic) })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.4, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.pulseContainer}>
      <Animated.View style={[styles.pulseRing, pulseStyle]} />
      <View style={styles.pulseDot} />
    </View>
  );
}

function SkeletonVariant() {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.skeletonContainer}>
      <Animated.View style={[styles.skeletonBar, styles.skeletonBarLg, barStyle]} />
      <Animated.View style={[styles.skeletonBar, styles.skeletonBarMd, barStyle]} />
      <Animated.View style={[styles.skeletonBar, styles.skeletonBarSm, barStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  message: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  spinnerContainer: {
    marginBottom: spacing.md,
  },
  pulseContainer: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  pulseRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  pulseDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  skeletonContainer: {
    gap: spacing.sm,
    width: 200,
    marginBottom: spacing.md,
  },
  skeletonBar: {
    height: 12,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  skeletonBarLg: { width: '100%' },
  skeletonBarMd: { width: '75%' },
  skeletonBarSm: { width: '50%' },
});
