import { Server, Socket } from 'socket.io';
import { prisma } from '../services/database.js';
import type { AuthenticatedSocket } from './index.js';
import { logger } from '../utils/logger.js';

interface HeartRateData {
  sessionId: string;
  bpm: number;
  hrv?: number;
  timestamp: number;
}

interface FormFeedbackData {
  sessionId: string;
  exerciseId: string;
  feedback: string;
  severity?: 'info' | 'warning' | 'critical';
}

interface SetCompletionData {
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight?: number;
  duration?: number;
}

interface WorkoutSessionData {
  sessionId: string;
  status: 'started' | 'paused' | 'resumed' | 'completed' | 'cancelled';
  progress?: number;
}

export function setupWorkoutNamespace(io: Server): void {
  const workoutNamespace = io.of('/workout');

  workoutNamespace.on('connection', (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;
    const userId = authSocket.userId!;

    socket.on('workout:join', async (sessionId: string) => {
      try {
        const workout = await prisma.workout.findUnique({ where: { id: sessionId } });
        if (!workout) {
          socket.emit('error:message', { message: 'Workout session not found' });
          return;
        }

        if (workout.userId !== userId) {
          socket.emit('error:message', { message: 'Not authorized for this workout' });
          return;
        }

        socket.join(`workout:${sessionId}`);
        socket.emit('workout:joined', { sessionId });

        workoutNamespace.to(`workout:${sessionId}`).emit('workout:participantJoined', {
          sessionId,
          userId,
          username: authSocket.username,
        });
      } catch (error) {
        logger.error('[Workout] Failed to join session:', error instanceof Error ? error : new Error(String(error)));
        socket.emit('error:message', { message: 'Failed to join workout session' });
      }
    });

    socket.on('workout:leave', (sessionId: string) => {
      socket.leave(`workout:${sessionId}`);
      workoutNamespace.to(`workout:${sessionId}`).emit('workout:participantLeft', {
        sessionId,
        userId,
      });
    });

    socket.on('workout:heartRate', (data: HeartRateData) => {
      if (!data.sessionId || !data.bpm) return;

      workoutNamespace.to(`workout:${data.sessionId}`).emit('workout:heartRateUpdate', {
        sessionId: data.sessionId,
        userId,
        bpm: data.bpm,
        hrv: data.hrv,
        timestamp: data.timestamp || Date.now(),
      });
    });

    socket.on('workout:formFeedback', (data: FormFeedbackData) => {
      if (!data.sessionId || !data.feedback) return;

      socket.to(`workout:${data.sessionId}`).emit('workout:formFeedback', {
        sessionId: data.sessionId,
        exerciseId: data.exerciseId,
        userId,
        feedback: data.feedback,
        severity: data.severity || 'info',
      });
    });

    socket.on('workout:setCompleted', async (data: SetCompletionData) => {
      try {
        if (!data.sessionId || !data.exerciseId || data.setNumber == null) return;

        const existing = await prisma.workoutSet.findFirst({
          where: { exerciseId: data.exerciseId, setNumber: data.setNumber },
        });

        if (existing) {
          await prisma.workoutSet.update({
            where: { id: existing.id },
            data: {
              reps: data.reps,
              weight: data.weight,
              duration: data.duration,
              completed: true,
              completedAt: new Date(),
            },
          });
        } else {
          await prisma.workoutSet.create({
            data: {
              exerciseId: data.exerciseId,
              setNumber: data.setNumber,
              reps: data.reps,
              weight: data.weight,
              duration: data.duration,
              completed: true,
              completedAt: new Date(),
            },
          });
        }

        workoutNamespace.to(`workout:${data.sessionId}`).emit('workout:setCompleted', {
          sessionId: data.sessionId,
          exerciseId: data.exerciseId,
          setNumber: data.setNumber,
          reps: data.reps,
          weight: data.weight,
          userId,
        });
      } catch (error) {
        logger.error('[Workout] Failed to record set:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('workout:status', async (data: WorkoutSessionData) => {
      try {
        if (!data.sessionId) return;

        switch (data.status) {
          case 'started':
            await prisma.workout.update({
              where: { id: data.sessionId },
              data: { startedAt: new Date() },
            });
            break;
          case 'completed':
            await prisma.workout.update({
              where: { id: data.sessionId },
              data: { completedAt: new Date() },
            });
            break;
          case 'paused':
          case 'resumed':
          case 'cancelled':
            break;
        }

        workoutNamespace.to(`workout:${data.sessionId}`).emit('workout:statusChanged', {
          sessionId: data.sessionId,
          userId,
          status: data.status,
          progress: data.progress,
          timestamp: new Date(),
        });
      } catch (error) {
        logger.error('[Workout] Status update failed:', error instanceof Error ? error : new Error(String(error)));
      }
    });

    socket.on('workout:partnerSync', (data: { sessionId: string; state: Record<string, unknown> }) => {
      socket.to(`workout:${data.sessionId}`).emit('workout:partnerState', {
        sessionId: data.sessionId,
        userId,
        state: data.state,
        timestamp: Date.now(),
      });
    });

    socket.on('workout:calories', (data: { sessionId: string; calories: number; totalCalories?: number }) => {
      workoutNamespace.to(`workout:${data.sessionId}`).emit('workout:caloriesUpdate', {
        sessionId: data.sessionId,
        userId,
        calories: data.calories,
        totalCalories: data.totalCalories,
      });
    });

    socket.on('disconnect', () => {
    });
  });
}
