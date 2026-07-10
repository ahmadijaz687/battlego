import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Ionicons } from '@expo/vector-icons';

interface Report {
  id: string;
  reporterName: string;
  reportedUser: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

const mockReports: Report[] = [
  { id: '1', reporterName: 'Alice', reportedUser: 'Bob', reason: 'Harassment', details: 'Offensive comments on a post.', status: 'pending', createdAt: '2024-07-01' },
  { id: '2', reporterName: 'Charlie', reportedUser: 'Dave', reason: 'Spam', details: 'Posting spam links in comments.', status: 'pending', createdAt: '2024-07-02' },
  { id: '3', reporterName: 'Eve', reportedUser: 'Frank', reason: 'Inappropriate Content', details: 'Shared explicit images.', status: 'resolved', createdAt: '2024-06-28' },
  { id: '4', reporterName: 'Grace', reportedUser: 'Hank', reason: 'Fake Profile', details: 'Impersonating another user.', status: 'dismissed', createdAt: '2024-06-25' },
  { id: '5', reporterName: 'Ivy', reportedUser: 'Jack', reason: 'Cheating', details: 'Using unauthorized apps in battles.', status: 'pending', createdAt: '2024-07-03' },
];

const statusFilters = ['All', 'pending', 'resolved', 'dismissed'] as const;

export default function AdminReportsScreen() {
  const [filter, setFilter] = useState<string>('All');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filtered = mockReports.filter((r) => filter === 'All' || r.status === filter);

  const statusColor = (s: string) => {
    switch (s) {
      case 'pending': return colors.accentOrange;
      case 'resolved': return colors.success;
      case 'dismissed': return colors.textMuted;
      default: return colors.textMuted;
    }
  };

  const renderReport = ({ item }: { item: Report }) => (
    <Pressable onPress={() => setSelectedReport(item)} style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportReason}>{item.reason}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.reportDetail}>
        <Text style={styles.reportLabel}>Reporter: </Text>{item.reporterName}
      </Text>
      <Text style={styles.reportDetail}>
        <Text style={styles.reportLabel}>Reported: </Text>{item.reportedUser}
      </Text>
      <Text style={styles.reportDate}>{item.createdAt}</Text>
    </Pressable>
  );

  const handleResolve = () => {
    if (selectedReport) setSelectedReport(null);
  };

  const handleDismiss = () => {
    if (selectedReport) setSelectedReport(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <Text style={styles.subtitle}>{mockReports.filter((r) => r.status === 'pending').length} pending</Text>
      </View>

      <View style={styles.filterRow}>
        {statusFilters.map((s) => (
          <Button
            key={s}
            title={s.charAt(0).toUpperCase() + s.slice(1)}
            variant={filter === s ? 'primary' : 'ghost'}
            style={styles.filterChip}
            onPress={() => setFilter(s)}
          />
        ))}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderReport}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="🚩" title="No reports found" description="All reports have been handled" />}
      />

      <Modal visible={!!selectedReport} transparent animationType="fade" onRequestClose={() => setSelectedReport(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedReport(null)}>
          <Pressable style={styles.modalContent}>
            {selectedReport && (
              <ScrollView>
                <Text style={styles.modalTitle}>{selectedReport.reason}</Text>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Reporter</Text>
                  <Text style={styles.modalValue}>{selectedReport.reporterName}</Text>
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Reported User</Text>
                  <Text style={styles.modalValue}>{selectedReport.reportedUser}</Text>
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Details</Text>
                  <Text style={styles.modalValue}>{selectedReport.details}</Text>
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Date</Text>
                  <Text style={styles.modalValue}>{selectedReport.createdAt}</Text>
                </View>
                <View style={styles.modalActions}>
                  <Button title="Resolve" style={styles.modalBtn} onPress={handleResolve} />
                  <Button title="Dismiss" variant="outline" style={styles.modalBtn} onPress={handleDismiss} />
                </View>
                <Button title="Close" variant="ghost" onPress={() => setSelectedReport(null)} />
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.bodySmall, color: colors.accentOrange },
  filterRow: { flexDirection: 'row', paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.md },
  filterChip: { paddingHorizontal: spacing.sm, paddingVertical: 0 },
  list: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },
  reportCard: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  reportReason: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  statusText: { ...typography.caption, fontWeight: '600', textTransform: 'capitalize' },
  reportDetail: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 2 },
  reportLabel: { color: colors.textMuted },
  reportDate: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: spacing.lg },
  modalContent: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, maxHeight: '80%' },
  modalTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },
  modalField: { marginBottom: spacing.sm },
  modalLabel: { ...typography.caption, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 2 },
  modalValue: { ...typography.body, color: colors.textPrimary },
  modalActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.sm },
  modalBtn: { flex: 1 },
});
