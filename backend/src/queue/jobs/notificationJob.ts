import { appQueue } from '../Queue.js';
import { logger } from '../../utils/logger.js';

interface PushNotificationData {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export function registerNotificationJob(): void {
  appQueue.registerHandler('push_notification', async (data: unknown) => {
    const notification = data as PushNotificationData;
    try {
      // TODO: Integrate with Firebase Cloud Messaging when configured
      // The User model doesn't currently have a pushToken field;
      // add it to the schema and uncomment below:
      //
      // const user = await prisma.user.findUnique({
      //   where: { id: notification.userId },
      //   select: { pushToken: true },
      // });
      //
      // if (user?.pushToken) {
      //   await admin.messaging().send({
      //     token: user.pushToken,
      //     notification: { title: notification.title, body: notification.body },
      //     data: notification.data as Record<string, string>,
      //   });
      // }

      logger.info(`Push queued for ${notification.userId}: ${notification.title}`);
    } catch (error) {
      logger.error(`Push notification failed for user ${notification.userId}`, error instanceof Error ? error : new Error(String(error)));
    }
  });
}
