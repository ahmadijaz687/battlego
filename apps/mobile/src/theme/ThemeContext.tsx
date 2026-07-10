import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Appearance } from 'react-native';
import { colors, lightColors, amoledColors } from './colors';
import { storage, storageKeys } from '../utils/storage';

type ThemeMode = 'light' | 'dark' | 'system' | 'amoled';

interface ThemeColors {
  background: string;
  surface: string;
  surfaceGlass: string;
  surfaceGlassStrong: string;
  border: string;
  borderFocus: string;
  primary: string;
  primarySoft: string;
  secondary: string;
  secondarySoft: string;
  accent: string;
  warning: string;
  success: string;
  error: string;
  info: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
}

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  colors: colors as unknown as ThemeColors,
  setMode: () => {},
  isDark: true,
});

export const useTheme = () => useContext(ThemeContext);

function getThemeColors(mode: ThemeMode): ThemeColors {
  if (mode === 'light') return lightColors as unknown as ThemeColors;
  if (mode === 'amoled') return amoledColors as unknown as ThemeColors;
  return colors as unknown as ThemeColors;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    const saved = storage.getString(storageKeys.settings.theme);
    if (saved === 'light' || saved === 'dark' || saved === 'system' || saved === 'amoled') {
      setModeState(saved);
    }
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    storage.set(storageKeys.settings.theme, newMode);
  }, []);

  const resolvedMode: ThemeMode = (() => {
    if (mode === 'system') {
      const systemColorScheme = Appearance.getColorScheme() ?? 'dark';
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return mode;
  })();

  const value = {
    mode,
    colors: getThemeColors(resolvedMode),
    setMode,
    isDark: resolvedMode !== 'light',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export { colors, lightColors, amoledColors };
export type { ThemeMode };
