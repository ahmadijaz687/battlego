import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useSettingsStore } from '../../store/settingsStore';
import { Header } from '../../components/Header';
import { Switch } from '../../components/Switch';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<ProfileStackParamList, 'SettingsNotifications'>;

const notificationItems: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'workout', label: 'Workout Reminders', icon: 'fitness' },
  { key: 'meal', label: 'Meal Reminders', icon: 'restaurant' },
  { key: 'hydration', label: 'Hydration', icon: 'water' },
  { key: 'battle', label: 'Battle', icon: 'flame' },
  { key: 'friendRequest', label: 'Friend Requests', icon: 'person-add' },
  { key: 'message', label: 'Messages', icon: 'chatbubbles' },
  { key: 'achievement', label: 'Achievements', icon: 'trophy' },
  { key: 'system', label: 'System', icon: 'settings' },
];

export default function NotificationsScreen({ navigation }: Props) {
  const notifications = useSettingsStore((s) => s.notifications);
  const updateNotifications = useSettingsStore((s) => s.updateNotifications);

  const toggle = (key: string) => {
    updateNotifications({ [key]: !(notifications as any)[key] });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Notifications" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>Manage your notification preferences.</Text>
        <View style={styles.card}>
          {notificationItems.map((item, index) => (
            <View
              key={item.key}
              style={[
                styles.row,
                index < notificationItems.length - 1 && styles.rowBorder,
              ]}
            >
              <View style={styles.rowLeft}>
                <Ionicons name={item.icon} size={20} color={colors.textSecondary} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>{item.label}</Text>
              </View>
              <Switch
                value={(notifications as any)[item.key]}
                onValueChange={() => toggle(item.key)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  description: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowIcon: { marginRight: spacing.sm },
  rowLabel: { ...typography.body, color: colors.textPrimary },
});
