export const gradients = {
  primary: ['#FF5C7A', '#FF8A9E'],
  secondary: ['#7C4DFF', '#A07EFF'],
  premium: ['#FFD700', '#FFA500', '#FF8C00'],
  success: ['#32D74B', '#5AE96E'],
  surface: ['#1C1C1E', '#2C2C2E'],
  gold: ['#FFE082', '#FFD54F', '#FFC107'],
} as const;

export type Gradients = typeof gradients;
