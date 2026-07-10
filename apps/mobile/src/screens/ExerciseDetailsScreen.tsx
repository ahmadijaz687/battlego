import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { PremiumCard } from '../components/PremiumCard';
import { Badge } from '../components/Badge';
import { useWorkoutStore } from '../store/workoutStore';
import * as workoutService from '../services/workoutService';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseDetails'>;

export default function ExerciseDetailsScreen({ navigation, route }: Props) {
  const { exerciseId } = route.params;
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

  const exercise = (exercises || []).find(e => e.id === exerciseId);

  if (isLoadingExercises) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!exercise) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.textSecondary }}>Exercise not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Exercise Details</Text>
      </View>

      <PremiumCard variant="elevated" style={styles.mediaCard}>
        <View style={styles.placeholderImage}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
        </View>
      </PremiumCard>

      <PremiumCard variant="glass" style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Primary Muscle</Text>
          <Badge label={exercise.muscles[0] || 'General'} variant="success" size="sm" />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Equipment</Text>
          <Text style={styles.infoValue}>{exercise.equipment?.join(', ') || 'None'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Difficulty</Text>
          <Badge label={exercise.difficulty} variant="warning" size="sm" />
        </View>
      </PremiumCard>

      <PremiumCard variant="glass" style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.step}>{exercise.description || 'No description available.'}</Text>
      </PremiumCard>

      <PremiumCard variant="glass" style={styles.section}>
        <Text style={styles.sectionTitle}>Target Muscles</Text>
        {exercise.muscles.map((muscle, idx) => (
          <Text key={idx} style={styles.step}>• {muscle}</Text>
        ))}
      </PremiumCard>

      <PremiumCard variant="glass" style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        {exercise.instructions && exercise.instructions.length > 0 ? (
          exercise.instructions.map((step, idx) => (
            <Text key={idx} style={styles.step}>{idx + 1}. {step}</Text>
          ))
        ) : (
          <Text style={styles.step}>Follow standard form for this exercise.</Text>
        )}
      </PremiumCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  mediaCard: { marginBottom: spacing.lg, padding: 0 },
  placeholderImage: {
    height: 200,
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseName: { color: colors.textPrimary, fontSize: 24, fontWeight: '700' },
  infoCard: { padding: spacing.md, marginBottom: spacing.lg },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  infoLabel: { color: colors.textSecondary, fontSize: 14 },
  infoValue: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  section: { marginBottom: spacing.md, padding: spacing.md },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  step: { color: colors.textSecondary, marginBottom: spacing.xs },
  mistake: { color: colors.secondary, marginBottom: spacing.xs },
  tip: { color: colors.textSecondary },
  alternativeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});