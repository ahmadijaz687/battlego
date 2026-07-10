import React from 'react'
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  icon?: string
  size?: 'sm' | 'md' | 'lg'
}

const colors = {
  primary: '#6C63FF',
  secondary: '#FF6584',
  white: '#FFFFFF',
  text: '#212121',
  border: '#E0E0E0',
  error: '#F44336',
  disabled: '#BDBDBD',
}

const sizes = {
  sm: { height: 36, fontSize: 14, paddingHorizontal: 16 },
  md: { height: 48, fontSize: 16, paddingHorizontal: 24 },
  lg: { height: 56, fontSize: 18, paddingHorizontal: 32 },
}

function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  size = 'md',
}: ButtonProps) {
  const isDisabled = disabled || loading

  const getBackgroundColor = () => {
    if (isDisabled) return colors.disabled
    switch (variant) {
      case 'primary':
        return colors.primary
      case 'secondary':
        return colors.secondary
      case 'outline':
      case 'ghost':
        return 'transparent'
      case 'danger':
        return colors.error
      default:
        return colors.primary
    }
  }

  const getTextColor = () => {
    if (isDisabled) return colors.white
    switch (variant) {
      case 'outline':
      case 'ghost':
        return colors.primary
      default:
        return colors.white
    }
  }

  const sz = sizes[size]

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessible
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          height: sz.height,
          paddingHorizontal: sz.paddingHorizontal,
          width: fullWidth ? '100%' : undefined,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: variant === 'outline' ? colors.primary : 'transparent',
        },
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={getTextColor()}
            style={styles.loader}
          />
        ) : null}
        {icon && !loading ? (
          <Text style={[styles.icon, { color: getTextColor() }]}>{icon}</Text>
        ) : null}
        <Text
          style={[
            styles.text,
            { color: getTextColor(), fontSize: sz.fontSize },
            loading && { marginLeft: 0 },
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  icon: {
    marginRight: 8,
    fontSize: 18,
  },
  loader: {
    marginRight: 8,
  },
})

export default React.memo(Button)
