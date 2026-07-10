import React, { ReactNode } from 'react'
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native'

interface CardProps {
  children: ReactNode
  variant?: 'elevated' | 'outlined' | 'filled'
  onPress?: () => void
  padding?: number
}

const colors = {
  white: '#FFFFFF',
  surface: '#F5F5F5',
  border: '#E0E0E0',
  shadow: '#000000',
}

function Card({
  children,
  variant = 'elevated',
  onPress,
  padding = 16,
}: CardProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.white,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            },
            android: {
              elevation: 4,
            },
          }),
        }
      case 'outlined':
        return {
          backgroundColor: colors.white,
          borderWidth: 1,
          borderColor: colors.border,
        }
      case 'filled':
        return {
          backgroundColor: colors.surface,
        }
    }
  }

  const Container = onPress ? TouchableOpacity : View

  return (
    <Container
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.card, getVariantStyle(), { padding }]}
    >
      {children}
    </Container>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
})

export default React.memo(Card)
