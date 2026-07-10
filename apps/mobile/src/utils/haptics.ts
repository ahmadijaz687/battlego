import * as Haptics from 'expo-haptics';

export async function impactAsync(
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium
): Promise<void> {
  await Haptics.impactAsync(style);
}

export async function notificationAsync(
  type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success
): Promise<void> {
  await Haptics.notificationAsync(type);
}

export async function selectionAsync(): Promise<void> {
  await Haptics.selectionAsync();
}
