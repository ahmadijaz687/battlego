import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, borderRadius } from '../theme';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useProfileStore } from '../store/profileStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const STEPS = [
  { title: 'Welcome!', description: 'Let\'s set up your fitness journey' },
  { title: 'Your Goals', description: 'What do you want to achieve?' },
  { title: 'Experience', description: 'Tell us about your fitness level' },
  { title: 'Preferences', description: 'Customize your experience' },
  { title: 'Ready!', description: 'You\'re all set to start' },
];

const GOALS = [
  { id: 'lose_weight', label: 'Lose Weight', icon: '⚖️' },
  { id: 'build_muscle', label: 'Build Muscle', icon: '💪' },
  { id: 'endurance', label: 'Endurance', icon: '🏃' },
  { id: 'general', label: 'General Fitness', icon: '🎯' },
];

const LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export default function OnboardingScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { completeOnboarding } = useProfileStore();

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await completeOnboarding({
        goal: goal || 'general',
        experience: level || 'beginner',
        fitnessLevel: level || 'beginner',
        activityLevel: 'moderate',
        equipment: [],
        injuries: [],
      });
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return true;
      case 1: return goal !== null;
      case 2: return level !== null;
      case 3: return name.trim().length > 0;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.progressRow}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.dot, i <= step ? styles.dotActive : styles.dotInactive]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {step === 0 && (
          <View style={styles.heroLogo}>
            <View style={styles.logoTile}>
              <Text style={styles.logoText}>FB</Text>
            </View>
            <Text style={styles.brand}>FITNESS BATTLE</Text>
          </View>
        )}

        <Text style={styles.stepTitle}>{STEPS[step].title}</Text>
        <Text style={styles.stepDesc}>{STEPS[step].description}</Text>

        {step === 0 && (
          <Text style={styles.welcomeText}>We'll help you create personalized workouts, nutrition plans, and track your progress every step of the way.</Text>
        )}

        {step === 1 && (
          <View style={styles.grid}>
            {GOALS.map((g) => (
              <Pressable
                key={g.id}
                style={[styles.optionCard, goal === g.id && styles.optionActive]}
                onPress={() => setGoal(g.id)}
                accessibilityRole="button"
                accessibilityLabel={g.label}
                accessibilityState={{ selected: goal === g.id }}
              >
                <Text style={styles.optionIcon}>{g.icon}</Text>
                <Text style={styles.optionLabel}>{g.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {step === 2 && (
          <View style={styles.list}>
            {LEVELS.map((l) => (
              <Pressable
                key={l.id}
                style={[styles.listCard, level === l.id && styles.listActive]}
                onPress={() => setLevel(l.id)}
                accessibilityRole="button"
                accessibilityLabel={l.label}
                accessibilityState={{ selected: level === l.id }}
              >
                <Text style={[styles.listLabel, level === l.id && styles.listLabelActive]}>{l.label}</Text>
                {level === l.id && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
              </Pressable>
            ))}
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.inputLabel}>What should we call you?</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              accessibilityLabel="Your name input"
            />
          </View>
        )}

        {step === 4 && (
          <View style={styles.readySection}>
            <Text style={styles.readyIcon}>🚀</Text>
            <Text style={styles.readyText}>You're all set, {name || 'Champion'}!</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 ? (
          <Pressable onPress={() => setStep(step - 1)} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Back">
            <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Skip">
            <Text style={styles.backText}>Skip</Text>
          </Pressable>
        )}
        <View style={{ flex: 1 }} />
        {step < STEPS.length - 1 ? (
          <Button title="Continue" variant="primary" fullWidth onPress={handleNext} disabled={!canProceed()} />
        ) : (
          <Button title="Get Started" variant="primary" fullWidth loading={loading} onPress={handleFinish} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: colors.primary },
  dotInactive: { backgroundColor: colors.border },
  content: { flexGrow: 1, padding: spacing.md },
  heroLogo: { alignItems: 'center', marginBottom: spacing.lg },
  logoTile: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: spacing.sm,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  brand: { ...typography.overline, color: colors.textSecondary, letterSpacing: 4 },
  stepTitle: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  stepDesc: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  welcomeText: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  optionCard: {
    width: '46%',
    padding: spacing.lg,
    borderRadius: borderRadius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  optionActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optionIcon: { fontSize: 32, marginBottom: spacing.sm },
  optionLabel: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  list: { gap: spacing.sm },
  listCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  listLabel: { ...typography.body, color: colors.textPrimary },
  listLabelActive: { color: colors.primary, fontWeight: '700' },
  inputLabel: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  readySection: { alignItems: 'center', paddingVertical: spacing.xl },
  readyIcon: { fontSize: 64, marginBottom: spacing.md },
  readyText: { ...typography.h2, color: colors.textPrimary, textAlign: 'center' },
  footer: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  backText: { color: colors.textSecondary, fontSize: 16 },
});
