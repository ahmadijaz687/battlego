import React, { useEffect, useRef } from 'react'
import { Animated, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'

interface SnackbarProps {
  message: string
  actionLabel?: string
  onAction?: () => void
  duration?: number
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const colors = {
  background: '#323232',
  white: '#FFFFFF',
  primary: '#6C63FF',
}

function Snackbar({ message, actionLabel, onAction, duration = 4000 }: SnackbarProps) {
  const translateY = useRef(new Animated.Value(100)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, translateY, opacity])

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }], opacity },
      ]}
    >
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
      {actionLabel ? (
        <TouchableOpacity onPress={onAction} style={styles.actionBtn}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    maxWidth: SCREEN_WIDTH - 32,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: colors.white,
  },
  actionBtn: {
    marginLeft: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
})

export default React.memo(Snackbar)
