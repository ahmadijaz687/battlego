import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography } from '../theme';
import { Exercise } from '../types/exercise';
import { PremiumCard } from '../components/PremiumCard';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { SearchBar } from '../components/SearchBar';
import { useWorkoutStore } from '../store/workoutStore';
import * as workoutService from '../services/workoutService';
import { useAuthStore } from '../store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutBuilder'>;

export default function WorkoutBuilderScreen({ navigation }: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = workoutService.getExercises();
      setExercises(data as any);
    } catch (err) {
      // handle error
    } finally {
      setIsLoadingExercises(false);
    }
  }, []);

  const list = exercises || [];
  const filtered = list.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const toggleExercise = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(exId => exId !== id) : [...prev, id]);
  };

  const handleSave = async () => {
    if (!workoutName.trim()) {
      setError('Please enter a workout name');
      return;
    }
    if (selectedIds.length === 0) {
      setError('Please select at least one exercise');
      return;
    }
    setError(null);
    try {
      setIsCreating(true);
      const userId = useAuthStore.getState().user?.id;
      if (userId) {
        await workoutService.createCustomWorkout(userId, { name: workoutName, type: 'strength', difficulty: 'beginner', exercises: selectedIds.map((id) => ({ exerciseId: id })) });
      }
      navigation.navigate('WorkoutHome');
    } catch {
      setError('Failed to save workout. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Cancel">
          <Ionicons name="close" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <TextField
        placeholder="Workout name"
        value={workoutName}
        onChangeText={setWorkoutName}
        style={styles.input}
        accessibilityLabel="Workout name input"
      />

      <SearchBar placeholder="Add exercises..." value={search} onChangeText={setSearch} style={styles.search} />

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {isLoadingExercises ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 48 }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filtered.length === 0 && !isLoadingExercises ? (
        <EmptyState icon="🔍" title="No exercises found" description="Try a different search term" />
      ) : (
        filtered.map(ex => {
        const isSelected = selectedIds.includes(ex.id);
        return (
          <PremiumCard key={ex.id} variant={isSelected ? 'elevated' : 'glass'} pressable onPress={() => toggleExercise(ex.id)} style={styles.exerciseCard}>
            <View style={styles.cardRow}>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Badge label={ex.muscles[0]} variant="default" size="sm" />
            </View>
            {isSelected && <Badge label="Added" variant="success" size="sm" />}
          </PremiumCard>
        );
      }))}
      <Button title="Save Workout" variant="primary" loading={isCreating} onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md, paddingBottom: 100 },
  header: { marginBottom: spacing.lg },
  input: { marginBottom: spacing.lg },
  search: { marginBottom: spacing.lg },
  exerciseCard: { marginBottom: spacing.sm, padding: spacing.md },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exerciseName: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
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
