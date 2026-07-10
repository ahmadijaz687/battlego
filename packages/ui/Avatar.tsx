import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

interface AvatarProps {
  source?: { uri: string }
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'busy'
}

const colors = {
  primary: '#6C63FF',
  white: '#FFFFFF',
  success: '#4CAF50',
  error: '#F44336',
  disabled: '#BDBDBD',
}

const sizes = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
}

function Avatar({ source, name, size = 'md', status }: AvatarProps) {
  const dimension = sizes[size]
  const fontSize = dimension * 0.4

  const getInitials = () => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return colors.success
      case 'offline':
        return colors.disabled
      case 'busy':
        return colors.error
      default:
        return 'transparent'
    }
  }

  return (
    <View
      style={[styles.container, { width: dimension, height: dimension }]}
      accessible
      accessibilityLabel={name ? `${name}'s avatar` : 'Avatar'}
      accessibilityRole="image"
    >
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            { width: dimension, height: dimension, borderRadius: dimension / 2 },
          ]}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
            },
          ]}
        >
          <Text style={[styles.initials, { fontSize }]}>{getInitials()}</Text>
        </View>
      )}
      {status ? (
        <View
          style={[
            styles.status,
            {
              width: dimension * 0.3,
              height: dimension * 0.3,
              borderRadius: (dimension * 0.3) / 2,
              backgroundColor: getStatusColor(),
              borderWidth: 2,
              borderColor: colors.white,
              right: dimension * 0.02,
              bottom: dimension * 0.02,
            },
          ]}
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.white,
    fontWeight: '700',
  },
  status: {
    position: 'absolute',
  },
})

export default React.memo(Avatar)
