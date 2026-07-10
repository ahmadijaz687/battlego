import { Server, Socket } from 'socket.io';
import { prisma } from '../services/database.js';
import type { AuthenticatedSocket } from './index.js';
import { logger } from '../utils/logger.js';

interface ScoreUpdateData {
  battleId: string;
  score: number;
  metadata?: Record<string, unknown>;
}

interface ReadyStateData {
  battleId: string;
  ready: boolean;
}

interface BattleRoundData {
  battleId: string;
  round: number;
  action: string;
  payload?: Record<string, unknown>;
}

let battleIo: Server | null = null;

export function setupBattleNamespace(io: Server): void {
  battleIo = io;
  const battleNamespace = io.of('/battle');

  battleNamespace.use((socket, next) => {
    next();
  });

  battleNamespace.on('connection', (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;
    const userId = authSocket.userId!;

    socket.on('join:battle', async (battleId: string) => {
      try {
        const battle = await prisma.battle.findUnique({ where: { id: battleId } });
        if (!battle) {
          socket.emit('error:message', { message: 'Battle not found' });
          return;
        }

        if (battle.creatorId !== userId && battle.opponentId !== userId) {
          socket.emit('error:message', { message: 'Not a participant in this battle' });
          return;
        }

        socket.join(`battle:${battleId}`);

        const socketsInRoom = await battleNamespace.in(`battle:${battleId}`).fetchSockets();
        battleNamespace.to(`battle:${battleId}`).emit('battle:participantCount', {
          battleId,
          count: socketsInRoom.length,
        });

        battleNamespace.to(`battle:${battleId}`).emit('battle:userJoined', {
          battleId,
          userId,
          username: authSocket.username,
        });

        socket.emit('battle:state', battle);
      } catch (error) {
        logger.error('[Battle] Failed to join:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('error:message', { message: 'Failed to join battle' });
      }
    });

    socket.on('leave:battle', (battleId: string) => {
      socket.leave(`battle:${battleId}`);
      battleNamespace.to(`battle:${battleId}`).emit('battle:userLeft', {
        battleId,
        userId,
        username: authSocket.username,
      });
    });

    socket.on('battle:scoreUpdate', async (data: ScoreUpdateData) => {
      try {
        if (!data.battleId || data.score == null) {
          socket.emit('error:message', { message: 'Invalid score data' });
          return;
        }

        const battle = await prisma.battle.findUnique({ where: { id: data.battleId } });
        if (!battle) {
          socket.emit('error:message', { message: 'Battle not found' });
          return;
        }

        if (battle.status !== 'active') {
          socket.emit('error:message', { message: 'Battle is not active' });
          return;
        }

        const isCreator = battle.creatorId === userId;
        const updateData = isCreator
          ? { creatorScore: data.score }
          : { opponentScore: data.score };

        await prisma.battle.update({
          where: { id: data.battleId },
          data: updateData,
        });

        const updatedBattle = await prisma.battle.findUnique({ where: { id: data.battleId } });

        battleNamespace.to(`battle:${data.battleId}`).emit('battle:scoreUpdated', {
          battleId: data.battleId,
          userId,
          score: data.score,
          creatorScore: updatedBattle?.creatorScore,
          opponentScore: updatedBattle?.opponentScore,
          metadata: data.metadata,
        });
      } catch (error) {
        logger.error('[Battle] Failed to update score:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('error:message', { message: 'Failed to update score' });
      }
    });

    socket.on('battle:ready', async (data: ReadyStateData) => {
      try {
        if (!data.battleId) return;

        socket.join(`battle:${data.battleId}`);

        battleNamespace.to(`battle:${data.battleId}`).emit('battle:playerReady', {
          battleId: data.battleId,
          userId,
          ready: data.ready,
        });

        if (data.ready) {
          const socketsInRoom = await battleNamespace.in(`battle:${data.battleId}`).fetchSockets();
          const readySockets = socketsInRoom.filter((s) => s.data?.ready);
          const allReady = readySockets.length >= 2;

          if (allReady) {
            battleNamespace.to(`battle:${data.battleId}`).emit('battle:allReady', {
              battleId: data.battleId,
            });
          }
        }
      } catch (error) {
        logger.error('[Battle] Ready state error:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('battle:start', async (battleId: string) => {
      try {
        const battle = await prisma.battle.findUnique({ where: { id: battleId } });
        if (!battle) {
          socket.emit('error:message', { message: 'Battle not found' });
          return;
        }

        if (battle.creatorId !== userId) {
          socket.emit('error:message', { message: 'Only the creator can start the battle' });
          return;
        }

        await prisma.battle.update({
          where: { id: battleId },
          data: { status: 'active', startTime: new Date() },
        });

        battleNamespace.to(`battle:${battleId}`).emit('battle:started', {
          battleId,
          startedAt: new Date(),
        });
      } catch (error) {
        logger.error('[Battle] Failed to start:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('error:message', { message: 'Failed to start battle' });
      }
    });

    socket.on('battle:end', async (battleId: string) => {
      try {
        const battle = await prisma.battle.findUnique({ where: { id: battleId } });
        if (!battle) {
          socket.emit('error:message', { message: 'Battle not found' });
          return;
        }

        if (battle.creatorId !== userId) {
          socket.emit('error:message', { message: 'Only the creator can end the battle' });
          return;
        }

        const winner = battle.creatorScore != null && battle.opponentScore != null
          ? (battle.creatorScore >= battle.opponentScore ? battle.creatorId : battle.opponentId)
          : null;

        await prisma.battle.update({
          where: { id: battleId },
          data: {
            status: 'completed',
            endTime: new Date(),
            winnerId: winner,
          },
        });

        battleNamespace.to(`battle:${battleId}`).emit('battle:ended', {
          battleId,
          winnerId: winner,
          creatorScore: battle.creatorScore,
          opponentScore: battle.opponentScore,
          endedAt: new Date(),
        });
      } catch (error) {
        logger.error('[Battle] Failed to end:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('error:message', { message: 'Failed to end battle' });
      }
    });

    socket.on('battle:round', (data: BattleRoundData) => {
      socket.to(`battle:${data.battleId}`).emit('battle:roundUpdate', {
        battleId: data.battleId,
        round: data.round,
        userId,
        action: data.action,
        payload: data.payload,
      });
    });

    socket.on('battle:chat', (data: { battleId: string; message: string }) => {
      if (!data.message?.trim()) return;
      battleNamespace.to(`battle:${data.battleId}`).emit('battle:chatMessage', {
        battleId: data.battleId,
        userId,
        username: authSocket.username,
        message: data.message,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      logger.info(`[Battle] User ${userId} disconnected`);
    });
  });
}

export function emitBattleScoreUpdated(
  battleId: string,
  payload: {
    userId: string;
    score?: number | null;
    creatorScore?: number | null;
    opponentScore?: number | null;
    metadata?: Record<string, unknown>;
  },
): void {
  if (!battleIo) return;
  battleIo.of('/battle').to(`battle:${battleId}`).emit('battle:scoreUpdated', {
    battleId,
    ...payload,
  });
}
