import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { colors, borderRadius, motion } from '../theme';

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  style?: any;
  borderRadiusValue?: number;
}

export function LoadingSkeleton({ width = '100%', height = 20, style, borderRadiusValue = borderRadius.md }: LoadingSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: motion.duration.normal, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: motion.duration.normal, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: borderRadiusValue, backgroundColor: colors.surface },
        { opacity },
        style,
      ]}
    />
  );
}