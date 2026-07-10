import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
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

type Props = NativeStackScreenProps<ProfileStackParamList, 'SettingsBackup'>;

export default function BackupScreen({ navigation }: Props) {
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [autoBackup, setAutoBackup] = useState(false);
  const lastBackup = '2026-07-07 14:30';

  const handleCreateBackup = () => {
    setBackingUp(true);
    setTimeout(() => setBackingUp(false), 2000);
  };

  const handleRestoreBackup = () => {
    setRestoring(true);
    setTimeout(() => setRestoring(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Backup & Export" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Backup</Text>
          <View style={styles.lastBackupRow}>
            <Ionicons name="time-outline" size={18} color={colors.textMuted} />
            <Text style={styles.lastBackupText}>
              Last backup: {lastBackup}
            </Text>
          </View>
          <Button
            title={backingUp ? 'Creating Backup...' : 'Create Backup'}
            variant="primary"
            onPress={handleCreateBackup}
            loading={backingUp}
            style={styles.backupButton}
          />
          <Button
            title={restoring ? 'Restoring...' : 'Restore Backup'}
            variant="outline"
            onPress={handleRestoreBackup}
            loading={restoring}
            style={styles.backupButton}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Auto-backup</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Enable auto-backup</Text>
            <Switch value={autoBackup} onValueChange={setAutoBackup} />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Export Data</Text>
          <Button title="Export as JSON" variant="outline" style={styles.exportButton} onPress={() => {}} />
          <Button title="Export as CSV" variant="outline" style={styles.exportButton} onPress={() => {}} />
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
  lastBackupRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  lastBackupText: { ...typography.bodySmall, color: colors.textMuted, marginLeft: spacing.sm },
  backupButton: { marginBottom: spacing.sm },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: { ...typography.body, color: colors.textPrimary },
  exportButton: { marginBottom: spacing.sm },
});
