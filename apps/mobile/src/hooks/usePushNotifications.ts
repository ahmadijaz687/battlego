import { useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { registerPushToken, PushPlatform } from '../services/notificationService';

type NotificationStatus = 'idle' | 'loading' | 'granted' | 'denied';

export function usePushNotifications() {
  const [status, setStatus] = useState<NotificationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const enableNotifications = useCallback(async (): Promise<boolean> => {
    setError(null);
    setStatus('loading');
    try {
      const existing = await Notifications.getPermissionsAsync();
      let finalStatus = existing.status;
      if (finalStatus !== 'granted') {
        const requested = await Notifications.requestPermissionsAsync();
        finalStatus = requested.status;
      }

      if (finalStatus !== 'granted') {
        setStatus('denied');
        setError('Notifications permission denied');
        return false;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      const tokenResponse = projectId
        ? await Notifications.getExpoPushTokenAsync({ projectId })
        : await Notifications.getExpoPushTokenAsync();
      const token = tokenResponse.data;

      const platform: PushPlatform =
        Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';

      await registerPushToken(token, platform);
      setStatus('granted');
      return true;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to enable notifications';
      setError(message);
      setStatus('denied');
      return false;
    }
  }, []);

  return { enableNotifications, status, error };
}
