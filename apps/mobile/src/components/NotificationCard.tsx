import React from 'react';
import { Pressable, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Card } from './Card';

interface NotificationCardProps {
  icon: string;
  title: string;
  body: string;
  timestamp: string;
  read?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function NotificationCard({ icon, title, body, timestamp, read = false, onPress, style }: NotificationCardProps) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Card style={[styles.card, !read && styles.unread, style]} variant="glass">
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          <View style={styles.info}>
            <View style={styles.header}>
              <Text style={[styles.title, !read && styles.titleUnread]} numberOfLines={1}>{title}</Text>
              <Text style={styles.timestamp}>{timestamp}</Text>
            </View>
            <Text style={styles.body} numberOfLines={2}>{body}</Text>
          </View>
          {!read && <View style={styles.dot} />}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {},
  unread: { borderColor: colors.primarySoft, borderWidth: 1 },
  content: { flexDirection: 'row', alignItems: 'flex-start' },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceGlassStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  icon: { fontSize: 20 },
  info: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...typography.bodySmall, color: colors.textPrimary, flex: 1 },
  titleUnread: { fontWeight: '700' },
  timestamp: { ...typography.caption, color: colors.textMuted, marginLeft: spacing.sm },
  body: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
    marginTop: 4,
  },
});
