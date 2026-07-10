import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useSettingsStore } from '../../store/settingsStore';
import { Header } from '../../components/Header';
import { RadioGroup } from '../../components/RadioGroup';
import { Switch } from '../../components/Switch';
import { Button } from '../../components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'SettingsPrivacy'>;

const visibilityOptions = [
  { label: 'Public', value: 'public' },
  { label: 'Friends', value: 'friends' },
  { label: 'Private', value: 'private' },
];

export default function PrivacyScreen({ navigation }: Props) {
  const privacy = useSettingsStore((s) => s.privacy);
  const updatePrivacy = useSettingsStore((s) => s.updatePrivacy);

  const blockedUsers: string[] = [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Privacy" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Profile Visibility</Text>
          <RadioGroup
            options={visibilityOptions}
            selectedValue={privacy.profileVisibility}
            onSelect={(value) => updatePrivacy({ profileVisibility: value as 'public' | 'friends' | 'private' })}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Posts Visibility</Text>
          <RadioGroup
            options={visibilityOptions}
            selectedValue={privacy.postsVisibility}
            onSelect={(value) => updatePrivacy({ postsVisibility: value as 'public' | 'friends' | 'private' })}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Show Activity</Text>
            <Switch
              value={privacy.showActivity}
              onValueChange={(val) => updatePrivacy({ showActivity: val })}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Show Battles</Text>
            <Switch
              value={privacy.showBattles}
              onValueChange={(val) => updatePrivacy({ showBattles: val })}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Blocked Users</Text>
          {blockedUsers.length === 0 ? (
            <Text style={styles.emptyText}>No blocked users</Text>
          ) : (
            blockedUsers.map((user) => (
              <View key={user} style={styles.blockedRow}>
                <Text style={styles.blockedName}>{user}</Text>
                <Button title="Unblock" variant="ghost" size="sm" onPress={() => {}} />
              </View>
            ))
          )}
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  switchLabel: { ...typography.body, color: colors.textPrimary },
  emptyText: { ...typography.bodySmall, color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.md },
  blockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  blockedName: { ...typography.body, color: colors.textPrimary },
});
