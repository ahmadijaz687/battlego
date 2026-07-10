import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../Card';
import Avatar from '../Avatar';
import { colors, spacing } from '../../theme';
import { FriendActivity } from '../../types/dashboard';

interface FriendActivityCardProps {
  activities: FriendActivity[];
}

export function FriendActivityCard({ activities }: FriendActivityCardProps) {
  return (
    <Card>
      <Text style={styles.title}>Friend Activity</Text>
      {activities.map((activity) => (
        <View key={activity.id} style={styles.row}>
          <Avatar name={activity.user.name} size={28} />
          <View style={styles.content}>
            <Text style={styles.text}>
              <Text style={styles.name}>{activity.user.name}</Text> {activity.activity}
            </Text>
            <Text style={styles.time}>{activity.time}</Text>
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.textSecondary, fontSize: 14, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  content: { flex: 1, marginLeft: spacing.xs },
  text: { color: colors.textPrimary, fontSize: 14 },
  name: { fontWeight: '600', color: colors.primary },
  time: { color: colors.textMuted, fontSize: 12 },
});