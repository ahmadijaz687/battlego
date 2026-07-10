import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface LeaderboardCardProps {
  rank: number
  name: string
  xp: number
  level: number
  avatar?: string
  isCurrentUser?: boolean
}

const colors = {
  primary: '#6C63FF',
  white: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
  surface: '#F5F5F5',
}

const rankColors: Record<number, string> = {
  1: colors.gold,
  2: colors.silver,
  3: colors.bronze,
}

function LeaderboardCard({ rank, name, xp, level, avatar, isCurrentUser }: LeaderboardCardProps) {
  return (
    <View
      style={[
        styles.card,
        isCurrentUser && { backgroundColor: colors.primary + '10', borderColor: colors.primary },
      ]}
    >
      <View style={styles.rankContainer}>
        <Text
          style={[
            styles.rank,
            { color: rankColors[rank] || colors.textSecondary },
          ]}
        >
          {rank}
        </Text>
      </View>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {avatar || name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, isCurrentUser && { color: colors.primary }]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.levelText}>Level {level}</Text>
      </View>
      <Text style={styles.xp}>{xp.toLocaleString()} XP</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
  },
  rank: {
    fontSize: 18,
    fontWeight: '800',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  levelText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  xp: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
})

export default React.memo(LeaderboardCard)
