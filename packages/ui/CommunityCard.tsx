import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface CommunityCardProps {
  name: string
  memberCount: number
  description?: string
  avatar?: string
  isPrivate?: boolean
  onPress: () => void
}

const colors = {
  primary: '#6C63FF',
  white: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  surface: '#F5F5F5',
  warning: '#FFC107',
}

function CommunityCard({
  name,
  memberCount,
  description,
  avatar,
  isPrivate,
  onPress,
}: CommunityCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.card}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {avatar || name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {isPrivate ? <Text style={styles.lock}>🔒</Text> : null}
        </View>
        {description ? (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
        <Text style={styles.members}>
          {memberCount.toLocaleString()} {memberCount === 1 ? 'member' : 'members'}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  lock: {
    fontSize: 12,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  members: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 24,
    color: colors.textSecondary,
    marginLeft: 8,
    fontWeight: '300',
  },
})

export default React.memo(CommunityCard)
