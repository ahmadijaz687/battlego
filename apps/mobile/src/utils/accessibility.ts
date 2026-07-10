import {
  AccessibilityInfo,
  Platform,
  findNodeHandle,
  AccessibilityChangeEvent,
} from 'react-native'

export const accessibility = {
  isScreenReaderEnabled: async (): Promise<boolean> => {
    return AccessibilityInfo.isScreenReaderEnabled()
  },

  announceForAccessibility: (message: string): void => {
    AccessibilityInfo.announceForAccessibility(message)
  },

  isReduceMotionEnabled: async (): Promise<boolean> => {
    return AccessibilityInfo.isReduceMotionEnabled()
  },

  isBoldTextEnabled: async (): Promise<boolean> => {
    return AccessibilityInfo.isBoldTextEnabled()
  },

  isGrayscaleEnabled: async (): Promise<boolean> => {
    return AccessibilityInfo.isGrayscaleEnabled()
  },

  isInvertColorsEnabled: async (): Promise<boolean> => {
    return AccessibilityInfo.isInvertColorsEnabled()
  },

  listenForChanges: (callback: (event: AccessibilityChangeEvent) => void) => {
    const subscriptions = [
      AccessibilityInfo.addEventListener('screenReaderChanged', callback),
      AccessibilityInfo.addEventListener('reduceMotionChanged', callback),
      AccessibilityInfo.addEventListener('boldTextChanged', callback),
    ]
    return () => subscriptions.forEach((sub) => sub.remove())
  },
}

export function getAccessibilityProps(
  label: string,
  hint?: string,
  role?: string,
) {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: role,
  }
}

export function getAccessibilityStateProps(states: Record<string, boolean>) {
  return { accessibilityState: states }
}
