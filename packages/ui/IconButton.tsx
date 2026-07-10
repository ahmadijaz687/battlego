import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

interface IconButtonProps {
  icon: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: number
  color?: string
}

const colors = {
  primary: '#6C63FF',
  secondary: '#FF6584',
  white: '#FFFFFF',
  border: '#E0E0E0',
}

function IconButton({
  icon,
  onPress,
  variant = 'primary',
  size = 48,
  color,
}: IconButtonProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary
      case 'secondary':
        return colors.secondary
      case 'outline':
        return 'transparent'
      case 'ghost':
        return 'transparent'
      default:
        return colors.primary
    }
  }

  const iconColor =
    color ||
    (variant === 'outline' || variant === 'ghost'
      ? colors.primary
      : colors.white)

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessible
      accessibilityLabel={icon ? `Button: ${icon}` : 'Icon button'}
      accessibilityRole="button"
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor:
            variant === 'outline'
              ? color || colors.primary
              : 'transparent',
        },
      ]}
    >
      <Text style={[styles.icon, { color: iconColor, fontSize: size * 0.45 }]}>
        {icon}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: '700',
  },
})

export default React.memo(IconButton)
