import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

interface FloatingButtonProps {
  icon: string
  onPress: () => void
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  variant?: 'primary' | 'secondary'
}

const colors = {
  primary: '#6C63FF',
  secondary: '#FF6584',
  white: '#FFFFFF',
}

const positions = {
  'bottom-right': { bottom: 24, right: 24 },
  'bottom-left': { bottom: 24, left: 24 },
  'top-right': { top: 24, right: 24 },
  'top-left': { top: 24, left: 24 },
}

function FloatingButton({
  icon,
  onPress,
  position = 'bottom-right',
  variant = 'primary',
}: FloatingButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.fab,
        positions[position],
        { backgroundColor: variant === 'primary' ? colors.primary : colors.secondary },
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 100,
  },
  icon: {
    fontSize: 24,
    color: colors.white,
  },
})

export default React.memo(FloatingButton)
