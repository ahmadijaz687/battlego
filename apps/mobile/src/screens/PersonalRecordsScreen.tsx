import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { PremiumCard } from '../components/PremiumCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { useWorkoutStore } from '../store/workoutStore';
import { Badge } from '../components/Badge';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'PersonalRecords'>;

export default function PersonalRecordsScreen({ navigation }: Props) {
  const { records: data, isLoading, error, loadRecords } = useWorkoutStore();

  useEffect(() => {
    loadRecords();
  }, []);

  const renderItem = ({ item }: { item: { id: string; exerciseName: string; type: string; value: number; unit: string; date: string } }) => (
    <PremiumCard variant="glass" style={styles.recordCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.exerciseName}>{item.exerciseName}</Text>
        <Badge label={item.type.toUpperCase()} variant="default" size="sm" />
      </View>
      <Text style={styles.recordValue}>{item.value} {item.unit}</Text>
      <Text style={styles.recordMeta}>{item.date}</Text>
    </PremiumCard>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Personal Records</Text>
      </View>

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState title="Failed to load records" message={error} onRetry={() => {}} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState title="No records yet" icon="🏆" description="Complete workouts to set personal records" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.textPrimary, marginLeft: spacing.md },
  list: { gap: spacing.sm },
  recordCard: { marginBottom: spacing.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exerciseName: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
  recordValue: { color: colors.primary, fontSize: 24, fontWeight: '700', marginTop: spacing.xs },
  recordMeta: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs },
});