import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Card } from './Card';
import { Button } from './Button';
import Avatar from './Avatar';

interface FriendCardProps {
  name: string;
  avatarUri?: string;
  mutualFriends?: number;
  online?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function FriendCard({ name, avatarUri, mutualFriends = 0, online = false, actionLabel, onAction, style }: FriendCardProps) {
  return (
    <Card style={[styles.card, style]} variant="glass">
      <View style={styles.content}>
        <Avatar uri={avatarUri} name={name} size="md" online={online} showOnlineIndicator />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          {mutualFriends > 0 && <Text style={styles.mutual}>{mutualFriends} mutual friend{mutualFriends !== 1 ? 's' : ''}</Text>}
        </View>
        {actionLabel && onAction && <Button title={actionLabel} size="sm" variant="outline" onPress={onAction} />}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {},
  content: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: spacing.sm, marginRight: spacing.sm },
  name: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600' },
  mutual: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
