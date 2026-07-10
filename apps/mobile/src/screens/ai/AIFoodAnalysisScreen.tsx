import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AIStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AIStackParamList, 'AIFoodAnalysis'>;

interface DetectedFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

interface AnalysisResult {
  foods: DetectedFood[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export default function AIFoodAnalysisScreen({ navigation }: Props) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handlePickImage = () => {
    setPhoto('https://picsum.photos/400/300?food');
    setResult(null);
  };

  const handleTakePhoto = () => {
    setPhoto('https://picsum.photos/400/301?food');
    setResult(null);
  };

  const handleAnalyze = () => {
    setProcessing(true);
    setTimeout(() => {
      setResult({
        foods: [
          { name: 'Grilled Chicken Breast', calories: 284, protein: 53, carbs: 0, fat: 6, confidence: 96 },
          { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8, confidence: 94 },
          { name: 'Steamed Broccoli', calories: 55, protein: 4.5, carbs: 11, fat: 0.5, confidence: 91 },
          { name: 'Olive Oil Dressing', calories: 119, protein: 0, carbs: 0, fat: 13.5, confidence: 88 },
        ],
        totalCalories: 674,
        totalProtein: 62.5,
        totalCarbs: 56,
        totalFat: 21.8,
      });
      setProcessing(false);
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Food Analysis</Text>
        </View>

        <Text style={styles.instruction}>Take a photo of your meal to get instant nutritional analysis</Text>

        {photo ? (
          <Card style={styles.photoCard}>
            <Image source={{ uri: photo }} style={styles.photoImage} resizeMode="cover" />
            <Pressable style={styles.removePhoto} onPress={() => { setPhoto(null); setResult(null); }} accessibilityLabel="Remove photo">
              <Ionicons name="close-circle" size={24} color={colors.error} />
            </Pressable>
          </Card>
        ) : (
          <View style={styles.uploadArea}>
            <Ionicons name="camera" size={48} color={colors.textMuted} />
            <Text style={styles.uploadText}>Upload a meal photo</Text>
          </View>
        )}

        <View style={styles.actionRow}>
          <Button title="Gallery" variant="outline" style={styles.actionBtn} onPress={handlePickImage} />
          <Button title="Camera" variant="outline" style={styles.actionBtn} onPress={handleTakePhoto} />
        </View>

        {photo && !processing && !result && (
          <Button title="Analyze Meal" style={styles.analyzeBtn} onPress={handleAnalyze} />
        )}

        {processing && (
          <Card style={styles.processingCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.processingText}>Analyzing your meal...</Text>
            <Text style={styles.processingSub}>Identifying foods and estimating nutrition</Text>
          </Card>
        )}

        {result && (
          <View>
            <Card style={styles.totalCard}>
              <Text style={styles.sectionTitle}>Estimated Totals</Text>
              <View style={styles.totalRow}>
                <View style={styles.totalItem}><Text style={[styles.totalValue, { color: colors.primary }]}>{result.totalCalories}</Text><Text style={styles.totalLabel}>kcal</Text></View>
                <View style={styles.totalItem}><Text style={[styles.totalValue, { color: colors.accentGreen }]}>{result.totalProtein}g</Text><Text style={styles.totalLabel}>Protein</Text></View>
                <View style={styles.totalItem}><Text style={[styles.totalValue, { color: colors.accentOrange }]}>{result.totalCarbs}g</Text><Text style={styles.totalLabel}>Carbs</Text></View>
                <View style={styles.totalItem}><Text style={[styles.totalValue, { color: colors.info }]}>{result.totalFat}g</Text><Text style={styles.totalLabel}>Fat</Text></View>
              </View>
            </Card>

            <Card style={styles.foodsCard}>
              <Text style={styles.sectionTitle}>Detected Foods</Text>
              {result.foods.map((food, index) => (
                <View key={index} style={styles.foodRow}>
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <View style={styles.confidenceRow}>
                      <View style={[styles.confidenceBar, { width: `${food.confidence}%`, backgroundColor: food.confidence > 90 ? colors.success : colors.accentOrange }]} />
                      <Text style={styles.confidenceText}>{food.confidence}%</Text>
                    </View>
                  </View>
                  <Text style={styles.foodCalories}>{food.calories} kcal</Text>
                </View>
              ))}
            </Card>

            <Button
              title="Add to Today's Meals"
              style={styles.addBtn}
              onPress={() => navigation.navigate('AIChat')}
            />
            <Button title="Analyze Another Meal" variant="outline" onPress={() => { setPhoto(null); setResult(null); }} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: { marginBottom: spacing.sm },
  title: { ...typography.h1, color: colors.textPrimary },
  instruction: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.lg },
  photoCard: { padding: spacing.xs, marginBottom: spacing.md, position: 'relative' },
  photoImage: { width: '100%', height: 250, borderRadius: borderRadius.md },
  removePhoto: { position: 'absolute', top: spacing.sm, right: spacing.sm },
  uploadArea: { height: 200, borderRadius: borderRadius.md, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface, marginBottom: spacing.md, gap: spacing.sm },
  uploadText: { ...typography.body, color: colors.textMuted },
  actionRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  actionBtn: { flex: 1 },
  analyzeBtn: { marginBottom: spacing.lg },
  processingCard: { padding: spacing.xl, alignItems: 'center', marginBottom: spacing.md },
  processingText: { ...typography.body, color: colors.textPrimary, marginTop: spacing.md },
  processingSub: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  totalCard: { padding: spacing.md, marginBottom: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  totalRow: { flexDirection: 'row', justifyContent: 'space-around' },
  totalItem: { alignItems: 'center' },
  totalValue: { ...typography.h3, fontWeight: '700' },
  totalLabel: { ...typography.caption, color: colors.textMuted },
  foodsCard: { padding: spacing.md, marginBottom: spacing.md },
  foodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  foodInfo: { flex: 1, marginRight: spacing.sm },
  foodName: { ...typography.body, color: colors.textPrimary },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 2 },
  confidenceBar: { height: 4, borderRadius: 2, flex: 1, maxWidth: 80 },
  confidenceText: { ...typography.tiny, color: colors.textMuted },
  foodCalories: { ...typography.body, color: colors.textSecondary, fontWeight: '600' },
  addBtn: { marginBottom: spacing.sm },
});
