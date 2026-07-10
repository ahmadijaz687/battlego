import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Easing, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius, motion } from '../theme';
import { useWorkoutStore } from '../store/workoutStore';
import { PremiumCard } from '../components/PremiumCard';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutSession'>;

interface SetData {
  reps: string;
  weight: string;
}

export default function WorkoutSessionScreen({ navigation, route }: Props) {
  const { workoutId } = route.params || {};
  const { currentSession: session, isLoading, error: sessionError, loadCurrentSession, completeSet: storeCompleteSet, completeWorkout: storeCompleteWorkout } = useWorkoutStore();

  const [timer, setTimer] = useState(0);
  const [completedSets, setCompletedSets] = useState<string[]>([]);
  const [setData, setSetData] = useState<Record<string, SetData>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentSession();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleCompleteSet = useCallback(async (setId: string) => {
    if (completedSets.includes(setId)) return;
    setCompletedSets(prev => [...prev, setId]);
    setError(null);
    try {
      storeCompleteSet(setId);
    } catch {
      setError('Failed to save set.');
    }
  }, [completedSets, storeCompleteSet]);

  const handleCompleteWorkout = async () => {
    setError(null);
    try {
      storeCompleteWorkout();
    } catch {
      setError('Failed to complete workout.');
    }
    navigation.navigate('WorkoutSummary', { workoutId: workoutId || '' });
  };

  const updateSetData = useCallback((setId: string, field: keyof SetData, value: string) => {
    setSetData(prev => ({
      ...prev,
      [setId]: { ...prev[setId], [field]: value },
    }));
  }, []);

  const exercises = session?.exercises || [];
  const totalSets = exercises.length;
  const progress = totalSets > 0 ? (completedSets.length / totalSets) * 100 : 0;

  const exerciseOpacities = useRef(
    Array.from({ length: Math.max(exercises.length, 1) }, () => new Animated.Value(0))
  ).current;
  const exerciseTranslateYs = useRef(
    Array.from({ length: Math.max(exercises.length, 1) }, () => new Animated.Value(20))
  ).current;

  useEffect(() => {
    exercises.forEach((_, i) => {
      Animated.sequence([
        Animated.delay(i * 100),
        Animated.parallel([
          Animated.timing(exerciseOpacities[i], { toValue: 1, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(exerciseTranslateYs[i], { toValue: 0, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]),
      ]).start();
    });
  }, [exercises]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (sessionError) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <EmptyState icon="⚠️" title="Failed to load workout" description="Please try again" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <View style={styles.header}>
        <Text style={styles.workoutTitle}>{session?.name || 'Workout'}</Text>
        <Text style={styles.timer}>{formatTime(timer)}</Text>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {exercises.length === 0 ? (
        <EmptyState icon="🏋️" title="No exercises" description="This workout has no exercises" />
      ) : (
        <ScrollView style={styles.setsContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {exercises.map((exerciseSet, index) => {
            const isCompleted = completedSets.includes(exerciseSet.id);
            const data = setData[exerciseSet.id] || { reps: '', weight: '' };
            return (
              <PremiumCard key={exerciseSet.id} variant="glass" style={styles.setCard}>
                <Animated.View style={{ opacity: exerciseOpacities[index], transform: [{ translateY: exerciseTranslateYs[index] }] }}>
                  <View style={styles.setHeader}>
                    <Text style={styles.setText}>
                      Set {index + 1} {exerciseSet.targetReps ? `- ${exerciseSet.targetReps} reps` : ''}
                    </Text>
                    {isCompleted && <Text style={styles.completedBadge}>✓</Text>}
                  </View>
                  <View style={styles.setInputs}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Reps</Text>
                      <TextInput
                        style={[styles.setInput, isCompleted && styles.inputDisabled]}
                        placeholder="0"
                        placeholderTextColor={colors.textMuted}
                        keyboardType="number-pad"
                        value={data.reps}
                        onChangeText={(v) => updateSetData(exerciseSet.id, 'reps', v)}
                        editable={!isCompleted}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Weight (kg)</Text>
                      <TextInput
                        style={[styles.setInput, isCompleted && styles.inputDisabled]}
                        placeholder="0"
                        placeholderTextColor={colors.textMuted}
                        keyboardType="decimal-pad"
                        value={data.weight}
                        onChangeText={(v) => updateSetData(exerciseSet.id, 'weight', v)}
                        editable={!isCompleted}
                      />
                    </View>
                    {!isCompleted && (
                      <Button
                        title="Complete"
                        variant="primary"
                        size="sm"
                        onPress={() => handleCompleteSet(exerciseSet.id)}
                        style={styles.completeButton}
                      />
                    )}
                  </View>
                </Animated.View>
              </PremiumCard>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.actionButtons}>
        <Button title="Finish Workout" variant="outline" onPress={handleCompleteWorkout} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  workoutTitle: { ...typography.h2, color: colors.textPrimary },
  timer: { ...typography.kpi, color: colors.primary },
  setsContainer: { flex: 1 },
  setCard: { marginBottom: spacing.sm },
  setHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  setText: { ...typography.h3, color: colors.textPrimary },
  completedBadge: { color: colors.success, fontSize: 20, fontWeight: '700' },
  setInputs: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, marginTop: spacing.md },
  inputGroup: { flex: 1 },
  inputLabel: { color: colors.textSecondary, fontSize: 12, marginBottom: spacing.xs },
  setInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    color: colors.textPrimary,
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputDisabled: { opacity: 0.4 },
  completeButton: { marginBottom: 0 },
  actionButtons: {
    marginTop: spacing.md,
  },
  errorBanner: {
    backgroundColor: colors.error + '20',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: { color: colors.error, fontSize: 14, textAlign: 'center' },
});
