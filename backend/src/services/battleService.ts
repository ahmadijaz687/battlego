import { prisma } from '../services/database.js';
import { AppError } from '../utils/AppError.js';

export async function getBattles(userId: string) {
  return prisma.battle.findMany({
    where: {
      OR: [{ creatorId: userId }, { opponentId: userId }],
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
}

export async function createBattle(userId: string, data: { type: string; opponentId: string }) {
  return prisma.battle.create({
    data: {
      creatorId: userId,
      opponentId: data.opponentId,
      type: data.type,
      status: 'pending',
    },
  });
}

export async function acceptBattle(userId: string, battleId: string) {
  const battle = await prisma.battle.findUnique({ where: { id: battleId } });
  if (!battle || battle.opponentId !== userId) {
    throw new Error('Not authorized to accept this battle');
  }
  if (battle.status !== 'pending') {
    throw new Error('Battle is not pending');
  }
  return prisma.battle.update({
    where: { id: battleId },
    data: { status: 'active', startTime: new Date() },
  });
}

export async function startBattle(userId: string, battleId: string) {
  const battle = await prisma.battle.findUnique({ where: { id: battleId } });
  if (!battle) throw new Error('Battle not found');
  if (battle.creatorId !== userId && battle.opponentId !== userId) {
    throw new Error('Not a participant');
  }
  return prisma.battle.update({
    where: { id: battleId },
    data: { status: 'active', startTime: new Date() },
  });
}

export async function updateBattleScore(
  userId: string,
  battleId: string,
  score: number
) {
  const battle = await prisma.battle.findUnique({ where: { id: battleId } });
  if (!battle) throw new Error('Battle not found');
  if (battle.status !== 'active') throw new Error('Battle is not active');

  const isCreator = battle.creatorId === userId;
  if (!isCreator && battle.opponentId !== userId) {
    throw new Error('Not a participant');
  }

  const field = isCreator ? 'creatorScore' : 'opponentScore';
  const currentScore = isCreator ? battle.creatorScore : battle.opponentScore;

  return prisma.battle.update({
    where: { id: battleId },
    data: { [field]: (currentScore ?? 0) + score },
  });
}

export async function completeBattle(userId: string, battleId: string) {
  const battle = await prisma.battle.findUnique({ where: { id: battleId } });
  if (!battle) throw new Error('Battle not found');
  if (battle.creatorId !== userId && battle.opponentId !== userId) {
    throw new Error('Not a participant');
  }

  const winnerId =
    (battle.creatorScore ?? 0) > (battle.opponentScore ?? 0)
      ? battle.creatorId
      : (battle.opponentScore ?? 0) > (battle.creatorScore ?? 0)
        ? battle.opponentId
        : null;

  return prisma.battle.update({
    where: { id: battleId },
    data: { status: 'completed', endTime: new Date(), winnerId },
  });
}

export async function getBattleById(battleId: string) {
  const battle = await prisma.battle.findUnique({
    where: { id: battleId },
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      opponent: { select: { id: true, name: true, avatar: true } },
    },
  });
  if (!battle) throw new AppError('Battle not found', 404);

  const participants = [
    {
      user: battle.creator,
      progressValue: battle.creatorScore ?? 0,
      isWinner: battle.winnerId != null && battle.winnerId === battle.creatorId,
      joinedAt: battle.createdAt,
    },
    ...(battle.opponent
      ? [
          {
            user: battle.opponent,
            progressValue: battle.opponentScore ?? 0,
            isWinner: battle.winnerId != null && battle.winnerId === battle.opponentId,
            joinedAt: battle.startTime ?? battle.createdAt,
          },
        ]
      : []),
  ];

  const standings = [...participants]
    .sort((a, b) => b.progressValue - a.progressValue)
    .map((p, index) => ({
      rank: index + 1,
      userId: p.user?.id ?? null,
      name: p.user?.name ?? null,
      progressValue: p.progressValue,
      isWinner: p.isWinner,
    }));

  return {
    id: battle.id,
    type: battle.type,
    mode: battle.mode,
    metric: battle.metric,
    target: battle.target,
    status: battle.status,
    startDate: battle.startTime,
    endDate: battle.endTime,
    inviteCode: battle.inviteCode,
    createdBy: battle.creatorId,
    participants,
    standings,
  };
}

export async function getBattleStats(userId: string) {
  const [total, wins, losses] = await Promise.all([
    prisma.battle.count({
      where: { OR: [{ creatorId: userId }, { opponentId: userId }] },
    }),
    prisma.battle.count({
      where: { status: 'completed', winnerId: userId },
    }),
    prisma.battle.count({
      where: {
        status: 'completed',
        winnerId: { not: userId },
        OR: [{ creatorId: userId }, { opponentId: userId }],
      },
    }),
  ]);

  const active = await prisma.battle.count({
    where: {
      status: 'active',
      OR: [{ creatorId: userId }, { opponentId: userId }],
    },
  });

  return { total, wins, losses, active, winRate: total > 0 ? Math.round((wins / total) * 100) : 0 };
}

export async function getLeaderboard() {
  const levels = await prisma.userLevel.findMany({
    orderBy: { totalXp: 'desc' },
    take: 50,
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });

  return levels.map((ul, i) => ({
    rank: i + 1,
    userId: ul.user.id,
    name: ul.user.name,
    avatar: ul.user.avatar,
    xp: ul.totalXp,
    level: ul.level,
  }));
}

// ============ NEW METHODS ============

export async function leaveBattle(userId: string, battleId: string) {
  const battle = await prisma.battle.findUnique({ where: { id: battleId } });
  if (!battle) throw new Error('Battle not found');
  if (battle.creatorId !== userId && battle.opponentId !== userId) {
    throw new Error('Not a participant');
  }
  if (battle.status === 'active') {
    return prisma.battle.update({
      where: { id: battleId },
      data: {
        status: 'completed',
        endTime: new Date(),
        winnerId: battle.creatorId === userId ? battle.opponentId : battle.creatorId,
      },
    });
  }
  return prisma.battle.update({
    where: { id: battleId },
    data: { status: 'cancelled' },
  });
}

export async function inviteUser(senderId: string, battleId: string, receiverId: string) {
  const existing = await prisma.battleInvite.findFirst({
    where: { battleId, receiverId, status: 'pending' },
  });
  if (existing) throw new Error('Invite already sent');

  return prisma.battleInvite.create({
    data: { battleId, senderId, receiverId },
  });
}

export async function getBattleParticipants(battleId: string) {
  const battle = await prisma.battle.findUnique({
    where: { id: battleId },
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      opponent: { select: { id: true, name: true, avatar: true } },
    },
  });
  if (!battle) throw new Error('Battle not found');
  return [
    { ...battle.creator, role: 'creator' },
    ...(battle.opponent ? [{ ...battle.opponent, role: 'opponent' as const }] : []),
  ];
}

export async function getBattleProgress(battleId: string) {
  return prisma.battleProgress.findMany({
    where: { battleId },
    orderBy: { lastUpdated: 'desc' },
  });
}

export async function updateBattleProgress(userId: string, battleId: string, currentValue: number) {
  const existing = await prisma.battleProgress.findUnique({
    where: { battleId_userId: { battleId, userId } },
  });

  const targetValue = 100;
  const percentage = Math.min(100, (currentValue / targetValue) * 100);

  if (existing) {
    return prisma.battleProgress.update({
      where: { id: existing.id },
      data: { currentValue, percentage, lastUpdated: new Date() },
    });
  }

  return prisma.battleProgress.create({
    data: { battleId, userId, currentValue, targetValue, percentage },
  });
}

export async function getBattleHistory(userId: string) {
  return prisma.battle.findMany({
    where: {
      OR: [{ creatorId: userId }, { opponentId: userId }],
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function getBattleHistoryById(userId: string, battleId: string) {
  const battle = await prisma.battle.findUnique({ where: { id: battleId } });
  if (!battle) throw new Error('Battle not found');
  if (battle.creatorId !== userId && battle.opponentId !== userId) {
    throw new Error('Not authorized');
  }
  return battle;
}

export async function getBattleResults(battleId: string) {
  const battle = await prisma.battle.findUnique({ where: { id: battleId } });
  if (!battle) throw new Error('Battle not found');

  return {
    winnerId: battle.winnerId,
    creatorScore: battle.creatorScore,
    opponentScore: battle.opponentScore,
    startTime: battle.startTime,
    endTime: battle.endTime,
    status: battle.status,
  };
}

export async function getBattleComments(battleId: string) {
  return prisma.battleComment.findMany({
    where: { battleId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function createBattleComment(userId: string, battleId: string, message: string) {
  return prisma.battleComment.create({
    data: { battleId, userId, message },
  });
}

export async function updateBattleComment(userId: string, commentId: string, message: string) {
  const comment = await prisma.battleComment.findUnique({ where: { id: commentId } });
  if (!comment) throw new Error('Comment not found');
  if (comment.userId !== userId) throw new Error('Not authorized');
  return prisma.battleComment.update({
    where: { id: commentId },
    data: { message, updatedAt: new Date() },
  });
}

export async function deleteBattleComment(userId: string, commentId: string) {
  const comment = await prisma.battleComment.findUnique({ where: { id: commentId } });
  if (!comment) throw new Error('Comment not found');
  if (comment.userId !== userId) throw new Error('Not authorized');
  return prisma.battleComment.delete({ where: { id: commentId } });
}

export async function addBattleReaction(userId: string, battleId: string, reaction: string) {
  const existing = await prisma.battleReaction.findUnique({
    where: { battleId_userId: { battleId, userId } },
  });
  if (existing) {
    return prisma.battleReaction.update({
      where: { id: existing.id },
      data: { reaction },
    });
  }
  return prisma.battleReaction.create({
    data: { battleId, userId, reaction },
  });
}

export async function removeBattleReaction(userId: string, battleId: string) {
  const existing = await prisma.battleReaction.findUnique({
    where: { battleId_userId: { battleId, userId } },
  });
  if (existing) {
    return prisma.battleReaction.delete({ where: { id: existing.id } });
  }
}
