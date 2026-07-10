import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

interface StatCard {
  label: string;
  value: string;
  icon: string;
  color: string;
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
}

export default function AdminDashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [serverStatus, setServerStatus] = useState<'online' | 'degraded' | 'offline'>('online');

  const stats: StatCard[] = [
    { label: 'Total Users', value: '12,847', icon: 'people', color: colors.info },
    { label: 'Active Users', value: '3,421', icon: 'person', color: colors.success },
    { label: 'Total Workouts', value: '89,234', icon: 'fitness', color: colors.primary },
    { label: 'Total Battles', value: '15,672', icon: 'trophy', color: colors.accentOrange },
  ];

  const recentActivity: ActivityItem[] = [
    { id: '1', user: 'John Doe', action: 'Completed a workout', time: '2 min ago' },
    { id: '2', user: 'Jane Smith', action: 'Created a battle', time: '5 min ago' },
    { id: '3', user: 'Mike Johnson', action: 'Reported a post', time: '10 min ago' },
    { id: '4', user: 'Sarah Wilson', action: 'Updated profile', time: '15 min ago' },
    { id: '5', user: 'Alex Brown', action: 'Joined a community', time: '20 min ago' },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const statusColor = serverStatus === 'online' ? colors.success : serverStatus === 'degraded' ? colors.warning : colors.error;
  const statusLabel = serverStatus === 'online' ? 'Online' : serverStatus === 'degraded' ? 'Degraded' : 'Offline';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <Text style={styles.title}>Admin Dashboard</Text>

        <View style={styles.serverStatus}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={styles.statusText}>Server: {statusLabel}</Text>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <Card key={stat.label} style={styles.statCard}>
              <Text style={[styles.statIcon, { color: stat.color }]}>{stat.icon === 'people' ? '👥' : stat.icon === 'person' ? '👤' : stat.icon === 'fitness' ? '💪' : '🏆'}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <Button title="Manage Users" variant="outline" style={styles.quickActionBtn} onPress={() => {}} />
            <Button title="Manage Workouts" variant="outline" style={styles.quickActionBtn} onPress={() => {}} />
          </View>
          <View style={styles.quickActionsRow}>
            <Button title="View Reports" variant="outline" style={styles.quickActionBtn} onPress={() => {}} />
            <Button title="System Logs" variant="outline" style={styles.quickActionBtn} onPress={() => {}} />
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((item) => (
            <View key={item.id} style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  <Text style={styles.activityUser}>{item.user}</Text> {item.action}
                </Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  serverStatus: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  statusText: { ...typography.body, color: colors.textSecondary },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  statCard: { width: '48%', padding: spacing.md, alignItems: 'center', flexGrow: 1 },
  statIcon: { fontSize: 28, marginBottom: spacing.xs },
  statValue: { ...typography.h2, color: colors.textPrimary },
  statLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  section: { padding: spacing.md, marginBottom: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing.md },
  quickActionsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  quickActionBtn: { flex: 1 },
  activityItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.smd, gap: spacing.sm },
  activityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6 },
  activityContent: { flex: 1 },
  activityText: { ...typography.bodySmall, color: colors.textPrimary },
  activityUser: { fontWeight: '700' },
  activityTime: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
});
