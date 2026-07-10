import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Ionicons } from '@expo/vector-icons';

interface LogEntry {
  id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  source: string;
}

const mockLogs: LogEntry[] = [
  { id: '1', level: 'info', message: 'User login successful', timestamp: '2024-07-08 10:23:45', source: 'auth' },
  { id: '2', level: 'warn', message: 'Rate limit approaching for IP 192.168.1.1', timestamp: '2024-07-08 10:20:12', source: 'middleware' },
  { id: '3', level: 'error', message: 'Database connection timeout', timestamp: '2024-07-08 10:15:30', source: 'database' },
  { id: '4', level: 'info', message: 'Workout created: Full Body Blast', timestamp: '2024-07-08 10:10:00', source: 'workout' },
  { id: '5', level: 'warn', message: 'Failed payment for user #4521', timestamp: '2024-07-08 10:05:22', source: 'billing' },
  { id: '6', level: 'error', message: 'Unhandled exception in battle service', timestamp: '2024-07-08 09:58:44', source: 'battle' },
  { id: '7', level: 'info', message: 'Batch job completed: daily_stats', timestamp: '2024-07-08 09:45:00', source: 'cron' },
  { id: '8', level: 'info', message: 'New user registered: user@example.com', timestamp: '2024-07-08 09:30:15', source: 'auth' },
];

const levelFilters = ['All', 'info', 'warn', 'error'] as const;

export default function AdminLogsScreen() {
  const [filter, setFilter] = useState<string>('All');
  const [logs, setLogs] = useState(mockLogs);

  const filtered = logs.filter((l) => filter === 'All' || l.level === filter);

  const levelColor = (level: string) => {
    switch (level) {
      case 'info': return colors.info;
      case 'warn': return colors.accentOrange;
      case 'error': return colors.error;
      default: return colors.textMuted;
    }
  };

  const levelIcon = (level: string) => {
    switch (level) {
      case 'info': return 'information-circle';
      case 'warn': return 'warning';
      case 'error': return 'alert-circle';
      default: return 'ellipse';
    }
  };

  const handleClear = () => {
    setLogs([]);
  };

  const renderLog = ({ item }: { item: LogEntry }) => (
    <View style={styles.logEntry}>
      <Ionicons name={levelIcon(item.level)} size={16} color={levelColor(item.level)} style={styles.logIcon} />
      <View style={styles.logContent}>
        <View style={styles.logHeader}>
          <Text style={[styles.logLevel, { color: levelColor(item.level) }]}>{item.level.toUpperCase()}</Text>
          <Text style={styles.logSource}>{item.source}</Text>
        </View>
        <Text style={styles.logMessage}>{item.message}</Text>
        <Text style={styles.logTimestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>System Logs</Text>
        {logs.length > 0 && (
          <Pressable onPress={handleClear} accessibilityLabel="Clear logs">
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.filterRow}>
        {levelFilters.map((l) => (
          <Button
            key={l}
            title={l.charAt(0).toUpperCase() + l.slice(1)}
            variant={filter === l ? 'primary' : 'ghost'}
            style={styles.filterChip}
            onPress={() => setFilter(l)}
          />
        ))}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderLog}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState icon="📋" title="No logs" description={logs.length === 0 ? 'Logs have been cleared' : 'No logs match the selected filter'} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  clearText: { ...typography.body, color: colors.error },
  filterRow: { flexDirection: 'row', paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.md },
  filterChip: { paddingHorizontal: spacing.sm, paddingVertical: 0 },
  list: { paddingHorizontal: spacing.md, gap: 2, paddingBottom: spacing.xxl },
  logEntry: { flexDirection: 'row', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  logIcon: { marginRight: spacing.sm, marginTop: 2 },
  logContent: { flex: 1 },
  logHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 2 },
  logLevel: { ...typography.caption, fontWeight: '700', fontSize: 11 },
  logSource: { ...typography.caption, color: colors.textMuted },
  logMessage: { ...typography.small, color: colors.textPrimary, marginBottom: 2 },
  logTimestamp: { ...typography.tiny, color: colors.textDisabled },
});
