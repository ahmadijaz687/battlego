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

const ENTRY_SPRING = { damping: 14, stiffness: 160, mass: 0.8 };
const EXIT_SPRING = { damping: 18, stiffness: 120, mass: 1 };

interface AchievementUnlockProps {
  visible: boolean;
  title: string;
  description: string;
  icon?: string;
  xpReward?: number;
  onFinish?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  delay: number;
}

export function AchievementUnlock({
  visible,
  title,
  description,
  icon = '🏆',
  xpReward,
  onFinish,
}: AchievementUnlockProps) {
  const scale = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const shimmerX = useSharedValue(-1);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (visible) {
      haptic.achievementUnlock();

      scale.value = withSpring(1, ENTRY_SPRING);
      glowOpacity.value = withDelay(
        200,
        withRepeat(
          withSequence(
            withTiming(0.8, { duration: 800 }),
            withTiming(0.2, { duration: 800 })
          ),
          -1,
          false
        )
      );
      glowScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        false
      );
      shimmerX.value = withDelay(
        400,
        withTiming(1, { duration: 1000, easing: Easing.linear })
      );

      const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 280 - 140,
        y: -(Math.random() * 350 + 80),
        rotation: Math.random() * 540 - 270,
        scale: 0.5 + Math.random() * 0.8,
        color: [colors.warning, colors.accentYellow, colors.primary, colors.success][i % 4],
        delay: Math.random() * 300 + 100,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        scale.value = withSpring(0, EXIT_SPRING);
        glowOpacity.value = withTiming(0, { duration: 250 });
        glowScale.value = withTiming(0.8, { duration: 250 });
        setTimeout(() => onFinish?.(), 350);
      }, 3000);

      return () => {
        clearTimeout(timer);
        scale.value = 0;
        glowOpacity.value = 0;
        glowScale.value = 1;
        shimmerX.value = -1;
      };
    }
  }, [visible]);

  if (!visible) return null;

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
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

      <Animated.View style={[styles.glow, glowStyle]} />

      <Animated.View style={[styles.card, cardStyle]}>
        <View style={styles.badgeContainer}>
          <Animated.View style={[styles.badgeGlow, glowStyle]} />
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>{icon}</Text>
          </View>
        </View>

        <View style={styles.unlockedTag}>
          <Text style={styles.unlockedText}>ACHIEVEMENT UNLOCKED</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {xpReward && (
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{xpReward} XP</Text>
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
}

function ParticleView({ particle }: { particle: Particle }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      particle.delay,
      withTiming(particle.y, { duration: 1200, easing: Easing.out(Easing.quad) })
    );
    opacity.value = withDelay(
      particle.delay,
      withSequence(
        withTiming(0.9, { duration: 100 }),
        withTiming(0, { duration: 900, easing: Easing.in(Easing.quad) })
      )
    );
    rotate.value = withDelay(
      particle.delay,
      withTiming(particle.rotation, { duration: 1200 })
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
          top: '45%',
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
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.warning,
    opacity: 0.15,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.warning,
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: 280,
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  badgeContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    marginBottom: spacing.md,
  },
  badgeGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    backgroundColor: colors.warning,
    opacity: 0.3,
  },
  badge: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 36,
  },
  unlockedTag: {
    backgroundColor: 'rgba(255, 214, 10, 0.15)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  unlockedText: {
    ...typography.overline,
    color: colors.warning,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  xpBadge: {
    marginTop: spacing.md,
    backgroundColor: 'rgba(255, 31, 61, 0.12)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  xpText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '700',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
