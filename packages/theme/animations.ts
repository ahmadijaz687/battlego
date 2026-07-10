export const animations = {
  duration: { fast: 150, normal: 300, slow: 500, xslow: 800 },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
  spring: {
    gentle: { tension: 120, friction: 14 },
    snappy: { tension: 300, friction: 20 },
    wobbly: { tension: 180, friction: 8 },
  },
} as const;

export type Animations = typeof animations;
