import React, { ReactNode } from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface PremiumCardProps {
  children: ReactNode
}

const colors = {
  premium: '#FFD700',
  premiumLight: '#FFF8E1',
  white: '#FFFFFF',
  text: '#212121',
}

function PremiumCard({ children }: PremiumCardProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.gradientBorder}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.crown}>👑</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PREMIUM</Text>
            </View>
          </View>
          {children}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    padding: 2,
    backgroundColor: colors.premium,
  },
  gradientBorder: {
    borderRadius: 18,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  crown: {
    fontSize: 24,
  },
  badge: {
    backgroundColor: colors.premiumLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B8860B',
    letterSpacing: 1,
  },
})

export default React.memo(PremiumCard)
