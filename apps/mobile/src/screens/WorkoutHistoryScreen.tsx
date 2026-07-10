import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography } from '../theme';
import { PremiumCard } from '../components/PremiumCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { useWorkoutStore } from '../store/workoutStore';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutHistory'>;

export default function WorkoutHistoryScreen({ navigation }: Props) {
  const { history, isLoading, error, loadHistory } = useWorkoutStore();

  useEffect(() => {
    loadHistory();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <PremiumCard variant="glass" style={styles.historyCard}>
      <Text style={styles.workoutName}>{item.workouts?.[0]?.name || item.name || 'Workout'}</Text>
      <Text style={styles.workoutDate}>{item.date || item.createdAt ? new Date(item.createdAt || item.date).toLocaleDateString() : ''}</Text>
    </PremiumCard>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Workout History</Text>
      </View>

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState title="Failed to load history" message={error} onRetry={() => {}} />
      ) : !history || history.length === 0 ? (
        <EmptyState icon="📅" title="No workout history yet" description="Complete your first workout to see history" />
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  list: { gap: spacing.sm },
  historyCard: { marginBottom: spacing.sm, padding: spacing.md },
  workoutName: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
  workoutDate: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.xs },
});
