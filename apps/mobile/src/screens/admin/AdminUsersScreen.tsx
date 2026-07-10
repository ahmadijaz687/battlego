import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { SearchBar } from '../../components/SearchBar';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import Avatar from '../../components/Avatar';
import { EmptyState } from '../../components/EmptyState';
import { Ionicons } from '@expo/vector-icons';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'active' | 'suspended' | 'banned';
  joinDate: string;
}

const mockUsers: AdminUser[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'JD', status: 'active', joinDate: '2024-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS', status: 'active', joinDate: '2024-02-20' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ', status: 'suspended', joinDate: '2024-03-10' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', avatar: 'SW', status: 'active', joinDate: '2024-04-05' },
  { id: '5', name: 'Alex Brown', email: 'alex@example.com', avatar: 'AB', status: 'banned', joinDate: '2024-05-12' },
];

export default function AdminUsersScreen() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState(mockUsers);

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSuspend = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u)));
    setSelectedUser(null);
  };

  const handleBan = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'banned' } : u)));
    setSelectedUser(null);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'suspended': return colors.warning;
      case 'banned': return colors.error;
      default: return colors.textMuted;
    }
  };

  const renderUser = ({ item }: { item: AdminUser }) => (
    <Pressable onPress={() => setSelectedUser(item)} style={styles.userCard}>
      <Avatar name={item.avatar} size={44} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) + '20' }]}>
        <View style={[styles.statusDot, { backgroundColor: statusColor(item.status) }]} />
        <Text style={[styles.statusText, { color: statusColor(item.status) }]}>{item.status}</Text>
      </View>
    </Pressable>
  );

  const selected = selectedUser;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Users</Text>
        <Text style={styles.subtitle}>{users.length} total users</Text>
      </View>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search users..."
        containerStyle={styles.searchBar}
      />

      <FlatList
        data={filtered}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="👥" title="No users found" description="Try a different search term" />}
      />

      <Modal visible={!!selectedUser} transparent animationType="fade" onRequestClose={() => setSelectedUser(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedUser(null)}>
          <Pressable style={styles.modalContent}>
            {selected && (
              <>
                <Avatar name={selected.avatar} size={72} />
                <Text style={styles.modalName}>{selected.name}</Text>
                <Text style={styles.modalEmail}>{selected.email}</Text>
                <Text style={styles.modalDate}>Joined: {selected.joinDate}</Text>

                <View style={styles.modalActions}>
                  <Button
                    title={selected.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                    variant={selected.status === 'suspended' ? 'primary' : 'outline'}
                    style={styles.modalBtn}
                    onPress={() => handleSuspend(selected.id)}
                  />
                  <Button
                    title="Ban"
                    variant="outline"
                    style={[styles.modalBtn, { borderColor: colors.error }]}
                    onPress={() => handleBan(selected.id)}
                  />
                </View>
                <Button title="Close" variant="ghost" onPress={() => setSelectedUser(null)} />
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4 },
  searchBar: { marginHorizontal: spacing.md, marginBottom: spacing.md },
  list: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, gap: spacing.sm },
  userInfo: { flex: 1 },
  userName: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  userEmail: { ...typography.caption, color: colors.textSecondary },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.full, gap: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { ...typography.caption, fontWeight: '600', textTransform: 'capitalize' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  modalContent: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, alignItems: 'center', width: '100%', maxWidth: 340 },
  modalName: { ...typography.h3, color: colors.textPrimary, marginTop: spacing.md },
  modalEmail: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4 },
  modalDate: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg },
  modalActions: { flexDirection: 'row', gap: spacing.sm, width: '100%' },
  modalBtn: { flex: 1 },
});
