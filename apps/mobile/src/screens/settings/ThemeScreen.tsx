import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useTheme, ThemeMode } from '../../theme/ThemeContext';
import { useSettingsStore } from '../../store/settingsStore';
import { Header } from '../../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<ProfileStackParamList, 'SettingsTheme'>;

const themePreviews: { mode: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { mode: 'amoled', label: 'AMOLED', icon: 'moon' },
  { mode: 'dark', label: 'Dark', icon: 'moon-outline' },
  { mode: 'light', label: 'Light', icon: 'sunny' },
  { mode: 'system', label: 'System', icon: 'settings-outline' },
];

const previewColors: Record<ThemeMode, { bg: string; surface: string; text: string; accent: string }> = {
  amoled: { bg: '#000000', surface: '#050505', text: '#FFFFFF', accent: '#FF1F3D' },
  dark: { bg: '#050505', surface: '#161616', text: '#FFFFFF', accent: '#FF1F3D' },
  light: { bg: '#FFFFFF', surface: '#F5F5F5', text: '#000000', accent: '#FF1F3D' },
  system: { bg: '#050505', surface: '#161616', text: '#FFFFFF', accent: '#FF1F3D' },
};

export default function ThemeScreen({ navigation }: Props) {
  const { mode, setMode } = useTheme();
  const setStoreTheme = useSettingsStore((s) => s.setTheme);

  const handleSelect = (newMode: ThemeMode) => {
    setMode(newMode);
    setStoreTheme(newMode);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Theme" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>Choose your preferred appearance theme.</Text>
        {themePreviews.map(({ mode: m, label, icon }) => {
          const selected = mode === m;
          const preview = previewColors[m];
          return (
            <Pressable
              key={m}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => handleSelect(m)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={label}
            >
              <View style={[styles.previewCard, { backgroundColor: preview.bg }]}>
                <View style={styles.previewHeader}>
                  <View style={[styles.previewDot, { backgroundColor: preview.accent }]} />
                  <View style={[styles.previewBar, { backgroundColor: preview.surface }]} />
                </View>
                <View style={[styles.previewBody, { backgroundColor: preview.surface }]}>
                  <View style={[styles.previewLine, { backgroundColor: preview.text }]} />
                  <View style={[styles.previewLineShort, { backgroundColor: preview.text }]} />
                </View>
              </View>
              <View style={styles.optionInfo}>
                <Ionicons name={icon} size={22} color={colors.textPrimary} style={styles.optionIcon} />
                <Text style={styles.optionLabel}>{label}</Text>
              </View>
              {selected && (
                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  description: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionSelected: { borderColor: colors.primary },
  optionInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  optionIcon: { marginRight: spacing.sm },
  optionLabel: { ...typography.body, color: colors.textPrimary },
  previewCard: {
    width: 80,
    height: 60,
    borderRadius: borderRadius.sm,
    padding: 6,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  previewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  previewDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  previewBar: { flex: 1, height: 6, borderRadius: 3 },
  previewBody: { flex: 1, padding: 4, borderRadius: 3 },
  previewLine: { height: 4, borderRadius: 2, marginBottom: 3, opacity: 0.5 },
  previewLineShort: { height: 4, borderRadius: 2, width: '60%', opacity: 0.3 },
});
