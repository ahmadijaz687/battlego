import { Animated, Easing } from 'react-native';

export const springConfig = {
  gentle: { friction: 12, tension: 40, useNativeDriver: true } as const,
  snappy: { friction: 8, tension: 100, useNativeDriver: true } as const,
  bouncy: { friction: 6, tension: 120, useNativeDriver: true } as const,
  stiff: { friction: 15, tension: 200, useNativeDriver: true } as const,
};

export const timingConfig = {
  fast: { duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true } as const,
  normal: { duration: 240, easing: Easing.out(Easing.cubic), useNativeDriver: true } as const,
  slow: { duration: 360, easing: Easing.out(Easing.cubic), useNativeDriver: true } as const,
  slower: { duration: 600, easing: Easing.out(Easing.exp), useNativeDriver: true } as const,
};

export const curve = {
  default: Easing.out(Easing.cubic),
  spring: Easing.out(Easing.back(1.5)),
  bounce: Easing.out(Easing.elastic(1)),
};

export const animations = {
  fade: (values: any) => ({
    opacity: values.opacity,
  }),
  scale: (values: any) => ({
    transform: [{ scale: values.scale }],
  }),
  slide: (values: any) => ({
    transform: [{ translateX: values.translateX }],
  }),
  stagger: (index: number) => ({
    opacity: 1,
    transform: [{ translateY: 0 }],
  }),
};