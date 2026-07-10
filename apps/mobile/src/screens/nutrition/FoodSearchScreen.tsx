import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import { useNutritionStore } from '../../store/nutritionStore';
import { Badge } from '../../components/Badge';
import { EmptyState } from '../../components/EmptyState';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'FoodSearch'>;

export default function FoodSearchScreen({ navigation }: Props) {
  const { foods, isLoading, fetchFoods, error } = useNutritionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const categories: string[] = useMemo(() => {
    if (!foods) return [] as string[];
    const cats = new Set(foods.map((f) => f.brand || 'Other'));
    return Array.from(cats) as string[];
  }, [foods]);

  const filteredFoods = useMemo(() => {
    if (!foods) return [];

    let results = foods;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter((f) => f.name.toLowerCase().includes(q) || f.brand?.toLowerCase().includes(q));
    }

    if (selectedCategory) {
      results = results.filter((f) => (f.brand || 'Other') === selectedCategory);
    }

    return results;
  }, [searchQuery, selectedCategory, foods]);

  const listAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(listAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [filteredFoods]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Food Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search foods..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoryList}>
        <FlatList
          horizontal
          data={['All', ...categories]}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: spacing.xs }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable onPress={() => setSelectedCategory(item === 'All' ? null : item)}>
              <Badge
                label={item}
                variant={selectedCategory === item ? 'success' : 'default'}
                size="md"
              />
            </Pressable>
          )}
        />
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>Failed to load foods. Pull down to retry.</Text>
        </View>
      )}

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredFoods.length === 0 ? (
        <EmptyState icon="🔍" title="No foods found" description="Try a different search term" />
      ) : (
        <FlatList
          data={filteredFoods}
          keyExtractor={(item) => item.id}
          style={{ opacity: listAnim }}
          refreshing={isLoading}
          onRefresh={fetchFoods}
          renderItem={({ item, index }) => (
            <PremiumCard variant="glass" pressable onPress={() => navigation.navigate('FoodDetails', { foodId: item.id })} style={styles.foodCard}>
              <View style={styles.foodContent}>
                <View style={styles.foodHeader}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Pressable onPress={() => navigation.navigate('FoodDetails', { foodId: item.id })}>
                    <Ionicons name="add-circle" size={24} color={colors.primary} />
                  </Pressable>
                </View>
                {item.brand && <Text style={styles.foodBrand}>{item.brand}</Text>}
                <View style={styles.foodNutrition}>
                  <Text style={styles.foodCalories}>{item.calories} cal</Text>
                  <Badge label={`${item.protein}g P`} variant="default" size="sm" />
                </View>
              </View>
            </PremiumCard>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  title: { ...typography.h2, color: colors.textPrimary, marginLeft: spacing.md },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  searchIcon: { marginRight: spacing.xs },
  searchInput: { flex: 1, color: colors.textPrimary, paddingVertical: spacing.sm, fontSize: 16 },
  categoryList: { marginBottom: spacing.md },
  list: { paddingBottom: spacing.md },
  foodCard: { marginBottom: spacing.sm },
  foodContent: { padding: spacing.sm },
  foodHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  foodName: { color: colors.textPrimary, fontSize: 16, fontWeight: '600', flex: 1 },
  foodBrand: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.xs },
  foodNutrition: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  foodCalories: { color: colors.textMuted, fontSize: 12 },
  errorBanner: {
    backgroundColor: colors.error + '20',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: { color: colors.error, fontSize: 14, textAlign: 'center' },
});