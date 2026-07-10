import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

let hapticEnabled = true;

export function setHapticEnabled(enabled: boolean) {
  hapticEnabled = enabled;
}

function guard(fn: () => void) {
  if (Platform.OS === 'web') return;
  if (!hapticEnabled) return;
  try {
    fn();
  } catch {
    // Silently fail on unsupported devices
  }
}

export const haptic = {
  setComplete: () =>
    guard(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    ),

  prDetected: () =>
    guard(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
        100
      );
      setTimeout(
        () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
        200
      );
    }),

  restTimer: () =>
    guard(() =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    ),

  restTimerEnd: () =>
    guard(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setTimeout(
        () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
        120
      );
      setTimeout(
        () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
        240
      );
    }),

  battleJoin: () =>
    guard(() =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    ),

  battleAction: () =>
    guard(() =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
    ),

  battleVictory: () =>
    guard(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
        120
      );
      setTimeout(
        () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
        250
      );
    }),

  achievementUnlock: () =>
    guard(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
        100
      );
    }),

  buttonPress: () =>
    guard(() =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    ),

  selection: () =>
    guard(() =>
      Haptics.selectionAsync()
    ),

  error: () =>
    guard(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    ),

  warning: () =>
    guard(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    ),

  success: () =>
    guard(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    ),

  lightImpact: () =>
    guard(() =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    ),

  mediumImpact: () =>
    guard(() =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    ),

  heavyImpact: () =>
    guard(() =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    ),

  rigidImpact: () =>
    guard(() =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
    ),

  softImpact: () =>
    guard(() =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
    ),

  celebrationPattern: () =>
    guard(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 80);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 180);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 300);
      setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 420);
    }),
};
