import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import { useNutritionStore } from '../../store/nutritionStore';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { runFadeIn, runScaleIn } from '../../utils/animations';

type Props = NativeStackScreenProps<RootStackParamList, 'MealCreate'>;

export default function MealCreateScreen({ navigation }: Props) {
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const { createMeal } = useNutritionStore();

  const headerAnim = { opacity: new Animated.Value(0), transform: [{ translateY: new Animated.Value(12) }] };
  const selectorAnim = { opacity: new Animated.Value(0), transform: [{ scale: new Animated.Value(0.92) }] };

  useEffect(() => {
    runFadeIn(headerAnim, 0);
    runScaleIn(selectorAnim, 80);
  }, []);

  const mealTypes: Array<{ id: 'breakfast' | 'lunch' | 'dinner' | 'snack'; label: string; icon: string }> = [
    { id: 'breakfast', label: 'Breakfast', icon: 'sunny' },
    { id: 'lunch', label: 'Lunch', icon: 'leaf' },
    { id: 'dinner', label: 'Dinner', icon: 'moon' },
    { id: 'snack', label: 'Snack', icon: 'cafe' },
  ];

  const handleAddFood = () => {
    navigation.navigate('FoodSearch');
  };

  const handleSave = () => {
    createMeal({ name: selectedMealType, foods: [] });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <Animated.View style={[headerAnim, styles.header]}>
          <Text style={styles.title}>Create Meal</Text>
        </Animated.View>

        <Animated.View style={[selectorAnim, styles.mealTypeSelector]}>
          {mealTypes.map((type) => (
            <Pressable
              key={type.id}
              onPress={() => setSelectedMealType(type.id)}
            >
              <Badge
                label={type.label}
                variant={selectedMealType === type.id ? 'success' : 'default'}
                size="md"
              />
            </Pressable>
          ))}
        </Animated.View>

        <View style={styles.foodSearchSection}>
          <Text style={styles.sectionLabel}>Add Foods</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search foods..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <PremiumCard variant="glass" pressable onPress={handleAddFood} style={styles.addFoodCard}>
            <View style={styles.addFoodContent}>
              <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
              <Text style={styles.addFoodText}>Add Food to Meal</Text>
            </View>
          </PremiumCard>
        </View>

        <View style={styles.actions}>
          <Button title="Save Meal" onPress={handleSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary },
  mealTypeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  foodSearchSection: { marginBottom: spacing.xl },
  sectionLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceGlass,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { marginRight: spacing.xs },
  searchInput: { flex: 1, color: colors.textPrimary, paddingVertical: spacing.sm, fontSize: 14 },
  addFoodCard: { padding: spacing.md },
  addFoodContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  addFoodText: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  actions: { marginTop: 'auto' },
});