import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system' | 'amoled';
export type MeasurementSystem = 'metric' | 'imperial';
export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'ft';
export type DistanceUnit = 'km' | 'mi';

interface NotificationSettings {
  workout: boolean;
  meal: boolean;
  hydration: boolean;
  battle: boolean;
  friendRequest: boolean;
  message: boolean;
  achievement: boolean;
  system: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  postsVisibility: 'public' | 'friends' | 'private';
  showActivity: boolean;
  showBattles: boolean;
}

interface SecuritySettings {
  biometricLogin: boolean;
  twoFactorEnabled: boolean;
  sessionTimeout: number;
}

interface HapticSoundSettings {
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  hapticIntensity: 'light' | 'medium' | 'heavy';
  soundVolume: number;
}

interface SettingsState {
  theme: ThemeMode;
  accentColor: string;
  fontScale: number;
  language: string;
  measurementSystem: MeasurementSystem;
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  distanceUnit: DistanceUnit;
  timezone: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  security: SecuritySettings;
  hapticSound: HapticSoundSettings;
  offlineMode: boolean;
  developerMode: boolean;
  isFirstLaunch: boolean;
  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: string) => void;
  setFontScale: (scale: number) => void;
  setLanguage: (language: string) => void;
  setMeasurementSystem: (system: MeasurementSystem) => void;
  setWeightUnit: (unit: WeightUnit) => void;
  setHeightUnit: (unit: HeightUnit) => void;
  setDistanceUnit: (unit: DistanceUnit) => void;
  setTimezone: (tz: string) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  updatePrivacy: (settings: Partial<PrivacySettings>) => void;
  updateSecurity: (settings: Partial<SecuritySettings>) => void;
  updateHapticSound: (settings: Partial<HapticSoundSettings>) => void;
  setOfflineMode: (enabled: boolean) => void;
  setDeveloperMode: (enabled: boolean) => void;
  setFirstLaunch: (isFirst: boolean) => void;
  reset: () => void;
}

const defaultState = {
  theme: 'dark' as ThemeMode,
  accentColor: '#FF2D55',
  fontScale: 1,
  language: 'en',
  measurementSystem: 'metric' as MeasurementSystem,
  weightUnit: 'kg' as WeightUnit,
  heightUnit: 'cm' as HeightUnit,
  distanceUnit: 'km' as DistanceUnit,
  timezone: 'UTC',
  notifications: {
    workout: true,
    meal: true,
    hydration: true,
    battle: true,
    friendRequest: true,
    message: true,
    achievement: true,
    system: true,
  },
  privacy: {
    profileVisibility: 'public' as const,
    postsVisibility: 'public' as const,
    showActivity: true,
    showBattles: true,
  },
  security: {
    biometricLogin: false,
    twoFactorEnabled: false,
    sessionTimeout: 30,
  },
  hapticSound: {
    hapticsEnabled: true,
    soundEnabled: true,
    hapticIntensity: 'medium' as const,
    soundVolume: 0.4,
  },
  offlineMode: false,
  developerMode: false,
  isFirstLaunch: true,
};

export const useSettingsStore = create<SettingsState>((set) => ({
  ...defaultState,

  setTheme: (theme) => set({ theme }),
  setAccentColor: (accentColor) => set({ accentColor }),
  setFontScale: (fontScale) => set({ fontScale }),
  setLanguage: (language) => set({ language }),
  setMeasurementSystem: (system) =>
    set({
      measurementSystem: system,
      weightUnit: system === 'metric' ? 'kg' : 'lbs',
      heightUnit: system === 'metric' ? 'cm' : 'ft',
      distanceUnit: system === 'metric' ? 'km' : 'mi',
    }),
  setWeightUnit: (weightUnit) => set({ weightUnit }),
  setHeightUnit: (heightUnit) => set({ heightUnit }),
  setDistanceUnit: (distanceUnit) => set({ distanceUnit }),
  setTimezone: (timezone) => set({ timezone }),
  updateNotifications: (settings) =>
    set((state) => ({
      notifications: { ...state.notifications, ...settings },
    })),
  updatePrivacy: (settings) =>
    set((state) => ({
      privacy: { ...state.privacy, ...settings },
    })),
  updateSecurity: (settings) =>
    set((state) => ({
      security: { ...state.security, ...settings },
    })),
  updateHapticSound: (settings) =>
    set((state) => ({
      hapticSound: { ...state.hapticSound, ...settings },
    })),
  setOfflineMode: (offlineMode) => set({ offlineMode }),
  setDeveloperMode: (developerMode) => set({ developerMode }),
  setFirstLaunch: (isFirstLaunch) => set({ isFirstLaunch }),
  reset: () => set(defaultState),
}));
