import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography } from '../theme';
import { useWorkoutStore } from '../store/workoutStore';
import * as workoutService from '../services/workoutService';
import { PremiumCard } from '../components/PremiumCard';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';
import { SearchBar } from '../components/SearchBar';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutTemplates'>;

export default function WorkoutTemplatesScreen({ navigation }: Props) {
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);

  useEffect(() => {
    try {
      const data = workoutService.getExercises();
      setExercises(data);
    } catch (err) {
      // handle error
    } finally {
      setIsLoadingExercises(false);
    }
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Exercise Library</Text>
      </View>

      <SearchBar placeholder="Search exercises..." style={styles.search} />

      {isLoadingExercises ? (
        <LoadingSkeleton />
      ) : !exercises || exercises.length === 0 ? (
        <EmptyState icon="🏋️" title="No exercises" description="Create a custom workout to get started" />
      ) : (
        exercises.map((exercise) => (
          <PremiumCard key={exercise.id} variant="glass" pressable style={styles.templateCard}>
            <Text style={styles.templateName}>{exercise.name}</Text>
            <Text style={styles.templateDesc}>{exercise.description}</Text>
            <View style={styles.templateMeta}>
              <Badge label={exercise.difficulty} variant={exercise.difficulty === 'beginner' ? 'success' : exercise.difficulty === 'intermediate' ? 'warning' : 'error'} size="sm" />
              <Badge label={exercise.category} variant="default" size="sm" />
            </View>
          </PremiumCard>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  search: { marginBottom: spacing.lg },
  templateCard: { marginBottom: spacing.sm },
  templateName: { color: colors.textPrimary, fontSize: 18, fontWeight: '600' },
  templateDesc: { color: colors.textSecondary, marginTop: spacing.xs },
  templateMeta: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
});
