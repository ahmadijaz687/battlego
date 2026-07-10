import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import { SegmentedControl } from '../../components/SegmentedControl';
import { useAIStore } from '../../store/aiStore';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'AISettings'>;

export default function AISettingsScreen({ navigation }: Props) {
  const { settings, updateSettings, personalities, activePersonality, setPersonality, fetchPersonalities, isLoadingPersonalities } = useAIStore();

  useEffect(() => {
    fetchPersonalities();
  }, []);

  const goalOptions = ['weight_loss', 'muscle_gain', 'strength', 'endurance', 'general_fitness'];
  const experienceOptions = ['beginner', 'intermediate', 'advanced'];
  const unitOptions = ['metric', 'imperial'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text style={styles.title}>AI Settings</Text>
        </View>

        <PremiumCard variant="glass" style={styles.section}>
          <Text style={styles.sectionTitle}>Coach Personality</Text>
          <Text style={styles.sectionDesc}>Choose your coaching style</Text>
          {isLoadingPersonalities ? (
            <ActivityIndicator color={colors.primary} style={styles.loading} />
          ) : (
            <View style={styles.personalityList}>
              {personalities.map((p) => (
                <Pressable
                  key={p.id}
                  style={[
                    styles.personalityCard,
                    activePersonality?.id === p.id && styles.personalityCardActive,
                  ]}
                  onPress={() => setPersonality(p)}
                  accessibilityLabel={`Select ${p.name}`}
                >
                  <Text style={[
                    styles.personalityName,
                    activePersonality?.id === p.id && styles.personalityNameActive,
                  ]}>
                    {p.name}
                  </Text>
                  <Text style={styles.personalityDesc}>{p.description}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </PremiumCard>

        <PremiumCard variant="glass" style={styles.section}>
          <Text style={styles.sectionTitle}>Goal</Text>
          <SegmentedControl
            options={goalOptions.map(g => ({ label: g.replace('_', ' '), value: g }))}
            value={settings.goal}
            onChange={(value) => updateSettings({ goal: value as any })}
          />
        </PremiumCard>

        <PremiumCard variant="glass" style={styles.section}>
          <Text style={styles.sectionTitle}>Experience Level</Text>
          <SegmentedControl
            options={experienceOptions.map(l => ({ label: l, value: l }))}
            value={settings.experienceLevel}
            onChange={(value) => updateSettings({ experienceLevel: value as any })}
          />
        </PremiumCard>

        <PremiumCard variant="glass" style={styles.section}>
          <Text style={styles.sectionTitle}>Units</Text>
          <SegmentedControl
            options={unitOptions.map(u => ({ label: u, value: u }))}
            value={settings.units}
            onChange={(value) => updateSettings({ units: value as any })}
          />
        </PremiumCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  section: { padding: spacing.md, marginBottom: spacing.md },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.xs },
  sectionDesc: { color: colors.textSecondary, fontSize: 13, marginBottom: spacing.md },
  loading: { padding: spacing.lg },
  personalityList: { gap: spacing.sm },
  personalityCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.border,
  },
  personalityCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  personalityName: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  personalityNameActive: {
    color: colors.primary,
  },
  personalityDesc: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
