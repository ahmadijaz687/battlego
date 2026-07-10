import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet } from 'react-native'

interface SkeletonProps {
  width: number | string
  height: number
  borderRadius?: number
  variant?: 'text' | 'circle' | 'rect'
}

const colors = {
  base: '#E0E0E0',
  highlight: '#F5F5F5',
}

function Skeleton({ width, height, borderRadius = 8, variant = 'rect' }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    )
    animation.start()
    return () => animation.stop()
  }, [opacity])

  const getBorderRadius = () => {
    switch (variant) {
      case 'circle':
        return height / 2
      case 'text':
        return height / 4
      case 'rect':
        return borderRadius
    }
  }

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius: getBorderRadius(),
          opacity,
        },
      ]}
    />
  )
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.base,
  },
})

export default React.memo(Skeleton)
