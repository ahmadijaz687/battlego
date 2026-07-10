import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { SearchBar } from '../../components/SearchBar';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { EmptyState } from '../../components/EmptyState';
import { Ionicons } from '@expo/vector-icons';

interface AdminWorkout {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdBy: string;
  exercisesCount: number;
  duration: number;
  createdAt: string;
}

const mockWorkouts: AdminWorkout[] = [
  { id: '1', title: 'Full Body Blast', category: 'Full Body', difficulty: 'intermediate', createdBy: 'John Doe', exercisesCount: 8, duration: 45, createdAt: '2024-06-01' },
  { id: '2', title: 'Upper Body Strength', category: 'Upper Body', difficulty: 'advanced', createdBy: 'Jane Smith', exercisesCount: 6, duration: 50, createdAt: '2024-06-05' },
  { id: '3', title: 'HIIT Cardio', category: 'Cardio', difficulty: 'intermediate', createdBy: 'Mike Johnson', exercisesCount: 10, duration: 30, createdAt: '2024-06-10' },
  { id: '4', title: 'Yoga Flow', category: 'Flexibility', difficulty: 'beginner', createdBy: 'Sarah Wilson', exercisesCount: 12, duration: 60, createdAt: '2024-06-15' },
  { id: '5', title: 'Leg Day', category: 'Lower Body', difficulty: 'advanced', createdBy: 'Alex Brown', exercisesCount: 7, duration: 55, createdAt: '2024-06-20' },
];

const difficulties = ['All', 'beginner', 'intermediate', 'advanced'] as const;

export default function AdminWorkoutsScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('All');
  const [page, setPage] = useState(1);
  const pageSize = 3;

  const filtered = mockWorkouts.filter((w) => {
    const matchesSearch = w.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || w.difficulty === filter;
    return matchesSearch && matchesFilter;
  });

  const paginated = filtered.slice(0, page * pageSize);
  const hasMore = paginated.length < filtered.length;

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'beginner': return colors.success;
      case 'intermediate': return colors.accentOrange;
      case 'advanced': return colors.error;
      default: return colors.textMuted;
    }
  };

  const renderWorkout = ({ item }: { item: AdminWorkout }) => (
    <Card style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutTitle}>{item.title}</Text>
        <Chip label={item.difficulty} />
      </View>
      <Text style={styles.workoutMeta}>
        {item.category} · {item.exercisesCount} exercises · {item.duration} min
      </Text>
      <Text style={styles.workoutAuthor}>By {item.createdBy} · {item.createdAt}</Text>
      <View style={styles.workoutActions}>
        <Button title="Edit" variant="outline" style={styles.actionBtn} onPress={() => {}} />
        <Button title="Delete" variant="outline" style={[styles.actionBtn, { borderColor: colors.error }]} onPress={() => {}} />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
        <Button title="+ Create" onPress={() => {}} />
      </View>

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search workouts..." containerStyle={styles.searchBar} />

      <View style={styles.filterRow}>
        {difficulties.map((d) => (
          <Pressable key={d} style={[styles.filterChip, filter === d && styles.filterChipActive]} onPress={() => { setFilter(d); setPage(1); }}>
            <Text style={[styles.filterChipText, filter === d && styles.filterChipTextActive]}>{d.charAt(0).toUpperCase() + d.slice(1)}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={paginated}
        renderItem={renderWorkout}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="💪" title="No workouts found" description="Try adjusting your search or filters" />}
        ListFooterComponent={
          hasMore ? (
            <Button title="Load More" variant="ghost" onPress={() => setPage((p) => p + 1)} />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  searchBar: { marginHorizontal: spacing.md, marginBottom: spacing.sm },
  filterRow: { flexDirection: 'row', paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.md },
  filterChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { ...typography.caption, color: colors.textSecondary },
  filterChipTextActive: { color: colors.textInverse },
  list: { paddingHorizontal: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl },
  workoutCard: { padding: spacing.md },
  workoutHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  workoutTitle: { ...typography.h4, color: colors.textPrimary, flex: 1 },
  workoutMeta: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.xs },
  workoutAuthor: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.md },
  workoutActions: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: { flex: 1 },
});
