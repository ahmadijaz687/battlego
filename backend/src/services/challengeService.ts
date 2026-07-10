import { prisma } from '../services/database.js';

export async function getChallenges() {
  return prisma.challenge.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function getActiveChallenges() {
  const now = new Date();
  return prisma.challenge.findMany({
    where: { startDate: { lte: now }, endDate: { gte: now } },
    orderBy: { endDate: 'asc' },
  });
}

export async function getChallenge(challengeId: string) {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: { participants: true },
  });
  if (!challenge) throw new Error('Challenge not found');
  return challenge;
}

export async function createChallenge(userId: string, data: {
  name: string;
  description: string;
  type: string;
  goal: Record<string, unknown>;
  reward?: Record<string, unknown>;
  startDate: string;
  endDate: string;
}) {
  return prisma.challenge.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
      goal: data.goal as never,
      reward: (data.reward ?? {}) as never,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      createdBy: userId,
    },
  });
}

export async function joinChallenge(challengeId: string, userId: string) {
  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge) throw new Error('Challenge not found');

  const existing = await prisma.challengeParticipant.findUnique({
    where: { challengeId_userId: { challengeId, userId } },
  });
  if (existing) throw new Error('Already joined this challenge');

  const [participant] = await prisma.$transaction([
    prisma.challengeParticipant.create({ data: { challengeId, userId } }),
    prisma.challenge.update({
      where: { id: challengeId },
      data: { participantCount: { increment: 1 } },
    }),
  ]);

  return participant;
}

export async function updateChallengeProgress(challengeId: string, userId: string, progress: number) {
  const participant = await prisma.challengeParticipant.findUnique({
    where: { challengeId_userId: { challengeId, userId } },
  });
  if (!participant) throw new Error('Not participating in this challenge');

  return prisma.challengeParticipant.update({
    where: { challengeId_userId: { challengeId, userId } },
    data: { progress, completed: progress >= 100 },
  });
}

export async function getUserChallenges(userId: string) {
  return prisma.challengeParticipant.findMany({
    where: { userId },
    include: { challenge: true },
    orderBy: { joinedAt: 'desc' },
  });
}

export async function getChallengeLeaderboard(challengeId: string) {
  return prisma.challengeParticipant.findMany({
    where: { challengeId },
    orderBy: { progress: 'desc' },
    take: 50,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });
}
