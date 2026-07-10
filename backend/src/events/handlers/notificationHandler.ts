import { appEventEmitter, EventTypes } from '../index.js';
import { prisma } from '../../services/database.js';
import { appQueue } from '../../queue/Queue.js';
import { logger } from '../../utils/logger.js';
import type {
  AchievementEvent,
  LevelUpEvent,
  BattleEvent,
} from '../types.js';

export function registerNotificationHandler(): void {
  appEventEmitter.on(EventTypes.ACHIEVEMENT_UNLOCKED, async (payload) => {
    try {
      const data = payload as AchievementEvent;
      await prisma.notification.create({
        data: {
          userId: data.userId,
          type: 'community',
          title: 'Achievement Unlocked!',
          content: `You unlocked "${data.achievementName}"`,
          relatedId: data.achievementId,
        },
      });
    } catch (error) {
      logger.error('[Notification Handler] Achievement notification failed:', error);
    }
  });

  appEventEmitter.on(EventTypes.LEVEL_UP, async (payload) => {
    try {
      const data = payload as LevelUpEvent;
      await prisma.notification.create({
        data: {
          userId: data.userId,
          type: 'community',
          title: 'Level Up!',
          content: `Congratulations! You reached level ${data.newLevel}`,
        },
      });

      appQueue.enqueue('push_notification', {
        userId: data.userId,
        title: 'Level Up!',
        body: `Congratulations! You reached level ${data.newLevel}`,
      });
    } catch (error) {
      logger.error('[Notification Handler] Level up notification failed:', error);
    }
  });

  appEventEmitter.on(EventTypes.FRIEND_REQUEST, async (payload) => {
    try {
      const data = payload as BattleEvent;
      await prisma.notification.create({
        data: {
          userId: data.opponentId,
          type: 'friend_request',
          title: 'Friend Request',
          content: 'Someone sent you a friend request',
          relatedId: data.userId,
        },
      });
    } catch (error) {
      logger.error('[Notification Handler] Friend request notification failed:', error);
    }
  });

  appEventEmitter.on(EventTypes.MESSAGE_SENT, async (payload) => {
    try {
      const data = payload as BattleEvent;
      await prisma.notification.create({
        data: {
          userId: data.opponentId,
          type: 'message',
          title: 'New Message',
          content: 'You received a new message',
          relatedId: data.userId,
        },
      });
    } catch (error) {
      logger.error('[Notification Handler] Message notification failed:', error);
    }
  });

  appEventEmitter.on(EventTypes.BATTLE_STARTED, async (payload) => {
    try {
      const data = payload as BattleEvent;
      await prisma.notification.create({
        data: {
          userId: data.opponentId,
          type: 'battle_invite',
          title: 'Battle Started!',
          content: 'A new battle has begun',
          relatedId: data.battleId,
        },
      });
    } catch (error) {
      logger.error('[Notification Handler] Battle notification failed:', error);
    }
  });

  appEventEmitter.on(EventTypes.BATTLE_COMPLETED, async (payload) => {
    try {
      const data = payload as BattleEvent;
      const result = data.result ?? 'draw';
      await prisma.notification.create({
        data: {
          userId: data.userId,
          type: 'community',
          title: result === 'win' ? 'Victory!' : 'Battle Over',
          content: result === 'win' ? 'You won the battle!' : 'The battle has ended',
          relatedId: data.battleId,
        },
      });
    } catch (error) {
      logger.error('[Notification Handler] Battle result notification failed:', error);
    }
  });

  appEventEmitter.on(EventTypes.CHALLENGE_COMPLETED, async (payload) => {
    try {
      const data = payload as { userId: string; challengeId?: string; challengeName?: string };
      await prisma.notification.create({
        data: {
          userId: data.userId,
          type: 'community',
          title: 'Challenge Complete!',
          content: data.challengeName ? `You completed "${data.challengeName}"` : 'Challenge completed',
          relatedId: data.challengeId,
        },
      });
    } catch (error) {
      logger.error('[Notification Handler] Challenge notification failed:', error);
    }
  });
}
