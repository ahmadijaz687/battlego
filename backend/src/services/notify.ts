import { prisma } from './database.js';
import { NotificationType } from '@prisma/client';
import { logger } from '../utils/logger.js';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

export async function notifyUser(
  userId: string,
  type: NotificationType,
  payload: Record<string, unknown>,
  message: string
): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title: 'Fitness Battle',
        content: message,
      },
    });
  } catch (err) {
    logger.warn('[notify] Failed to create notification', {
      userId,
      type,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  try {
    const tokenRow = await prisma.pushToken.findFirst({ where: { userId } });
    if (!tokenRow) return;

    await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: tokenRow.token,
        title: 'Fitness Battle',
        body: message,
        data: { type, ...payload },
      }),
    });
  } catch (err) {
    logger.warn('[notify] Best-effort push failed; ignoring', {
      userId,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
