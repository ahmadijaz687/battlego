import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Animated, Easing, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius, motion } from '../../theme';
import { useWorkoutStore } from '../../store/workoutStore';
import * as workoutService from '../../services/workoutService';
import { Exercise } from '../../types/exercise';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutHome'>;

const CATEGORIES = ['All', 'strength', 'cardio', 'flexibility', 'balance', 'power'];

export default function WorkoutHomeScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);

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

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, { toValue: 1, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(heroTranslate, { toValue: 0, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, []);

  const filteredExercises = useMemo(() => {
    const list = exercises || [];
    const query = searchQuery.toLowerCase();
    return list.filter(
      (e) =>
        (category === 'All' || e.category === category) &&
        (!query ||
          e.name.toLowerCase().includes(query) ||
          e.muscles.some((m) => m.toLowerCase().includes(query)) ||
          e.searchTags?.some((t) => t.includes(query)))
    );
  }, [searchQuery, category, exercises]);

  const renderWorkout = ({ item }: { item: Exercise }) => (
    <Pressable onPress={() => navigation.navigate('WorkoutDetails', { templateId: item.id })}>
      <Card variant="surface" style={styles.workoutCard}>
        <View style={styles.cardBody}>
          <View style={styles.thumb}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.thumbImage} />
            ) : (
              <Ionicons name="barbell" size={28} color={colors.primary} />
            )}
          </View>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.workoutName} numberOfLines={1}>{item.name}</Text>
            </View>
            <Text style={styles.workoutMuscles} numberOfLines={1}>{item.muscles.join(', ')}</Text>
            <View style={styles.cardFooter}>
              <Badge
                label={item.difficulty}
                variant={item.difficulty === 'beginner' ? 'success' : item.difficulty === 'intermediate' ? 'warning' : 'error'}
                size="sm"
              />
              <Button
                title="Start"
                variant="primary"
                size="sm"
                onPress={() => navigation.navigate('WorkoutDetails', { templateId: item.id })}
              />
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );

  if (isLoadingExercises) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.heroHeader}>
          <Text style={styles.title}>Workouts</Text>
        </View>
        <View style={styles.content}>
          <LoadingSkeleton height={80} style={styles.skeleton} />
          <LoadingSkeleton height={80} style={styles.skeleton} />
          <LoadingSkeleton height={80} style={styles.skeleton} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={[styles.heroSection, { opacity: heroOpacity, transform: [{ translateY: heroTranslate }] }]}>
        <View style={styles.heroHeader}>
          <Text style={styles.title}>Workouts</Text>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => navigation.navigate('CreateWorkout')}
              accessibilityLabel="Create new workout"
              style={styles.createButton}
            >
              <Ionicons name="add" size={24} color={colors.primary} />
            </Pressable>
            <Badge label="4 this week" />
          </View>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.filterChip, category === item && styles.filterChipActive]}
              onPress={() => setCategory(item)}
              accessibilityRole="button"
              accessibilityLabel={item}
              accessibilityState={{ selected: category === item }}
            >
              <Text style={[styles.filterChipText, category === item && styles.filterChipTextActive]}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </Pressable>
          )}
        />
      </Animated.View>

      {filteredExercises.length === 0 ? (
        <EmptyState
          icon="🏋️"
          title="No workouts found"
          description="Try searching for a different muscle group"
          action={{ label: 'Clear Search', onPress: () => { setSearchQuery(''); setCategory('All'); } }}
        />
      ) : (
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={renderWorkout}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heroSection: { padding: spacing.md },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.h1, color: colors.textPrimary },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { marginRight: spacing.xs },
  searchInput: { flex: 1, color: colors.textPrimary, paddingVertical: spacing.sm, fontSize: 16 },
  filterRow: { gap: spacing.sm, paddingVertical: spacing.sm },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  filterChipTextActive: { color: colors.textInverse },
  content: { padding: spacing.md },
  skeleton: { marginBottom: spacing.md, borderRadius: borderRadius.md },
  list: { padding: spacing.md },
  workoutCard: { marginBottom: spacing.sm },
  cardBody: { flexDirection: 'row', alignItems: 'center' },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  thumbImage: { width: 64, height: 64, borderRadius: borderRadius.md },
  cardContent: { flex: 1 },
  cardHeader: { marginBottom: spacing.xs },
  workoutName: { ...typography.h3, color: colors.textPrimary, flex: 1 },
  workoutMuscles: { color: colors.textSecondary, fontSize: 14, marginBottom: spacing.sm },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
