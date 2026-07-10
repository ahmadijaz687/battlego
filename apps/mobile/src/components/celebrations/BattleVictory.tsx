import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { haptic } from '../../services/hapticService';

const ENTRY_SPRING = { damping: 14, stiffness: 160, mass: 0.8 };
const EXIT_SPRING = { damping: 18, stiffness: 120, mass: 1 };

interface BattleStat {
  label: string;
  value: string;
  userValue?: string;
  opponentValue?: string;
}

interface BattleVictoryProps {
  visible: boolean;
  opponentName: string;
  workoutName: string;
  stats: BattleStat[];
  xpEarned: number;
  isWinner: boolean;
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

export function BattleVictory({
  visible,
  opponentName,
  workoutName,
  stats,
  xpEarned,
  isWinner,
  onFinish,
}: BattleVictoryProps) {
  const titleScale = useSharedValue(0);
  const statsOpacity = useSharedValue(0);
  const crownScale = useSharedValue(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (visible) {
      if (isWinner) {
        haptic.battleVictory();

        titleScale.value = withSpring(1, ENTRY_SPRING);
        crownScale.value = withDelay(
          300,
          withSpring(1, { damping: 10, stiffness: 200, mass: 0.6 })
        );

        const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
          id: i,
          x: Math.random() * 340 - 170,
          y: -(Math.random() * 400 + 100),
          rotation: Math.random() * 600 - 300,
          scale: 0.4 + Math.random() * 1,
          color: [colors.success, colors.warning, colors.accentYellow, colors.primary, colors.secondary][i % 5],
          delay: Math.random() * 400,
        }));
        setParticles(newParticles);
      } else {
        haptic.warning();
        titleScale.value = withSpring(1, ENTRY_SPRING);
      }

      statsOpacity.value = withDelay(
        600,
        withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
      );

      const timer = setTimeout(() => {
        titleScale.value = withSpring(0, EXIT_SPRING);
        statsOpacity.value = withTiming(0, { duration: 250 });
        crownScale.value = withTiming(0, { duration: 200 });
        setTimeout(() => onFinish?.(), 350);
      }, 5000);

      return () => {
        clearTimeout(timer);
        titleScale.value = 0;
        statsOpacity.value = 0;
        crownScale.value = 0;
      };
    }
  }, [visible]);

  if (!visible) return null;

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const statsStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
  }));

  const crownStyle = useAnimatedStyle(() => ({
    transform: [{ scale: crownScale.value }],
  }));

  return (
    <Animated.View
      style={styles.overlay}
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
      pointerEvents="none"
    >
      {isWinner && particles.map((p) => (
        <VictoryParticle key={p.id} particle={p} />
      ))}

      <Animated.View style={[styles.card, titleStyle]}>
        <View style={[styles.resultBadge, isWinner ? styles.winBadge : styles.loseBadge]}>
          <Animated.View style={isWinner ? crownStyle : undefined}>
            <Text style={styles.resultEmoji}>{isWinner ? '👑' : '💪'}</Text>
          </Animated.View>
          <Text style={[styles.resultText, isWinner ? styles.winText : styles.loseText]}>
            {isWinner ? 'VICTORY' : 'DEFEAT'}
          </Text>
        </View>

        <Text style={styles.vs}>
          {isWinner ? 'You beat' : 'Lost to'} {opponentName}
        </Text>
        <Text style={styles.workout}>{workoutName}</Text>

        <Animated.View style={[styles.statsContainer, statsStyle]}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statRow}>
              <Text style={[styles.statValue, styles.userStat]}>
                {stat.userValue || stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statValue, styles.opponentStat]}>
                {stat.opponentValue || stat.value}
              </Text>
            </View>
          ))}
        </Animated.View>

        <View style={styles.xpRow}>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{xpEarned} XP Earned</Text>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

function VictoryParticle({ particle }: { particle: Particle }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      particle.delay,
      withTiming(particle.y, { duration: 1600, easing: Easing.out(Easing.quad) })
    );
    opacity.value = withDelay(
      particle.delay,
      withSequence(
        withTiming(1, { duration: 80 }),
        withTiming(0, { duration: 1200, easing: Easing.in(Easing.quad) })
      )
    );
    rotate.value = withDelay(
      particle.delay,
      withTiming(particle.rotation, { duration: 1600 })
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
        styles.victoryParticle,
        {
          backgroundColor: particle.color,
          left: '50%',
          top: '35%',
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
    backgroundColor: 'rgba(5,5,5,0.9)',
    zIndex: 2000,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: 300,
  },
  resultBadge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  winBadge: {
    backgroundColor: 'rgba(61, 220, 132, 0.15)',
    borderWidth: 1.5,
    borderColor: colors.success,
  },
  loseBadge: {
    backgroundColor: 'rgba(255, 31, 61, 0.12)',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  resultEmoji: {
    fontSize: 40,
    textAlign: 'center',
  },
  resultText: {
    ...typography.overline,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  winText: {
    color: colors.success,
  },
  loseText: {
    color: colors.primary,
  },
  vs: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  workout: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  statsContainer: {
    width: '100%',
    gap: spacing.sm,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  statValue: {
    ...typography.small,
    fontWeight: '700',
    width: 80,
  },
  userStat: {
    color: colors.primary,
    textAlign: 'left',
  },
  opponentStat: {
    color: colors.textTertiary,
    textAlign: 'right',
  },
  xpRow: {
    marginTop: spacing.lg,
  },
  xpBadge: {
    backgroundColor: 'rgba(255, 31, 61, 0.12)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  xpText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },
  victoryParticle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
