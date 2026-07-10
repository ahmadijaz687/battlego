import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../theme';
import { useTheme, ThemeMode } from '../theme/ThemeContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { getItem, setItem } from '../utils/storage';

type Units = 'metric' | 'imperial';

export default function SettingsScreen() {
  const { mode, setMode } = useTheme();
  const [notifications, setNotifications] = useState({
    workout: true,
    nutrition: true,
    social: false,
    battle: true,
  });
  const [units, setUnits] = useState<Units>(() => getItem<Units>('settings.units') || 'metric');

  useEffect(() => {
    setItem('settings.units', units);
  }, [units]);

  const themeOptions: { label: string; value: ThemeMode }[] = [
    { label: 'Dark', value: 'dark' },
    { label: 'Light', value: 'light' },
    { label: 'System', value: 'system' },
    { label: 'AMOLED', value: 'amoled' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>
          <View style={styles.themeRow}>
            {themeOptions.map((option) => (
              <Button
                key={option.value}
                title={option.label}
                variant={mode === option.value ? 'primary' : 'outline'}
                size="sm"
                style={styles.themeButton}
                onPress={() => setMode(option.value)}
              />
            ))}
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {Object.entries(notifications).map(([key, value]) => (
            <View key={key} style={styles.switchRow}>
              <Text style={styles.switchLabel}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <Switch
                value={value}
                onValueChange={(newValue) =>
                  setNotifications((prev) => ({ ...prev, [key]: newValue }))
                }
                trackColor={{ false: colors.border, true: colors.primarySoft }}
                thumbColor={value ? colors.primary : colors.textMuted}
              />
            </View>
          ))}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Units</Text>
          <View style={styles.themeRow}>
            <Button title="Metric" variant={units === 'metric' ? 'primary' : 'outline'} size="sm" style={styles.themeButton} onPress={() => setUnits('metric')} />
            <Button title="Imperial" variant={units === 'imperial' ? 'primary' : 'outline'} size="sm" style={styles.themeButton} onPress={() => setUnits('imperial')} />
          </View>
        </Card>

        <Text style={styles.version}>Fitness Battle v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  section: { padding: spacing.md, marginBottom: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  themeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  themeButton: { flex: 1, minWidth: 70 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  switchLabel: { ...typography.body, color: colors.textPrimary },
  version: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
