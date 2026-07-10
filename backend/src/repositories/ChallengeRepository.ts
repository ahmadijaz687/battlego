import { prisma } from '../services/database.js';
import { BaseRepository } from './BaseRepository.js';
import { AppError } from '../utils/AppError.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class ChallengeRepository extends BaseRepository<any, any, any> {
  constructor() {
    super(prisma.challenge, 'challenge');
  }

  async findActive() {
    const now = new Date();
    return prisma.challenge.findMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { endDate: 'asc' },
    });
  }

  async findMine(userId: string) {
    return prisma.challenge.findMany({
      where: {
        participants: { some: { userId } },
      },
      orderBy: { endDate: 'asc' },
    });
  }

  async findByIdWithParticipants(id: string) {
    return prisma.challenge.findUnique({
      where: { id },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
      },
    });
  }

  async create(data: {
    name: string;
    description: string;
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    goal: any;
    startDate: Date;
    endDate: Date;
    createdBy?: string;
  }) {
    return prisma.challenge.create({ data: data as never });
  }

  async joinChallenge(challengeId: string, userId: string) {
    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new AppError('Challenge not found', 404);

    const existing = await prisma.challengeParticipant.findUnique({
      where: { challengeId_userId: { challengeId, userId } },
    });
    if (existing) throw new AppError('Already joined this challenge', 409);

    const participant = await prisma.challengeParticipant.create({
      data: { challengeId, userId },
    });

    await prisma.challenge.update({
      where: { id: challengeId },
      data: { participantCount: { increment: 1 } },
    });

    return participant;
  }

  async updateProgress(challengeId: string, userId: string, progress: number) {
    return prisma.challengeParticipant.update({
      where: { challengeId_userId: { challengeId, userId } },
      data: { progress },
    });
  }

  async getLeaderboard(challengeId: string) {
    return prisma.challengeParticipant.findMany({
      where: { challengeId },
      orderBy: { progress: 'desc' },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
  }
}

export const challengeRepository = new ChallengeRepository();
