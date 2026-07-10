import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius, motion } from '../theme';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';
import { Toast } from '../components/Toast';
import { Ionicons } from '@expo/vector-icons';
import { formatJsonField } from '../services/exerciseService';
import type { Exercise } from '../services/exerciseService';
import { useWorkoutStore } from '../store/workoutStore';
import * as workoutService from '../services/workoutService';
import * as exerciseService from '../services/exerciseService';
import { useAuthStore } from '../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateWorkout'>;

const TYPES = [
  { label: 'Strength', value: 'strength' },
  { label: 'Cardio', value: 'cardio' },
  { label: 'Hybrid', value: 'hybrid' },
] as const;

const DIFFICULTIES = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
] as const;

const schema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  description: z.string().optional(),
  type: z.enum(['strength', 'cardio', 'hybrid']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
});

type FormData = z.infer<typeof schema>;

interface SelectedExercise {
  exercise: Exercise;
  exerciseId: string;
  sets: number;
  reps: number;
  restSec: number;
  order: number;
}

export default function CreateWorkoutScreen({ navigation }: Props) {
  const { control, handleSubmit, formState, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', type: 'strength', difficulty: 'beginner' },
  });

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [selected, setSelected] = useState<SelectedExercise[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const type = watch('type');
  const difficulty = watch('difficulty');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!debounced) {
      setSearchResults([]);
      return;
    }
    setIsFetching(true);
    try {
      const results = workoutService.searchExercises(debounced);
      setSearchResults(results as any || []);
    } catch (err) {
      setSearchResults([]);
    } finally {
      setIsFetching(false);
    }
  }, [debounced]);

  const addExercise = (exercise: Exercise) => {
    setSelected((prev) => {
      if (prev.some((s) => s.exercise.id === exercise.id)) return prev;
      return [
        ...prev,
        { exercise, exerciseId: exercise.id, sets: 3, reps: 10, restSec: 60, order: prev.length },
      ];
    });
  };

  const removeExercise = (exerciseId: string) => {
    setSelected((prev) => prev.filter((s) => s.exercise.id !== exerciseId));
  };

  const updateExercise = (exerciseId: string, field: string, value: number | undefined) => {
    setSelected((prev) =>
      prev.map((s) => (s.exercise.id === exerciseId ? { ...s, [field]: value } : s))
    );
  };

  const onSubmit = async (data: FormData) => {
    setFormError(null);
    if (selected.length === 0) {
      setFormError('Add at least one exercise');
      return;
    }
    try {
      setIsCreating(true);
      const userId = useAuthStore.getState().user?.id;
      const payload = {
        name: data.name,
        type: data.type,
        difficulty: data.difficulty,
        description: data.description,
        exercises: selected.map((s, i) => ({
          exerciseId: s.exercise.id,
          sets: s.sets,
          reps: s.reps,
          restSec: s.restSec,
          order: i,
        })),
      };
      let created;
      if (userId) {
        created = await workoutService.createCustomWorkout(userId, payload);
      }
      setToast({ visible: true, message: 'Workout created!' });
      setTimeout(() => {
        if (created?.id) {
          navigation.navigate('WorkoutDetails', { templateId: created.id });
        } else {
          navigation.navigate('WorkoutHome');
        }
      }, 1200);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to create workout';
      setFormError(message);
    } finally {
      setIsCreating(false);
    }
  };

  const stepper = (
    exerciseId: string,
    field: 'sets' | 'reps' | 'restSec',
    current: number | undefined,
    step: number,
    min = 0
  ) => (
    <View style={styles.stepper}>
      <Pressable
        style={styles.stepperBtn}
        onPress={() => updateExercise(exerciseId, field, Math.max(min, (current ?? 0) + step))}
        accessibilityLabel={`Decrease ${field}`}
      >
        <Ionicons name="remove" size={16} color={colors.textPrimary} />
      </Pressable>
      <Text style={styles.stepperValue}>{current ?? 0}</Text>
      <Pressable
        style={styles.stepperBtn}
        onPress={() => updateExercise(exerciseId, field, (current ?? 0) + step)}
        accessibilityLabel={`Increase ${field}`}
      >
        <Ionicons name="add" size={16} color={colors.textPrimary} />
      </Pressable>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Cancel">
            <Ionicons name="close" size={24} color={colors.primary} />
          </Pressable>
          <Text style={styles.title}>New Workout</Text>
          <View style={{ width: 24 }} />
        </View>

        {formError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{formError}</Text>
          </View>
        )}

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              placeholder="Workout name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={formState.errors.name?.message}
              accessibilityLabel="Workout name input"
            />
          )}
        />

        <SectionHeader title="Type" />
        <View style={styles.chipRow}>
          {TYPES.map((t) => (
            <Chip
              key={t.value}
              label={t.label}
              selected={type === t.value}
              onPress={() => setValue('type', t.value)}
            />
          ))}
        </View>

        <SectionHeader title="Difficulty" />
        <View style={styles.chipRow}>
          {DIFFICULTIES.map((d) => (
            <Chip
              key={d.value}
              label={d.label}
              selected={difficulty === d.value}
              onPress={() => setValue('difficulty', d.value)}
            />
          ))}
        </View>

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              placeholder="Description (optional)"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={3}
              style={styles.description}
              accessibilityLabel="Workout description input"
            />
          )}
        />

        <SectionHeader title="Exercises" subtitle={`${selected.length} added`} />

        <View style={styles.searchRow}>
          <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
          <TextField
            placeholder="Search exercises..."
            value={query}
            onChangeText={setQuery}
            containerStyle={{ flex: 1, marginBottom: 0 }}
          />
        </View>

        {isFetching ? (
          <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.results}>
            {searchResults.length === 0 && debounced.length > 0 ? (
              <EmptyState icon="🔍" title="No exercises found" description="Try a different search term" />
            ) : (
              searchResults.slice(0, 8).map((ex) => {
                const added = selected.some((s) => s.exercise.id === ex.id);
                return (
                  <Pressable
                    key={ex.id}
                    onPress={() => addExercise(ex)}
                    accessibilityRole="button"
                    accessibilityLabel={`Add ${ex.name}`}
                  >
                    <Card variant={added ? 'elevated' : 'glass'} style={styles.exerciseCard}>
                      <View style={styles.cardRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.exerciseName}>{ex.name}</Text>
                          <Text style={styles.exerciseMeta}>
                            {formatJsonField(ex.primaryMuscle)} · {formatJsonField(ex.equipment)}
                          </Text>
                        </View>
                        <Chip label={added ? 'Added' : 'Add'} selected={added} onPress={() => addExercise(ex)} />
                      </View>
                    </Card>
                  </Pressable>
                );
              })
            )}
          </View>
        )}

        {selected.length > 0 && (
          <>
            <SectionHeader title="Workout Plan" />
            {selected.map((s) => (
              <Card key={s.exercise.id} variant="surface" style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={styles.exerciseName}>{s.exercise.name}</Text>
                  <Pressable onPress={() => removeExercise(s.exercise.id)} accessibilityLabel={`Remove ${s.exercise.name}`}>
                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                  </Pressable>
                </View>
                <View style={styles.planControls}>
                  <View style={styles.control}>
                    <Text style={styles.controlLabel}>Sets</Text>
                    {stepper(s.exercise.id, 'sets', s.sets, 1)}
                  </View>
                  <View style={styles.control}>
                    <Text style={styles.controlLabel}>Reps</Text>
                    {stepper(s.exercise.id, 'reps', s.reps, 1)}
                  </View>
                  <View style={styles.control}>
                    <Text style={styles.controlLabel}>Rest(s)</Text>
                    {stepper(s.exercise.id, 'restSec', s.restSec, 15)}
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}

        <Button
          title="Create Workout"
          variant="primary"
          fullWidth
          loading={isCreating}
          onPress={handleSubmit(onSubmit)}
          style={styles.submit}
        />
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        variant="success"
        onDismiss={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: { ...typography.h2, color: colors.textPrimary },
  description: { marginTop: spacing.md, minHeight: 80, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  searchIcon: { marginRight: spacing.xs, marginTop: spacing.sm },
  loader: { marginVertical: spacing.md },
  results: { gap: spacing.sm },
  exerciseCard: { marginBottom: spacing.sm },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exerciseName: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  exerciseMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  planCard: { marginBottom: spacing.sm },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  planControls: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  control: { alignItems: 'center', flex: 1 },
  controlLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', minWidth: 28, textAlign: 'center' },
  submit: { marginTop: spacing.lg },
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
