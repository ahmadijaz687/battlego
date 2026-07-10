import { Request, Response } from 'express';
import { prisma } from '../services/database.js';
import { successResponse, paginatedResponse } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

export async function searchUsersHandler(req: Request, res: Response) {
  const q = (req.query.q as string) || '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const where = q
    ? {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, name: true, avatar: true, createdAt: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  res.json(paginatedResponse(users, total, page, limit));
}

export async function getUserByIdHandler(req: Request, res: Response) {
  const userId = req.params.id as string;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, avatar: true, role: true, createdAt: true },
  });
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found', data: null });
    return;
  }
  res.json(successResponse(user));
}

export async function getUserProfileHandler(req: Request, res: Response) {
  const userId = req.params.id as string;
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });
  if (!profile) {
    res.status(404).json({ success: false, message: 'Profile not found', data: null });
    return;
  }
  res.json(successResponse(profile));
}

export async function getUserStatisticsHandler(req: Request, res: Response) {
  const userId = req.params.id as string;

  const [workoutCount, battleCount, totalDuration, level] = await Promise.all([
    prisma.workout.count({ where: { userId } }),
    prisma.battle.count({
      where: { OR: [{ creatorId: userId }, { opponentId: userId }] },
    }),
    prisma.workout.aggregate({ where: { userId }, _sum: { duration: true } }),
    prisma.userLevel.findUnique({ where: { userId } }),
  ]);

  res.json(successResponse({
    totalWorkouts: workoutCount,
    totalBattles: battleCount,
    totalDuration: totalDuration._sum.duration ?? 0,
    level: level?.level ?? 1,
    xp: level?.xp ?? 0,
    totalXp: level?.totalXp ?? 0,
  }));
}

export async function getUserAchievementsHandler(req: Request, res: Response) {
  const userId = req.params.id as string;
  const achievements = await prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
    orderBy: { unlockedAt: 'desc' },
  });
  res.json(successResponse(achievements));
}

export async function getUserBadgesHandler(req: Request, res: Response) {
  const userId = req.params.id as string;
  const badges = await prisma.userItem.findMany({
    where: {
      userId,
      item: { type: 'BADGE' },
    },
    include: { item: true },
    orderBy: { purchasedAt: 'desc' },
  });
  res.json(successResponse(badges));
}

export async function getUserWorkoutsHandler(req: Request, res: Response) {
  const userId = req.params.id as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const [workouts, total] = await Promise.all([
    prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.workout.count({ where: { userId } }),
  ]);

  res.json(paginatedResponse(workouts, total, page, limit));
}

export async function getUserBattlesHandler(req: Request, res: Response) {
  const userId = req.params.id as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const where = { OR: [{ creatorId: userId }, { opponentId: userId }] };

  const [battles, total] = await Promise.all([
    prisma.battle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.battle.count({ where }),
  ]);

  res.json(paginatedResponse(battles, total, page, limit));
}

export async function getFollowersHandler(req: Request, res: Response) {
  const userId = req.params.id as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const [followers, total] = await Promise.all([
    prisma.friend.findMany({
      where: { friendId: userId },
      select: { id: true, userId: true, name: true, avatar: true, status: true, lastSeen: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { lastSeen: 'desc' },
    }),
    prisma.friend.count({ where: { friendId: userId } }),
  ]);

  res.json(paginatedResponse(followers, total, page, limit));
}

export async function getFollowingHandler(req: Request, res: Response) {
  const userId = req.params.id as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const [following, total] = await Promise.all([
    prisma.friend.findMany({
      where: { userId },
      select: { id: true, friendId: true, name: true, avatar: true, status: true, lastSeen: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { lastSeen: 'desc' },
    }),
    prisma.friend.count({ where: { userId } }),
  ]);

  res.json(paginatedResponse(following, total, page, limit));
}

export async function followUserHandler(req: Request, res: Response) {
  const currentUserId = (req as AuthenticatedRequest).user!.id;
  const targetUserId = req.params.id as string;

  if (currentUserId === targetUserId) {
    res.status(400).json({ success: false, message: 'Cannot follow yourself', data: null });
    return;
  }

  const target = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!target) {
    res.status(404).json({ success: false, message: 'User not found', data: null });
    return;
  }

  const existing = await prisma.friend.findUnique({
    where: { userId_friendId: { userId: currentUserId, friendId: targetUserId } },
  });
  if (existing) {
    res.json(successResponse(existing, 'Already following'));
    return;
  }

  const follow = await prisma.friend.create({
    data: {
      userId: currentUserId,
      friendId: targetUserId,
      name: target.name,
      username: target.name.toLowerCase().replace(/\s+/g, '_') + '_' + targetUserId.slice(0, 8),
      avatar: target.avatar,
      status: 'offline',
    },
  });

  res.status(201).json(successResponse(follow, 'Now following'));
}

export async function unfollowUserHandler(req: Request, res: Response) {
  const currentUserId = (req as AuthenticatedRequest).user!.id;
  const targetUserId = req.params.id as string;

  await prisma.friend.deleteMany({
    where: { userId: currentUserId, friendId: targetUserId },
  });

  res.json(successResponse(null, 'Unfollowed'));
}

export async function blockUserHandler(req: Request, res: Response) {
  const currentUserId = (req as AuthenticatedRequest).user!.id;
  const targetUserId = req.params.id as string;

  if (currentUserId === targetUserId) {
    res.status(400).json({ success: false, message: 'Cannot block yourself', data: null });
    return;
  }

  const existing = await prisma.blockedUser.findUnique({
    where: { userId_blockedUserId: { userId: currentUserId, blockedUserId: targetUserId } },
  });
  if (existing) {
    res.json(successResponse(existing, 'Already blocked'));
    return;
  }

  await prisma.friend.deleteMany({
    where: {
      OR: [
        { userId: currentUserId, friendId: targetUserId },
        { userId: targetUserId, friendId: currentUserId },
      ],
    },
  });

  const block = await prisma.blockedUser.create({
    data: { userId: currentUserId, blockedUserId: targetUserId },
  });

  res.status(201).json(successResponse(block, 'User blocked'));
}

export async function unblockUserHandler(req: Request, res: Response) {
  const currentUserId = (req as AuthenticatedRequest).user!.id;
  const targetUserId = req.params.id as string;

  await prisma.blockedUser.deleteMany({
    where: { userId: currentUserId, blockedUserId: targetUserId },
  });

  res.json(successResponse(null, 'User unblocked'));
}

export async function reportUserHandler(req: Request, res: Response) {
  const currentUserId = (req as AuthenticatedRequest).user!.id;
  const targetUserId = req.params.id as string;
  const { reason } = req.body;

  const report = await prisma.report.create({
    data: {
      reporterId: currentUserId,
      reportedUserId: targetUserId,
      reason,
    },
  });

  res.status(201).json(successResponse(report, 'User reported'));
}

export async function registerPushTokenHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const { token, platform } = req.body;

  const pushToken = await prisma.pushToken.upsert({
    where: { token },
    update: { userId, platform, updatedAt: new Date() },
    create: { userId, token, platform },
  });

  res.json(successResponse(pushToken, 'Push token registered'));
}

export async function exportUserDataHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;

  const [
    profile,
    workouts,
    personalRecords,
    meals,
    battlesAsCreator,
    battlesAsOpponent,
    notifications,
    pushTokens,
    userBadges,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.workout.findMany({ where: { userId }, include: { sections: { include: { exercises: { include: { sets: true } } } } } }),
    prisma.personalRecord.findMany({ where: { userId } }),
    prisma.meal.findMany({ where: { userId }, include: { foods: true } }),
    prisma.battle.findMany({ where: { creatorId: userId } }),
    prisma.battle.findMany({ where: { opponentId: userId } }),
    prisma.notification.findMany({ where: { userId } }),
    prisma.pushToken.findMany({ where: { userId } }),
    prisma.userBadge.findMany({ where: { userId }, include: { badge: true } }),
  ]);

  res.json(
    successResponse({
      profile,
      workouts,
      personalRecords,
      meals,
      battles: { created: battlesAsCreator, joined: battlesAsOpponent },
      notifications,
      pushTokens,
      badges: userBadges,
    }, 'User data export')
  );
}
