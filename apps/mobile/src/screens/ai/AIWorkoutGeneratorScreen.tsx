import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ErrorState } from '../../components/ErrorState';
import { PremiumCard } from '../../components/PremiumCard';
import { Chip } from '../../components/Chip';
import { useAIStore } from '../../store/aiStore';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'AIWorkoutGenerator'>;

const workoutTypes = ['push', 'pull', 'legs', 'upper', 'lower', 'full_body', 'hiit', 'strength', 'recovery'];

export default function AIWorkoutGeneratorScreen({ navigation }: Props) {
  const { settings, dailyRecommendation, error, generateWorkout } = useAIStore();
  const [selectedType, setSelectedType] = useState('full_body');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setLocalError(null);
    try {
      await generateWorkout({ type: selectedType, duration: 45 });
    } catch {
      setLocalError('Failed to generate workout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Workout Generator</Text>
      </View>

      <Text style={styles.label}>Workout Type</Text>
      <View style={styles.typeList}>
        {workoutTypes.map((type) => (
          <Chip
            key={type}
            label={type.replace('_', ' ')}
            selected={selectedType === type}
            onPress={() => setSelectedType(type)}
          />
        ))}
      </View>

      {isLoading ? (
        <LoadingSkeleton />
      ) : localError || error ? (
        <ErrorState title="Generation failed" message={localError || error || 'Something went wrong'} onRetry={handleGenerate} />
      ) : dailyRecommendation ? (
        <PremiumCard variant="elevated" style={styles.preview}>
          <Text style={styles.previewTitle}>{dailyRecommendation.name}</Text>
          <Text style={styles.previewDesc}>{dailyRecommendation.duration} min | {dailyRecommendation.difficulty}</Text>
          <Text style={styles.previewCalories}>{dailyRecommendation.calories} cal</Text>
          {dailyRecommendation.exercises.slice(0, 4).map((ex) => (
            <Text key={ex.id} style={styles.exerciseRow}>- {ex.name}: {ex.sets}x{ex.reps}</Text>
          ))}
        </PremiumCard>
      ) : (
        <PremiumCard variant="elevated" style={styles.preview}>
          <Text style={styles.previewTitle}>AI-Generated Workout</Text>
          <Text style={styles.previewDesc}>Custom {selectedType.replace('_', ' ')} routine for {settings.experienceLevel} level</Text>
        </PremiumCard>
      )}

      <Button title="Generate Workout" variant="primary" onPress={handleGenerate} disabled={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  label: { color: colors.textSecondary, marginBottom: spacing.sm },
  typeList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.lg },
  preview: { padding: spacing.lg, marginBottom: spacing.lg, alignItems: 'center' },
  previewTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.sm },
  previewDesc: { color: colors.textSecondary, textAlign: 'center' },
  previewCalories: { color: colors.primary, fontSize: 20, fontWeight: '700', marginVertical: spacing.sm },
  exerciseRow: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.xs },
});