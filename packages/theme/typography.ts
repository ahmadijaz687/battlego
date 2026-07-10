export const typography = {
  fontFamily: { regular: 'System', medium: 'System', bold: 'System' },
  fontSize: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, xxl: 24, xxxl: 32, display: 40 },
  fontWeight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
  lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
  variants: {
    h1: { fontSize: 32, fontWeight: '700', lineHeight: 1.2 },
    h2: { fontSize: 24, fontWeight: '700', lineHeight: 1.3 },
    h3: { fontSize: 20, fontWeight: '600', lineHeight: 1.3 },
    body: { fontSize: 16, fontWeight: '400', lineHeight: 1.5 },
    bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 1.5 },
    caption: { fontSize: 12, fontWeight: '400', lineHeight: 1.4 },
    label: { fontSize: 14, fontWeight: '600', lineHeight: 1.4 },
    button: { fontSize: 16, fontWeight: '600', lineHeight: 1.2 },
  },
} as const;

export type Typography = typeof typography;
