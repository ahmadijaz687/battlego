import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { haptic } from '../../services/hapticService';

const ENTRY_SPRING = { damping: 14, stiffness: 180, mass: 0.8 };
const EXIT_SPRING = { damping: 18, stiffness: 120, mass: 1 };

interface PRCelebrationProps {
  visible: boolean;
  exerciseName: string;
  previousPR: number;
  newPR: number;
  unit: string;
  onFinish?: () => void;
}

export function PRCelebration({
  visible,
  exerciseName,
  previousPR,
  newPR,
  unit,
  onFinish,
}: PRCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const scale = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const arrowBounce = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      haptic.prDetected();

      scale.value = withSpring(1, ENTRY_SPRING);
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.3, { duration: 600 })
        ),
        -1,
        false
      );
      arrowBounce.value = withDelay(
        400,
        withSpring(1, { damping: 8, stiffness: 200, mass: 0.6 })
      );

      const newParticles: Particle[] = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        x: Math.random() * 360 - 180,
        y: -(Math.random() * 450 + 80),
        rotation: Math.random() * 720 - 360,
        scale: 0.4 + Math.random() * 1.2,
        color: [colors.primary, colors.warning, colors.success, colors.secondary, colors.primaryHover, colors.accentOrange][i % 6],
        delay: Math.random() * 250,
        width: 6 + Math.random() * 8,
        height: 4 + Math.random() * 12,
        shape: i % 3 === 0 ? 'rect' : 'circle',
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        scale.value = withSpring(0, EXIT_SPRING);
        glowOpacity.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
        arrowBounce.value = withTiming(0, { duration: 200 });
        setTimeout(() => onFinish?.(), 350);
      }, 3000);

      return () => {
        clearTimeout(timer);
        scale.value = 0;
        glowOpacity.value = 0;
        arrowBounce.value = 0;
      };
    }
  }, [visible]);

  if (!visible) return null;

  const gain = newPR - previousPR;

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: arrowBounce.value }],
    opacity: arrowBounce.value,
  }));

  return (
    <Animated.View
      style={styles.overlay}
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
      pointerEvents="none"
    >
      {particles.map((p) => (
        <ParticleView key={p.id} particle={p} />
      ))}

      <Animated.View style={[styles.card, cardStyle]}>
        <View style={styles.glowRing}>
          <Text style={styles.prLabel}>NEW PR!</Text>
        </View>
        <Text style={styles.exercise}>{exerciseName}</Text>
        <View style={styles.prRow}>
          <View style={styles.prItem}>
            <Text style={styles.prValue}>{previousPR}</Text>
            <Text style={styles.prUnit}>{unit}</Text>
            <Text style={styles.prSubtext}>Previous</Text>
          </View>
          <Animated.View style={[styles.arrow, arrowStyle]}>
            <Text style={styles.arrowText}>{'→'}</Text>
          </Animated.View>
          <View style={[styles.prItem, styles.prItemNew]}>
            <Text style={[styles.prValue, styles.prValueNew]}>{newPR}</Text>
            <Text style={[styles.prUnit, styles.prUnitNew]}>{unit}</Text>
            <Text style={[styles.prSubtext, styles.prSubtextNew]}>New PR</Text>
          </View>
        </View>
        {gain > 0 && (
          <View style={styles.gainBadge}>
            <Text style={styles.gainText}>+{gain} {unit}</Text>
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  delay: number;
  width: number;
  height: number;
  shape: 'rect' | 'circle';
}

function ParticleView({ particle }: { particle: Particle }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      particle.delay,
      withTiming(particle.y, { duration: 1400, easing: Easing.out(Easing.quad) })
    );
    opacity.value = withDelay(
      particle.delay,
      withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 1100, easing: Easing.in(Easing.quad) })
      )
    );
    rotate.value = withDelay(
      particle.delay,
      withTiming(particle.rotation, { duration: 1400, easing: Easing.out(Easing.cubic) })
    );

    return () => {
      translateY.value = 0;
      opacity.value = 0;
      rotate.value = 0;
    };
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value } as any,
      { rotate: `${rotate.value}deg` } as any,
      { scale: particle.scale } as any,
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          backgroundColor: particle.color,
          left: '50%',
          top: '40%',
          width: particle.width,
          height: particle.height,
          borderRadius: particle.shape === 'circle' ? particle.width / 2 : 2,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(5,5,5,0.85)',
    zIndex: 2000,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: 280,
  },
  glowRing: {
    backgroundColor: colors.primarySoft,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  prLabel: {
    ...typography.overline,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
  exercise: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  prItem: {
    alignItems: 'center',
  },
  prItemNew: {
    backgroundColor: colors.primarySoft,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  prValue: {
    ...typography.kpi,
    color: colors.textSecondary,
    fontSize: 28,
  },
  prValueNew: {
    color: colors.primary,
  },
  prUnit: {
    ...typography.small,
    color: colors.textMuted,
  },
  prUnitNew: {
    color: colors.primaryHover,
  },
  prSubtext: {
    ...typography.tiny,
    color: colors.textMuted,
    marginTop: 2,
  },
  prSubtextNew: {
    color: colors.primaryHover,
  },
  arrow: {
    marginHorizontal: spacing.xs,
  },
  arrowText: {
    ...typography.h2,
    color: colors.primary,
  },
  gainBadge: {
    marginTop: spacing.md,
    backgroundColor: 'rgba(61, 220, 132, 0.15)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.success,
  },
  gainText: {
    ...typography.small,
    color: colors.success,
    fontWeight: '700',
  },
  particle: {
    position: 'absolute',
  },
});
