import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BattleStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { Card } from '../components/Card';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<BattleStackParamList, 'BattleCreate'>;

const categories = ['Strength', 'Cardio', 'Weight Loss', 'Flexibility', 'Endurance', 'Core'];
const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
const durations = ['7 days', '14 days', '21 days', '30 days', '60 days'];

export default function BattleCreateScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState(durations[0]);
  const [maxParticipants, setMaxParticipants] = useState('20');
  const [isPublic, setIsPublic] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const canSubmit = title.trim() && description.trim() && goal.trim();

  const handleCreate = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Create Battle</Text>
          <View style={{ width: 24 }} />
        </View>

        <TextField label="Battle Title" value={title} onChangeText={setTitle} placeholder="e.g. 30 Day Push-up Challenge" containerStyle={styles.field} />

        <TextField label="Description" value={description} onChangeText={setDescription} placeholder="Describe the challenge..." multiline containerStyle={styles.field} />

        <Text style={styles.label}>Category</Text>
        <View style={styles.optionRow}>
          {categories.map((c) => (
            <Pressable key={c} style={[styles.optionChip, category === c && styles.optionChipActive]} onPress={() => setCategory(c)}>
              <Text style={[styles.optionText, category === c && styles.optionTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Difficulty</Text>
        <View style={styles.optionRow}>
          {difficulties.map((d) => (
            <Pressable key={d} style={[styles.optionChip, difficulty === d && styles.optionChipActive]} onPress={() => setDifficulty(d)}>
              <Text style={[styles.optionText, difficulty === d && styles.optionTextActive]}>{d}</Text>
            </Pressable>
          ))}
        </View>

        <TextField label="Goal / Target" value={goal} onChangeText={setGoal} placeholder="e.g. 1000 push-ups total" containerStyle={styles.field} />

        <Text style={styles.label}>Duration</Text>
        <View style={styles.optionRow}>
          {durations.map((d) => (
            <Pressable key={d} style={[styles.optionChip, duration === d && styles.optionChipActive]} onPress={() => setDuration(d)}>
              <Text style={[styles.optionText, duration === d && styles.optionTextActive]}>{d}</Text>
            </Pressable>
          ))}
        </View>

        <TextField label="Start Date (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} placeholder="2024-08-01" containerStyle={styles.field} />
        <TextField label="End Date (YYYY-MM-DD)" value={endDate} onChangeText={setEndDate} placeholder="2024-08-30" containerStyle={styles.field} />
        <TextField label="Max Participants" value={maxParticipants} onChangeText={setMaxParticipants} keyboardType="numeric" containerStyle={styles.field} />

        <Text style={styles.label}>Visibility</Text>
        <View style={styles.optionRow}>
          <Pressable style={[styles.optionChip, isPublic && styles.optionChipActive]} onPress={() => setIsPublic(true)}>
            <Ionicons name="globe" size={16} color={isPublic ? colors.textInverse : colors.textSecondary} />
            <Text style={[styles.optionText, isPublic && styles.optionTextActive, { marginLeft: 4 }]}>Public</Text>
          </Pressable>
          <Pressable style={[styles.optionChip, !isPublic && styles.optionChipActive]} onPress={() => setIsPublic(false)}>
            <Ionicons name="lock-closed" size={16} color={!isPublic ? colors.textInverse : colors.textSecondary} />
            <Text style={[styles.optionText, !isPublic && styles.optionTextActive, { marginLeft: 4 }]}>Private</Text>
          </Pressable>
        </View>

        <Button title="Create Battle" style={styles.createBtn} onPress={handleCreate} disabled={!canSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.textPrimary },
  field: { marginBottom: spacing.md },
  label: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm, fontWeight: '600' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  optionChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  optionChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionText: { ...typography.bodySmall, color: colors.textSecondary },
  optionTextActive: { color: colors.textInverse },
  createBtn: { marginTop: spacing.lg },
});
