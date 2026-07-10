import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AIStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AIStackParamList, 'AIGoalPlanner'>;

const goalTypes = [
  { key: 'workout', label: 'Workout', icon: 'fitness' },
  { key: 'nutrition', label: 'Nutrition', icon: 'nutrition' },
  { key: 'weight', label: 'Weight', icon: 'scale' },
  { key: 'water', label: 'Water', icon: 'water' },
  { key: 'sleep', label: 'Sleep', icon: 'moon' },
  { key: 'steps', label: 'Steps', icon: 'footsteps' },
] as const;

const timelines = ['2 weeks', '1 month', '2 months', '3 months', '6 months', '1 year'];

const aiRecommendations: Record<string, string[]> = {
  workout: ['Aim for 4-5 workouts per week', 'Include both strength and cardio', 'Gradually increase weights by 5% weekly'],
  nutrition: ['Target 2g protein per kg of bodyweight', 'Stay within 500 kcal of maintenance', 'Eat 5 servings of vegetables daily'],
  weight: ['Aim for 0.5-1 kg loss per week', 'Combine diet and exercise for best results', 'Track progress with weekly weigh-ins'],
  water: ['Drink at least 8 cups (2L) per day', 'Increase intake on workout days', 'Use a water tracking app'],
  sleep: ['Aim for 7-9 hours per night', 'Maintain consistent sleep schedule', 'Avoid screens 1 hour before bed'],
  steps: ['Start with 8,000 steps daily', 'Increase by 500 steps weekly', 'Use stairs instead of elevator'],
};

export default function AIGoalPlannerScreen({ navigation }: Props) {
  const [goalType, setGoalType] = useState<string>('workout');
  const [targetValue, setTargetValue] = useState('');
  const [timeline, setTimeline] = useState(timelines[1]);
  const [milestones, setMilestones] = useState<string[]>(['', '', '']);
  const [saved, setSaved] = useState(false);

  const canSave = targetValue.trim().length > 0;

  const updateMilestone = (index: number, value: string) => {
    setMilestones((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => navigation.goBack(), 1500);
  };

  const typedRecommendations = aiRecommendations[goalType] || aiRecommendations.workout;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>AI Goal Planner</Text>
        </View>

        <Text style={styles.label}>Goal Type</Text>
        <View style={styles.goalTypeRow}>
          {goalTypes.map((gt) => (
            <Pressable
              key={gt.key}
              style={[styles.goalTypeChip, goalType === gt.key && styles.goalTypeChipActive]}
              onPress={() => setGoalType(gt.key)}
            >
              <Ionicons
                name={gt.icon as any}
                size={18}
                color={goalType === gt.key ? colors.textInverse : colors.textSecondary}
              />
              <Text style={[styles.goalTypeLabel, goalType === gt.key && styles.goalTypeLabelActive]}>{gt.label}</Text>
            </Pressable>
          ))}
        </View>

        <Card style={styles.fieldCard}>
          <Text style={styles.inputLabel}>Target Value</Text>
          <TextInput
            style={styles.input}
            value={targetValue}
            onChangeText={setTargetValue}
            placeholder={goalType === 'workout' ? 'e.g. 5 workouts/week' : goalType === 'weight' ? 'e.g. 75 kg' : goalType === 'water' ? 'e.g. 8 cups' : goalType === 'steps' ? 'e.g. 10000 steps' : 'e.g. 8 hours'}
            placeholderTextColor={colors.textMuted}
          />

          <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>Timeline</Text>
          <View style={styles.timelineRow}>
            {timelines.map((t) => (
              <Pressable
                key={t}
                style={[styles.timelineChip, timeline === t && styles.timelineChipActive]}
                onPress={() => setTimeline(t)}
              >
                <Text style={[styles.timelineText, timeline === t && styles.timelineTextActive]}>{t}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>Milestones</Text>
          {milestones.map((m, i) => (
            <TextInput
              key={i}
              style={[styles.input, { marginBottom: spacing.sm }]}
              value={m}
              onChangeText={(v) => updateMilestone(i, v)}
              placeholder={`Milestone ${i + 1}`}
              placeholderTextColor={colors.textMuted}
            />
          ))}
        </Card>

        <Card style={styles.recommendationsCard}>
          <Text style={styles.sectionTitle}>AI Recommendations</Text>
          {typedRecommendations.map((rec, i) => (
            <View key={i} style={styles.recRow}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.recText}>{rec}</Text>
            </View>
          ))}
        </Card>

        {saved ? (
          <Card style={styles.savedCard}>
            <Ionicons name="checkmark-circle" size={40} color={colors.success} />
            <Text style={styles.savedText}>Goal saved successfully!</Text>
          </Card>
        ) : (
          <Button title="Save Goal" style={styles.saveBtn} onPress={handleSave} disabled={!canSave} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: { marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  label: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600', marginBottom: spacing.sm },
  goalTypeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  goalTypeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  goalTypeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  goalTypeLabel: { ...typography.bodySmall, color: colors.textSecondary },
  goalTypeLabelActive: { color: colors.textInverse },
  fieldCard: { padding: spacing.md, marginBottom: spacing.md },
  inputLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs, fontWeight: '600' },
  input: { backgroundColor: colors.surfaceTertiary, borderRadius: borderRadius.sm, padding: spacing.sm, ...typography.body, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  timelineRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  timelineChip: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: colors.surfaceTertiary, borderWidth: 1, borderColor: colors.border },
  timelineChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  timelineText: { ...typography.caption, color: colors.textSecondary },
  timelineTextActive: { color: colors.textInverse },
  recommendationsCard: { padding: spacing.md, marginBottom: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  recRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm, alignItems: 'flex-start' },
  recText: { ...typography.bodySmall, color: colors.textSecondary, flex: 1 },
  savedCard: { padding: spacing.lg, alignItems: 'center', gap: spacing.sm },
  savedText: { ...typography.h4, color: colors.success },
  saveBtn: { marginTop: spacing.sm },
});
