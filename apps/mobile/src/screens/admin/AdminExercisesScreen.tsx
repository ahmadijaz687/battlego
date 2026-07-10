import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { SearchBar } from '../../components/SearchBar';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { EmptyState } from '../../components/EmptyState';

interface AdminExercise {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: string;
  equipment: string;
}

const mockExercises: AdminExercise[] = [
  { id: '1', name: 'Bench Press', muscleGroup: 'Chest', difficulty: 'intermediate', type: 'Strength', equipment: 'Barbell' },
  { id: '2', name: 'Squat', muscleGroup: 'Legs', difficulty: 'intermediate', type: 'Strength', equipment: 'Barbell' },
  { id: '3', name: 'Pull Up', muscleGroup: 'Back', difficulty: 'advanced', type: 'Calisthenics', equipment: 'Bodyweight' },
  { id: '4', name: 'Plank', muscleGroup: 'Core', difficulty: 'beginner', type: 'Core', equipment: 'Bodyweight' },
  { id: '5', name: 'Deadlift', muscleGroup: 'Back', difficulty: 'advanced', type: 'Strength', equipment: 'Barbell' },
];

const muscleGroups = ['All', 'Chest', 'Back', 'Legs', 'Core', 'Shoulders', 'Arms'];

export default function AdminExercisesScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = mockExercises.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || e.muscleGroup === filter;
    return matchesSearch && matchesFilter;
  });

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'beginner': return colors.success;
      case 'intermediate': return colors.accentOrange;
      case 'advanced': return colors.error;
      default: return colors.textMuted;
    }
  };

  const renderExercise = ({ item }: { item: AdminExercise }) => (
    <Card style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Chip label={item.difficulty} />
      </View>
      <Text style={styles.exerciseMeta}>
        {item.muscleGroup} · {item.type} · {item.equipment}
      </Text>
      <View style={styles.actions}>
        <Button title="Edit" variant="outline" style={styles.actionBtn} onPress={() => {}} />
        <Button title="Delete" variant="outline" style={[styles.actionBtn, { borderColor: colors.error }]} onPress={() => {}} />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Exercises</Text>
        <Button title="+ Create" onPress={() => {}} />
      </View>

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search exercises..." containerStyle={styles.searchBar} />

      <View style={styles.filterRow}>
        {muscleGroups.map((g) => (
          <Button
            key={g}
            title={g}
            variant={filter === g ? 'primary' : 'ghost'}
            style={styles.filterChip}
            onPress={() => setFilter(g)}
          />
        ))}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderExercise}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="🏋️" title="No exercises found" description="Try adjusting your search or filters" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  searchBar: { marginHorizontal: spacing.md, marginBottom: spacing.sm },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.md, gap: spacing.xs, marginBottom: spacing.md },
  filterChip: { paddingHorizontal: spacing.sm, paddingVertical: 0 },
  list: { paddingHorizontal: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl },
  exerciseCard: { padding: spacing.md },
  exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  exerciseName: { ...typography.h4, color: colors.textPrimary, flex: 1 },
  exerciseMeta: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: { flex: 1 },
});
