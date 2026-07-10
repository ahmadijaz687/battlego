import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useSettingsStore } from '../../store/settingsStore';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Switch } from '../../components/Switch';
import { Card } from '../../components/Card';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<ProfileStackParamList, 'SettingsSecurity'>;

const timeoutOptions = [
  { label: '1 minute', value: 1 },
  { label: '5 minutes', value: 5 },
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: 'Never', value: 0 },
];

const activeSessions = [
  { device: 'iPhone 15 Pro', location: 'New York, US', lastActive: 'Just now', current: true },
  { device: 'MacBook Air', location: 'New York, US', lastActive: '2 hours ago', current: false },
];

export default function SecurityScreen({ navigation }: Props) {
  const security = useSettingsStore((s) => s.security);
  const updateSecurity = useSettingsStore((s) => s.updateSecurity);
  const [showTimeoutPicker, setShowTimeoutPicker] = useState(false);

  const timeoutLabel = timeoutOptions.find((o) => o.value === security.sessionTimeout)?.label ?? '30 minutes';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Security" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Button title="Change Password" variant="outline" onPress={() => {}} />
        </Card>

        <Card style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <Ionicons name="finger-print" size={20} color={colors.textSecondary} style={styles.icon} />
              <Text style={styles.switchLabel}>Biometric Login</Text>
            </View>
            <Switch
              value={security.biometricLogin}
              onValueChange={(val) => updateSecurity({ biometricLogin: val })}
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Session Timeout</Text>
          <Button
            title={timeoutLabel}
            variant="ghost"
            onPress={() => setShowTimeoutPicker(!showTimeoutPicker)}
          />
          {showTimeoutPicker && (
            <View style={styles.timeoutList}>
              {timeoutOptions.map((opt) => (
                <Button
                  key={opt.value}
                  title={opt.label}
                  variant={security.sessionTimeout === opt.value ? 'primary' : 'ghost'}
                  size="sm"
                  style={styles.timeoutOption}
                  onPress={() => {
                    updateSecurity({ sessionTimeout: opt.value });
                    setShowTimeoutPicker(false);
                  }}
                />
              ))}
            </View>
          )}
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Active Sessions</Text>
          {activeSessions.map((session, index) => (
            <View key={index} style={styles.sessionRow}>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionDevice}>{session.device}</Text>
                <Text style={styles.sessionMeta}>
                  {session.location} · {session.lastActive}
                </Text>
              </View>
              {session.current && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentText}>Current</Text>
                </View>
              )}
            </View>
          ))}
        </Card>

        <Card style={styles.card}>
          <Button title="Login History" variant="ghost" onPress={() => {}} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  card: { padding: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { marginRight: spacing.sm },
  switchLabel: { ...typography.body, color: colors.textPrimary },
  timeoutList: { marginTop: spacing.sm, gap: spacing.xs },
  timeoutOption: { justifyContent: 'flex-start' },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sessionInfo: { flex: 1 },
  sessionDevice: { ...typography.body, color: colors.textPrimary },
  sessionMeta: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  currentBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: borderRadius.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  currentText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
});
