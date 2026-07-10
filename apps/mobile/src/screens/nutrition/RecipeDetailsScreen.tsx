import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography } from '../../theme';
import { recipes } from '../../data/recipes';
import { PremiumCard } from '../../components/PremiumCard';
import { Button } from '../../components/Button';
import { MacroRing } from '../../components/MacroRing';
import { useNutritionStore } from '../../store/nutritionStore';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeDetails'>;

export default function RecipeDetailsScreen({ navigation, route }: Props) {
  const { recipeId } = route.params;
  const recipe = recipes.find((r) => r.id === recipeId);
  const logRecipe = useNutritionStore((s) => s.logRecipe);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.error}>Recipe not found</Text>
      </SafeAreaView>
    );
  }

  const handleLog = () => {
    logRecipe(recipe.id);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text style={styles.title}>{recipe.name}</Text>
        </View>

        <PremiumCard variant="elevated" style={styles.nutritionCard}>
          <View style={styles.nutritionRow}>
            <MacroRing label="Protein" value={recipe.protein} max={100} />
            <MacroRing label="Carbs" value={recipe.carbs} max={100} />
            <MacroRing label="Fat" value={recipe.fat} max={100} />
          </View>
        </PremiumCard>

        <PremiumCard variant="glass" style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ing, i) => (
            <Text key={i} style={styles.ingredient}>{ing.quantity} {ing.unit} • {ing.foodId}</Text>
          ))}
        </PremiumCard>

        <PremiumCard variant="glass" style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.instructions.map((step, i) => (
            <Text key={i} style={styles.step}>{i + 1}. {step}</Text>
          ))}
        </PremiumCard>

        <View style={styles.actions}>
          <Button title="Log Recipe" onPress={handleLog} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  nutritionCard: { padding: spacing.md, marginBottom: spacing.lg },
  nutritionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  section: { padding: spacing.md, marginBottom: spacing.md },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  ingredient: { color: colors.textSecondary, marginBottom: spacing.xs },
  step: { color: colors.textSecondary, marginBottom: spacing.xs },
  actions: { marginTop: 'auto' },
  error: { color: colors.secondary, textAlign: 'center', marginTop: spacing.xl },
});