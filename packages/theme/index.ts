export { colors, lightColors, darkColors, amoledColors } from './colors';
export type { ThemeColors, LightColors, DarkColors, AmoledColors } from './colors';

export { spacing } from './spacing';
export type { Spacing } from './spacing';

export { typography } from './typography';
export type { Typography } from './typography';

export { elevation } from './elevation';
export type { Elevation } from './elevation';

export { animations } from './animations';
export type { Animations } from './animations';

export { gradients } from './gradients';
export type { Gradients } from './gradients';

export { glass } from './glass';
export type { Glass } from './glass';

export { motion } from './motion';
export type { Motion } from './motion';

export { Icons, iconCategories } from './icons';
export type { IconName } from './icons';

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const shadow = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
} as const;

export type FontSize = typeof fontSize;
export type BorderRadius = typeof borderRadius;
export type Shadow = typeof shadow;
