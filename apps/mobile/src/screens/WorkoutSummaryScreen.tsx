import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Easing, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius, motion } from '../theme';
import { PremiumCard } from '../components/PremiumCard';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ProgressRing } from '../components/ProgressRing';
import { Confetti } from '../components/Confetti';
import { useWorkoutStore } from '../store/workoutStore';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutSummary'>;

export default function WorkoutSummaryScreen({ navigation, route }: Props) {
  const { workoutId } = route.params;
  const { currentSession: session, isLoading, loadCurrentSession } = useWorkoutStore();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    loadCurrentSession();
  }, []);

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroScale = useRef(new Animated.Value(0.92)).current;
  const metricsOpacities = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const metricsTranslateYs = [
    useRef(new Animated.Value(12)).current,
    useRef(new Animated.Value(12)).current,
    useRef(new Animated.Value(12)).current,
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    Animated.parallel([
      Animated.timing(heroOpacity, { toValue: 1, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(heroScale, { toValue: 1, friction: 7, tension: 40, useNativeDriver: true }),
    ]).start();
    [0, 1, 2].forEach((i) => {
      Animated.sequence([
        Animated.delay(i * 100),
        Animated.parallel([
          Animated.timing(metricsOpacities[i], { toValue: 1, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(metricsTranslateYs[i], { toValue: 0, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]),
      ]).start();
    });
    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    // Share logic
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const summary = {
    workoutName: session?.name || 'Workout Complete',
    duration: session?.duration || 0,
    setsCompleted: session?.exercises?.length || 0,
    xpEarned: 0,
    caloriesBurned: 0,
  };

  return (
    <View style={styles.container}>
      {showConfetti && <Confetti count={30} />}

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: heroOpacity, transform: [{ scale: heroScale }] }}>
          <PremiumCard variant="gradient" style={styles.heroCard}>
            <Text style={styles.celebrationEmoji}>🏆</Text>
            <Text style={styles.workoutName}>{summary.workoutName}</Text>
            <Badge label={`+${summary.xpEarned} XP`} variant="success" />
          </PremiumCard>
        </Animated.View>

        <View style={styles.metricsGrid}>
          <Animated.View style={{ opacity: metricsOpacities[0], transform: [{ translateY: metricsTranslateYs[0] }] }}>
            <PremiumCard variant="elevated" style={styles.metricCard}>
              <Text style={styles.metricValue}>{summary.duration}</Text>
              <Text style={styles.metricLabel}>Minutes</Text>
              <ProgressRing progress={85} size={60} />
            </PremiumCard>
          </Animated.View>

          <Animated.View style={{ opacity: metricsOpacities[1], transform: [{ translateY: metricsTranslateYs[1] }] }}>
            <PremiumCard variant="elevated" style={styles.metricCard}>
              <Text style={styles.metricValue}>{summary.setsCompleted}</Text>
              <Text style={styles.metricLabel}>Sets</Text>
              <ProgressRing progress={100} size={60} color={colors.success} />
            </PremiumCard>
          </Animated.View>

          <Animated.View style={{ opacity: metricsOpacities[2], transform: [{ translateY: metricsTranslateYs[2] }] }}>
            <PremiumCard variant="elevated" style={styles.metricCard}>
              <Text style={styles.metricValue}>{summary.caloriesBurned}</Text>
              <Text style={styles.metricLabel}>Calories</Text>
              <ProgressRing progress={75} size={60} color={colors.accent} />
            </PremiumCard>
          </Animated.View>
        </View>

        <Button title="Share" variant="primary" onPress={handleShare} style={styles.shareButton} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  heroSection: { marginBottom: spacing.xl },
  heroCard: { alignItems: 'center', padding: spacing.xl },
  celebrationEmoji: { fontSize: 48 },
  workoutName: { ...typography.h3, color: colors.textPrimary, marginTop: spacing.md },
  metricsGrid: { flexDirection: 'row', gap: spacing.sm },
  metricCard: { flex: 1, alignItems: 'center', padding: spacing.md },
  metricValue: { ...typography.h2, color: colors.textPrimary },
  metricLabel: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.xs },
  shareButton: { marginTop: spacing.xl },
});
