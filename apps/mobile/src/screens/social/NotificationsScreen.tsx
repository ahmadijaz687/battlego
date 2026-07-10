import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, spacing, typography } from '../../theme';
import { PremiumCard } from '../../components/PremiumCard';
import Avatar from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { Ionicons } from '@expo/vector-icons';
import { useNotificationStore } from '../../store/notificationStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

export default function NotificationsScreen({ navigation }: Props) {
  const { notifications, fetchNotifications, isLoading } = useNotificationStore();

  useEffect(() => { fetchNotifications(); }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
        <Pressable accessibilityLabel="Mark all read">
          <Text style={styles.markRead}>Mark All Read</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PremiumCard variant={item.read ? 'glass' : 'elevated'} style={styles.notifCard}>
              <View style={styles.notifRow}>
                <Avatar size={40} />
                <View style={styles.notifInfo}>
                  <Text style={styles.notifText}>
                    <Text style={styles.bold}>{item.title}</Text> {item.content}
                  </Text>
                  <Text style={styles.notifTime}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</Text>
                </View>
                {!item.read && <Badge label="New" variant="primary" size="sm" />}
              </View>
            </PremiumCard>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary },
  markRead: { color: colors.primary, fontSize: 14 },
  list: { paddingBottom: spacing.md },
  notifCard: { padding: spacing.md, marginBottom: spacing.sm },
  notifRow: { flexDirection: 'row', alignItems: 'center' },
  notifInfo: { flex: 1, marginLeft: spacing.sm },
  notifText: { color: colors.textPrimary },
  bold: { fontWeight: '600' },
  notifTime: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs },
});