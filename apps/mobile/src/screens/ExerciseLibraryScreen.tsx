import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { Exercise } from '../types/exercise';
import { PremiumCard } from '../components/PremiumCard';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';
import { useWorkoutStore } from '../store/workoutStore';
import * as workoutService from '../services/workoutService';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../components/SearchBar';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseLibrary'>;

export default function ExerciseLibraryScreen({ navigation }: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [search, setSearch] = useState('');

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

  const filtered = (exercises || []).filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const renderItem = ({ item }: { item: Exercise }) => (
    <PremiumCard variant="glass" pressable onPress={() => navigation.navigate('ExerciseDetails', { exerciseId: item.id })} style={styles.exerciseCard}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      <Badge label={item.muscles[0]} variant="default" size="sm" />
    </PremiumCard>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Exercise Library</Text>
      </View>

      <SearchBar value={search} onChangeText={setSearch} style={styles.search} />

      <View style={styles.categories}>
        {['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms'].map(cat => (
          <Badge key={cat} label={cat} variant="default" size="sm" />
        ))}
      </View>

      {isLoadingExercises ? (
        <View style={{ padding: spacing.xl, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState icon="💪" title="No exercises found" description="Try a different search term" />
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  search: { marginBottom: spacing.lg },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  exerciseCard: { marginBottom: spacing.sm },
  exerciseName: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
});