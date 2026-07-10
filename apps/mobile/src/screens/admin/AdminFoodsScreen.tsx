import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { SearchBar } from '../../components/SearchBar';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';

interface AdminFood {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

const mockFoods: AdminFood[] = [
  { id: '1', name: 'Chicken Breast', category: 'Meat', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: '100g' },
  { id: '2', name: 'Brown Rice', category: 'Grains', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, servingSize: '100g' },
  { id: '3', name: 'Broccoli', category: 'Vegetables', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, servingSize: '100g' },
  { id: '4', name: 'Greek Yogurt', category: 'Dairy', calories: 59, protein: 10, carbs: 3.6, fat: 0.7, servingSize: '100g' },
  { id: '5', name: 'Almonds', category: 'Nuts', calories: 579, protein: 21, carbs: 22, fat: 50, servingSize: '100g' },
];

const categories = ['All', 'Meat', 'Grains', 'Vegetables', 'Dairy', 'Nuts', 'Fruits'];

export default function AdminFoodsScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = mockFoods.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || f.category === filter;
    return matchesSearch && matchesFilter;
  });

  const renderFood = ({ item }: { item: AdminFood }) => (
    <Card style={styles.foodCard}>
      <View style={styles.foodHeader}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodCategory}>{item.category}</Text>
      </View>
      <Text style={styles.foodServing}>{item.servingSize}</Text>
      <View style={styles.macroRow}>
        <View style={styles.macro}><Text style={styles.macroValue}>{item.calories}</Text><Text style={styles.macroLabel}>cal</Text></View>
        <View style={styles.macro}><Text style={[styles.macroValue, { color: colors.accentGreen }]}>{item.protein}g</Text><Text style={styles.macroLabel}>P</Text></View>
        <View style={styles.macro}><Text style={[styles.macroValue, { color: colors.accentOrange }]}>{item.carbs}g</Text><Text style={styles.macroLabel}>C</Text></View>
        <View style={styles.macro}><Text style={[styles.macroValue, { color: colors.info }]}>{item.fat}g</Text><Text style={styles.macroLabel}>F</Text></View>
      </View>
      <View style={styles.actions}>
        <Button title="Edit" variant="outline" style={styles.actionBtn} onPress={() => {}} />
        <Button title="Delete" variant="outline" style={[styles.actionBtn, { borderColor: colors.error }]} onPress={() => {}} />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Foods</Text>
        <Button title="+ Create" onPress={() => {}} />
      </View>

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search foods..." containerStyle={styles.searchBar} />

      <View style={styles.filterRow}>
        {categories.map((c) => (
          <Button
            key={c}
            title={c}
            variant={filter === c ? 'primary' : 'ghost'}
            style={styles.filterChip}
            onPress={() => setFilter(c)}
          />
        ))}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderFood}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="🥗" title="No foods found" description="Try adjusting your search or filters" />}
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
  foodCard: { padding: spacing.md },
  foodHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  foodName: { ...typography.h4, color: colors.textPrimary },
  foodCategory: { ...typography.caption, color: colors.textSecondary, textTransform: 'uppercase' },
  foodServing: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.sm },
  macroRow: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.md },
  macro: { alignItems: 'center' },
  macroValue: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  macroLabel: { ...typography.tiny, color: colors.textMuted, textTransform: 'uppercase' },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: { flex: 1 },
});
