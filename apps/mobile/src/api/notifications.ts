import { socialApi } from './social';

export const notificationsApi = {
  getNotifications: socialApi.getNotifications,
  markNotificationRead: socialApi.markNotificationRead,
};
