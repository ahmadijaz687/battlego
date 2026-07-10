export const motion = {
  drag: { treshold: 10, lockDirection: true },
  swipe: { velocityThreshold: 500, directionalThreshold: 0.25 },
  scale: { pressIn: 0.97, pressOut: 1.03 },
  fade: { in: 0, out: 1 },
  slide: { offset: 100 },
} as const;

export type Motion = typeof motion;
