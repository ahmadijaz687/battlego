import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography } from '../theme';
import { PremiumCard } from '../components/PremiumCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ProgressBar } from '../components/ProgressBar';
import { useWorkoutStore } from '../store/workoutStore';
import type { WorkoutAnalytics } from '../types/workout';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Analytics'>;

export default function AnalyticsScreen({ navigation }: Props) {
  const { analytics: data, isLoading, error, loadAnalytics } = useWorkoutStore();

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Analytics</Text>
      </View>

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : !data ? (
        <EmptyState icon="📊" title="No analytics data yet" description="Complete workouts to see your progress" />
      ) : (
        <>
          <View style={styles.statsGrid}>
            <PremiumCard variant="glass" style={styles.statCard}>
              <Text style={styles.statValue}>{data.weeklyVolume}</Text>
              <Text style={styles.statLabel}>Weekly Volume</Text>
            </PremiumCard>
            <PremiumCard variant="glass" style={styles.statCard}>
              <Text style={styles.statValue}>{data.consistencyScore}%</Text>
              <Text style={styles.statLabel}>Consistency</Text>
            </PremiumCard>
            <PremiumCard variant="glass" style={styles.statCard}>
              <Text style={styles.statValue}>{data.workoutFrequency}x</Text>
              <Text style={styles.statLabel}>Per Week</Text>
            </PremiumCard>
          </View>

          <PremiumCard variant="glass" style={styles.balanceCard}>
            <Text style={styles.cardTitle}>Muscle Balance</Text>
            {Object.entries(data.muscleBalance).map(([muscle, percent]) => (
              <View key={muscle} style={styles.muscleRow}>
                <Text style={styles.muscleName}>{muscle}</Text>
                <ProgressBar progress={percent} height={8} color={colors.primary} />
              </View>
            ))}
          </PremiumCard>

          <PremiumCard variant="glass" style={styles.progressCard}>
            <Text style={styles.cardTitle}>Strength Progress</Text>
            {data.strengthProgress.map((p) => (
              <View key={p.exercise} style={styles.progressRow}>
                <Text style={styles.exerciseName}>{p.exercise}</Text>
                <Text style={styles.progressValue}>{p.previous} → {p.current}</Text>
              </View>
            ))}
          </PremiumCard>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  error: { color: colors.secondary, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: { flex: 1, alignItems: 'center', padding: spacing.md },
  statValue: { color: colors.primary, fontSize: 24, fontWeight: '700' },
  statLabel: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.xs },
  balanceCard: { marginBottom: spacing.lg, padding: spacing.md },
  cardTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '600', marginBottom: spacing.md },
  muscleRow: { marginBottom: spacing.sm },
  muscleName: { color: colors.textSecondary, marginBottom: spacing.xs, textTransform: 'capitalize' },
  progressCard: { padding: spacing.md },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  exerciseName: { color: colors.textPrimary },
  progressValue: { color: colors.success },
});