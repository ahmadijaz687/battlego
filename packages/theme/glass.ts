export const glass = {
  background: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.12)',
  highlight: 'rgba(255, 255, 255, 0.05)',
  blur: { sm: 10, md: 20, lg: 40 },
  saturation: { sm: 1.2, md: 1.5, lg: 1.8 },
} as const;

export type Glass = typeof glass;
