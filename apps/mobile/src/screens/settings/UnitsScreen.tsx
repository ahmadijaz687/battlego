import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useSettingsStore } from '../../store/settingsStore';
import { Header } from '../../components/Header';
import { RadioGroup } from '../../components/RadioGroup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'SettingsUnits'>;

const systemOptions = [
  { label: 'Metric', value: 'metric' },
  { label: 'Imperial', value: 'imperial' },
];

const weightOptions = [
  { label: 'kg', value: 'kg' },
  { label: 'lbs', value: 'lbs' },
];

const heightOptions = [
  { label: 'cm', value: 'cm' },
  { label: 'ft', value: 'ft' },
];

const distanceOptions = [
  { label: 'km', value: 'km' },
  { label: 'mi', value: 'mi' },
];

export default function UnitsScreen({ navigation }: Props) {
  const measurementSystem = useSettingsStore((s) => s.measurementSystem);
  const weightUnit = useSettingsStore((s) => s.weightUnit);
  const heightUnit = useSettingsStore((s) => s.heightUnit);
  const distanceUnit = useSettingsStore((s) => s.distanceUnit);
  const setMeasurementSystem = useSettingsStore((s) => s.setMeasurementSystem);
  const setWeightUnit = useSettingsStore((s) => s.setWeightUnit);
  const setHeightUnit = useSettingsStore((s) => s.setHeightUnit);
  const setDistanceUnit = useSettingsStore((s) => s.setDistanceUnit);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Units" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Measurement System</Text>
          <RadioGroup
            options={systemOptions}
            selectedValue={measurementSystem}
            onSelect={(value) => setMeasurementSystem(value as 'metric' | 'imperial')}
            layout="horizontal"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Weight Unit</Text>
          <RadioGroup
            options={weightOptions}
            selectedValue={weightUnit}
            onSelect={(value) => setWeightUnit(value as 'kg' | 'lbs')}
            layout="horizontal"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Height Unit</Text>
          <RadioGroup
            options={heightOptions}
            selectedValue={heightUnit}
            onSelect={(value) => setHeightUnit(value as 'cm' | 'ft')}
            layout="horizontal"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Distance Unit</Text>
          <RadioGroup
            options={distanceOptions}
            selectedValue={distanceUnit}
            onSelect={(value) => setDistanceUnit(value as 'km' | 'mi')}
            layout="horizontal"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm },
});
