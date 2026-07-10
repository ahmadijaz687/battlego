import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<ProfileStackParamList, 'HealthIntegrations'>;

interface HealthProvider {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  lastSync: string | null;
  dataTypes: string[];
}

const providers: HealthProvider[] = [
  { id: 'apple_health', name: 'Apple Health', icon: '🍎', connected: true, lastSync: '2 min ago', dataTypes: ['Steps', 'Heart Rate', 'Workouts', 'Sleep', 'Weight'] },
  { id: 'health_connect', name: 'Health Connect', icon: '❤️', connected: false, lastSync: null, dataTypes: ['Steps', 'Weight', 'Height', 'Activity'] },
  { id: 'fitbit', name: 'Fitbit', icon: '📊', connected: false, lastSync: null, dataTypes: ['Steps', 'Sleep', 'Heart Rate', 'Calories'] },
  { id: 'garmin', name: 'Garmin', icon: '⌚', connected: false, lastSync: null, dataTypes: ['Workouts', 'Heart Rate', 'Steps', 'Sleep'] },
  { id: 'samsung_health', name: 'Samsung Health', icon: '📱', connected: false, lastSync: null, dataTypes: ['Steps', 'Heart Rate', 'Weight', 'Water'] },
];

const dataTypeIcons: Record<string, string> = {
  Steps: 'walk',
  'Heart Rate': 'heart',
  Workouts: 'fitness',
  Sleep: 'moon',
  Weight: 'scale',
  Height: 'resize',
  Activity: 'pulse',
  Calories: 'flame',
  Water: 'water',
};

export default function HealthIntegrationsScreen({ navigation }: Props) {
  const [integrations, setIntegrations] = useState(providers);
  const [syncing, setSyncing] = useState<string | null>(null);

  const handleConnect = (providerId: string) => {
    setIntegrations((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, connected: true, lastSync: 'Just now' } : p
      )
    );
  };

  const handleDisconnect = (providerId: string) => {
    setIntegrations((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, connected: false, lastSync: null } : p
      )
    );
  };

  const handleSync = (providerId: string) => {
    setSyncing(providerId);
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((p) => (p.id === providerId ? { ...p, lastSync: 'Just now' } : p))
      );
      setSyncing(null);
    }, 1500);
  };

  const handleSyncAll = () => {
    const allIds = integrations.filter((p) => p.connected).map((p) => p.id);
    allIds.forEach((id) => handleSync(id));
  };

  const connectedCount = integrations.filter((p) => p.connected).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Health Integrations</Text>
          <Text style={styles.subtitle}>{connectedCount} of {integrations.length} connected</Text>
        </View>

        {connectedCount > 0 && (
          <Button
            title="Sync All Connected"
            variant="outline"
            style={styles.syncAllBtn}
            onPress={handleSyncAll}
          />
        )}

        {integrations.map((provider) => (
          <Card key={provider.id} style={styles.providerCard}>
            <View style={styles.providerHeader}>
              <Text style={styles.providerIcon}>{provider.icon}</Text>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{provider.name}</Text>
                {provider.connected && provider.lastSync ? (
                  <Text style={styles.syncTime}>Last sync: {provider.lastSync}</Text>
                ) : (
                  <Text style={styles.notConnected}>Not connected</Text>
                )}
              </View>
              <View style={[styles.connectionDot, { backgroundColor: provider.connected ? colors.success : colors.statusInactive }]} />
            </View>

            <View style={styles.dataTypesRow}>
              {provider.dataTypes.map((dt) => (
                <View key={dt} style={styles.dataTypeChip}>
                  <Ionicons name={(dataTypeIcons[dt] || 'ellipse') as any} size={12} color={colors.textMuted} />
                  <Text style={styles.dataTypeText}>{dt}</Text>
                </View>
              ))}
            </View>

            <View style={styles.providerActions}>
              {provider.connected ? (
                <>
                  <Button
                    title={syncing === provider.id ? 'Syncing...' : 'Sync Now'}
                    variant="outline"
                    style={styles.providerBtn}
                    onPress={() => handleSync(provider.id)}
                    disabled={syncing === provider.id}
                  />
                  <Button
                    title="Disconnect"
                    variant="outline"
                    style={[styles.providerBtn, { borderColor: colors.error }]}
                    onPress={() => handleDisconnect(provider.id)}
                  />
                </>
              ) : (
                <Button title="Connect" style={styles.providerBtn} onPress={() => handleConnect(provider.id)} />
              )}
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: { marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4 },
  syncAllBtn: { marginBottom: spacing.md },
  providerCard: { padding: spacing.md, marginBottom: spacing.md },
  providerHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  providerIcon: { fontSize: 32 },
  providerInfo: { flex: 1 },
  providerName: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  syncTime: { ...typography.caption, color: colors.textMuted },
  notConnected: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic' },
  connectionDot: { width: 10, height: 10, borderRadius: 5 },
  dataTypesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  dataTypeChip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.surfaceTertiary, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  dataTypeText: { ...typography.tiny, color: colors.textMuted },
  providerActions: { flexDirection: 'row', gap: spacing.sm },
  providerBtn: { flex: 1 },
});
