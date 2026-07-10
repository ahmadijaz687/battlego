import { Animated, Easing, Dimensions } from 'react-native';
import { motion } from '../theme';

export const SCREEN_WIDTH = Dimensions.get('window').width;

export const animations = {
  fadeIn: () => ({
    opacity: new Animated.Value(0),
    transform: [{ translateY: new Animated.Value(12) }],
  }),

  slideUp: () => ({
    opacity: new Animated.Value(0),
    transform: [{ translateY: new Animated.Value(24) }],
  }),

  scaleIn: () => ({
    opacity: new Animated.Value(0),
    transform: [{ scale: new Animated.Value(0.92) }],
  }),

  pulse: () => ({
    transform: [
      {
        scale: new Animated.Value(1),
      },
    ],
  }),
};

export const runFadeIn = (values: { opacity: Animated.Value; transform: { translateY: Animated.Value }[] }, delay = 0) => {
  Animated.sequence([
    Animated.delay(delay),
    Animated.parallel([
      Animated.timing(values.opacity, {
        toValue: 1,
        duration: motion.duration.normal,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(values.transform[0].translateY, {
        toValue: 0,
        duration: motion.duration.normal,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]),
  ]).start();
};

export const runScaleIn = (values: { opacity: Animated.Value; transform: { scale: Animated.Value }[] }, delay = 0) => {
  Animated.sequence([
    Animated.delay(delay),
    Animated.parallel([
      Animated.timing(values.opacity, {
        toValue: 1,
        duration: motion.duration.normal,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(values.transform[0].scale, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]),
  ]).start();
};

export const runPressFeedback = (value: Animated.Value, toValue = 0.97, duration = motion.duration.fast) => {
  Animated.sequence([
    Animated.timing(value, {
      toValue,
      duration: duration / 2,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: 1,
      duration: duration / 2,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }),
  ]).start();
};

export const stagger = (count: number, baseDelay = 60) => Array.from({ length: count }, (_, i) => i * baseDelay);

export const useAnimatedValue = (initialValue: number) => new Animated.Value(initialValue);

export const useFadeIn = (delay = 0) => {
  const opacity = useAnimatedValue(0);
  const translateY = useAnimatedValue(12);

  const animate = () => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
    ]).start();
  };

  return { opacity, translateY, animate };
};

export const useScaleIn = (delay = 0) => {
  const opacity = useAnimatedValue(0);
  const scale = useAnimatedValue(0.92);

  const animate = () => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: motion.duration.normal, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 7, tension: 40, useNativeDriver: true }),
      ]),
    ]).start();
  };

  return { opacity, scale, animate };
};

export const useStagger = (count: number, baseDelay = 40) => {
  const animations = Array.from({ length: count }, (_, i) => ({
    opacity: useAnimatedValue(0),
    translateY: useAnimatedValue(12),
    delay: i * baseDelay,
  }));

  const animateAll = () => {
    animations.forEach((anim, i) => {
      Animated.sequence([
        Animated.delay(anim.delay),
        Animated.parallel([
          Animated.timing(anim.opacity, { toValue: 1, duration: motion.duration.normal, useNativeDriver: true }),
          Animated.timing(anim.translateY, { toValue: 0, duration: motion.duration.normal, useNativeDriver: true }),
        ]),
      ]).start();
    });
  };

  return { animations, animateAll };
};