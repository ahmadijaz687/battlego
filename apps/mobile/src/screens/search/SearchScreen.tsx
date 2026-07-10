import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { SearchBar } from '../../components/SearchBar';
import { searchApi } from '../../api/search';

interface SearchResult {
  id: string;
  type: 'user' | 'workout' | 'exercise' | 'food' | 'post' | 'battle';
  title: string;
  subtitle: string;
  icon: string;
}

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'users', label: 'Users' },
  { key: 'workouts', label: 'Workouts' },
  { key: 'exercises', label: 'Exercises' },
  { key: 'foods', label: 'Foods' },
  { key: 'posts', label: 'Posts' },
  { key: 'battles', label: 'Battles' },
] as const;

export default function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const [usersRes, workoutsRes, exercisesRes, foodsRes, postsRes, battlesRes] = await Promise.allSettled([
        searchApi.users(text),
        searchApi.workouts(text),
        searchApi.exercises(text),
        searchApi.foods(text),
        searchApi.posts(text),
        searchApi.battles(text),
      ]);

      const combined: SearchResult[] = [];

      if (usersRes.status === 'fulfilled') {
        const resData = usersRes.value.data as any;
        const items = Array.isArray(resData) ? resData : (resData?.data as any[]);
        items?.forEach((u: any) => {
          combined.push({ id: `user-${u.id}`, type: 'user' as const, title: u.username || u.displayName, subtitle: `${u.followers || 0} followers`, icon: 'person-outline' as const });
        });
      }
      if (workoutsRes.status === 'fulfilled') {
        const resData = workoutsRes.value.data as any;
        const items = Array.isArray(resData) ? resData : (resData?.data as any[]);
        items?.forEach((w: any) => {
          combined.push({ id: `workout-${w.id}`, type: 'workout' as const, title: w.name, subtitle: `${w.exercises?.length || 0} exercises`, icon: 'barbell-outline' as const });
        });
      }
      if (exercisesRes.status === 'fulfilled') {
        const resData = exercisesRes.value.data as any;
        const items = Array.isArray(resData) ? resData : (resData?.data as any[]);
        items?.forEach((e: any) => {
          combined.push({ id: `exercise-${e.id}`, type: 'exercise' as const, title: e.name, subtitle: e.muscleGroup || '', icon: 'fitness-outline' as const });
        });
      }
      if (foodsRes.status === 'fulfilled') {
        const resData = foodsRes.value.data as any;
        const items = Array.isArray(resData) ? resData : (resData?.data as any[]);
        items?.forEach((f: any) => {
          combined.push({ id: `food-${f.id}`, type: 'food' as const, title: f.name, subtitle: `${f.calories || 0} kcal`, icon: 'nutrition-outline' as const });
        });
      }
      if (postsRes.status === 'fulfilled') {
        const resData = postsRes.value.data as any;
        const items = Array.isArray(resData) ? resData : (resData?.data as any[]);
        items?.forEach((p: any) => {
          combined.push({ id: `post-${p.id}`, type: 'post' as const, title: p.title || 'Post', subtitle: `${p.likes || 0} likes`, icon: 'chatbubble-outline' as const });
        });
      }
      if (battlesRes.status === 'fulfilled') {
        const resData = battlesRes.value.data as any;
        const items = Array.isArray(resData) ? resData : (resData?.data as any[]);
        items?.forEach((b: any) => {
          combined.push({ id: `battle-${b.id}`, type: 'battle' as const, title: b.name, subtitle: `${b.participants || 0} participants`, icon: 'trophy-outline' as const });
        });
      }

      setResults(combined);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const filteredResults = useMemo(() => {
    if (selectedCategory === 'all') return results;
    return results.filter((r) => r.type === selectedCategory.slice(0, -1));
  }, [results, selectedCategory]);

  const handleResultPress = useCallback((result: SearchResult) => {
    switch (result.type) {
      case 'user':
        navigation.navigate('Profile');
        break;
      case 'workout':
        navigation.navigate('WorkoutDetails', { templateId: result.id });
        break;
      case 'exercise':
        navigation.navigate('ExerciseDetails', { exerciseId: result.id });
        break;
      case 'food':
        navigation.navigate('FoodDetails', { foodId: result.id });
        break;
      case 'post':
        navigation.navigate('PostDetails', { postId: result.id });
        break;
      case 'battle':
        navigation.navigate('BattleDetails', { battleId: result.id });
        break;
    }
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={query}
          onChangeText={handleSearch}
          onClear={() => { setQuery(''); setResults([]); }}
          placeholder="Search users, workouts, foods..."
          autoFocus
        />
      </View>

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.categoryChip, selectedCategory === item.key && styles.categoryChipActive]}
            onPress={() => setSelectedCategory(item.key)}
          >
            <Text style={[styles.categoryText, selectedCategory === item.key && styles.categoryTextActive]}>
              {item.label}
            </Text>
          </Pressable>
        )}
      />

      {isSearching ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : query.length === 0 || query.length < 2 ? (
        <View style={styles.center}>
          <Ionicons name="search-outline" size={48} color={colors.textMuted} />
          <Text style={styles.hintText}>Type at least 2 characters to search</Text>
        </View>
      ) : filteredResults.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
          <Text style={styles.hintText}>No results found for "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={filteredResults}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          renderItem={({ item }) => (
            <Pressable style={styles.resultItem} onPress={() => handleResultPress(item)}>
              <View style={styles.resultIcon}>
                <Ionicons name={item.icon as any} size={22} color={colors.primary} />
              </View>
              <View style={styles.resultInfo}>
                <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.resultSubtitle} numberOfLines={1}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  title: { fontSize: typography.h2.fontSize, fontWeight: '700', color: colors.textPrimary },
  searchContainer: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  categoriesContainer: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingVertical: spacing.sm },
  categoryChip: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md, borderRadius: borderRadius.full, backgroundColor: colors.surface, marginRight: spacing.sm },
  categoryChipActive: { backgroundColor: colors.primary },
  categoryText: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },
  categoryTextActive: { color: colors.textPrimary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  hintText: { color: colors.textMuted, fontSize: 14, marginTop: spacing.sm, textAlign: 'center' },
  resultsList: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  resultItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  resultIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  resultInfo: { flex: 1 },
  resultTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  resultSubtitle: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
