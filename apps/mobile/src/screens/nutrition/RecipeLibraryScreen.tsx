import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography } from '../../theme';
import { recipes } from '../../data/recipes';
import { PremiumCard } from '../../components/PremiumCard';
import { Badge } from '../../components/Badge';
import { useNutritionStore } from '../../store/nutritionStore';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeLibrary'>;

export default function RecipeLibraryScreen({ navigation }: Props) {
  const logRecipe = useNutritionStore((s) => s.logRecipe);

  const renderRecipe = ({ item }: { item: typeof recipes[0] }) => (
    <PremiumCard variant="glass" pressable onPress={() => logRecipe(item.id)} style={styles.recipeCard}>
      <Text style={styles.recipeName}>{item.name}</Text>
      <Text style={styles.recipeDesc}>{item.description}</Text>
      <View style={styles.recipeMeta}>
        <Badge label={`${item.calories} cal`} variant="default" size="sm" />
        <Badge label={`${item.protein}g protein`} variant="default" size="sm" />
        <Badge label={`${item.servings} servings`} variant="default" size="sm" />
      </View>
    </PremiumCard>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Recipes</Text>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipe}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  list: { paddingBottom: spacing.md },
  recipeCard: { marginBottom: spacing.sm },
  recipeName: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.xs },
  recipeDesc: { color: colors.textSecondary },
  recipeMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm },
});