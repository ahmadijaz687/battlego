import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import Avatar from '../../components/Avatar';
import { Button } from '../../components/Button';
import { SearchBar } from '../../components/SearchBar';
import { EmptyState } from '../../components/EmptyState';
import { useSocialStore } from '../../store/socialStore';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Friends'>;

export default function FriendsScreen({ navigation }: Props) {
  const { friends, friendRequests, fetchFriends, fetchFriendRequests, acceptFriendRequest, sendFriendRequest, isLoading } = useSocialStore();
  const [showAdd, setShowAdd] = useState(false);
  const [addUsername, setAddUsername] = useState('');

  useEffect(() => { fetchFriends(); fetchFriendRequests(); }, []);

  const handleAddFriend = () => {
    if (!addUsername.trim()) {
      setShowAdd(!showAdd);
      return;
    }
    sendFriendRequest(addUsername.trim());
    setAddUsername('');
    setShowAdd(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Friends</Text>
      </View>

      {showAdd && (
        <View style={styles.addRow}>
          <TextInput
            style={styles.addInput}
            placeholder="Enter username"
            placeholderTextColor={colors.textMuted}
            value={addUsername}
            onChangeText={setAddUsername}
            autoFocus
          />
          <Button title="Send" variant="primary" size="sm" onPress={handleAddFriend} loading={isLoading} />
        </View>
      )}
      <View style={styles.searchRow}>
        <SearchBar placeholder="Search friends..." style={styles.search} />
        <Pressable onPress={handleAddFriend} accessibilityLabel="Add friend">
          <Ionicons name="person-add" size={22} color={colors.primary} />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            friendRequests && friendRequests.length > 0 ? (
              <>
                <Text style={styles.section}>Friend Requests ({friendRequests.length})</Text>
                {friendRequests.map((f) => (
                  <PremiumCard key={f.id} variant="glass" style={styles.friendCard}>
                    <View style={styles.friendRow}>
                      <View style={styles.avatarWrap}>
                        <Avatar size={40} />
                      </View>
                      <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{f.name || f.username}</Text>
                        <Text style={styles.friendUser}>{f.lastSeen ? new Date(f.lastSeen).toLocaleDateString() : ''}</Text>
                      </View>
                    </View>
                    <View style={styles.actions}>
                      <Button title="Accept" variant="primary" size="sm" onPress={() => acceptFriendRequest(f.id)} />
                      <Button title="Decline" variant="ghost" size="sm" />
                    </View>
                  </PremiumCard>
                ))}
              </>
            ) : null
          }
          data={friends || [] as any}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PremiumCard variant="glass" pressable style={styles.friendCard}>
              <View style={styles.friendRow}>
                <View style={styles.avatarWrap}>
                  <Avatar size={40} />
                  {item.status === 'online' && <View style={styles.onlineDot} />}
                </View>
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{item.name}</Text>
                  <Text style={styles.friendUser}>{item.username}</Text>
                </View>
              </View>
            </PremiumCard>
          )}
          ListEmptyComponent={<EmptyState icon="👥" title="No friends yet" description="Send friend requests to connect" />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, marginLeft: spacing.md },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  addInput: { flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.sm, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  search: { flex: 1 },
  section: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm, marginTop: spacing.md },
  friendCard: { padding: spacing.md, marginBottom: spacing.sm },
  friendRow: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { position: 'relative' },
  onlineDot: { position: 'absolute', right: 2, bottom: 2, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.background },
  friendInfo: { marginLeft: spacing.sm },
  friendName: { color: colors.textPrimary, fontWeight: '600' },
  friendUser: { color: colors.textSecondary, fontSize: 12 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
});