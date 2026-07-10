export { colors, lightColors, amoledColors, spacing, borderRadius, elevation, shadows, motion, iconSize, componentSize, zIndex } from './colors';
export { ThemeProvider, useTheme } from './ThemeContext';

export const typography = {
  display: { fontSize: 36, fontWeight: '700' as const, lineHeight: 44, letterSpacing: -0.5 },
  h1: { fontSize: 30, fontWeight: '700' as const, lineHeight: 38, letterSpacing: -0.3 },
  h2: { fontSize: 26, fontWeight: '700' as const, lineHeight: 34, letterSpacing: -0.2 },
  h3: { fontSize: 22, fontWeight: '600' as const, lineHeight: 30, letterSpacing: -0.1 },
  h4: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 18, fontWeight: '400' as const, lineHeight: 26 },
  bodySmall: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  small: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  tiny: { fontSize: 10, fontWeight: '400' as const, lineHeight: 14 },
  button: { fontSize: 16, fontWeight: '700' as const, lineHeight: 24 },
  overline: { fontSize: 10, fontWeight: '600' as const, lineHeight: 14, textTransform: 'uppercase' as const, letterSpacing: 1 },
  kpi: { fontSize: 36, fontWeight: '700' as const, lineHeight: 44, letterSpacing: -0.5 },
  kpiLabel: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18, textTransform: 'uppercase' as const },
} as const;
