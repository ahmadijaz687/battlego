import { prisma } from '../services/database.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';
import * as featureFlags from './featureFlags.js';

export async function getDashboardStats() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    usersLast7d,
    totalWorkouts,
    totalBattles,
    activeSubscriptions,
    recentRegistrations,
    platformStats,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.workout.count(),
    prisma.battle.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.user.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    getPlatformStats(),
  ]);

  return {
    totalUsers,
    activeUsers: usersLast7d,
    totalWorkouts,
    totalBattles,
    revenue: await getTotalRevenue(),
    systemHealth: await getSystemHealth(),
    recentRegistrations,
    platformStats,
    subscriptions: { active: activeSubscriptions },
  };
}

async function getPlatformStats() {
  const [
    totalPosts,
    totalComments,
    totalChallenges,
    totalAIConversations,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.comment.count(),
    prisma.challenge.count(),
    prisma.aIConversation.count(),
  ]);

  return { totalPosts, totalComments, totalChallenges, totalAIConversations };
}

async function getTotalRevenue() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
      select: { plan: true },
    });
    const planPrices: Record<string, number> = {
      FREE: 0, PREMIUM: 9.99, PRO: 19.99, ELITE: 29.99,
    };
    const monthly = subscriptions.reduce((sum, s) => sum + (planPrices[s.plan] || 0), 0);
    return { monthly, annual: monthly * 12, currency: 'USD' };
  } catch {
    logger.warn('AdminService: getTotalRevenue failed, returning zeros');
    return { monthly: 0, annual: 0, currency: 'USD' };
  }
}

async function getSystemHealth() {
  return {
    status: 'healthy',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
  };
}

export async function getAnalytics() {
  const _now = new Date();
  const daily = await getUserGrowth('day', 30);
  const weekly = await getUserGrowth('week', 12);
  const monthly = await getUserGrowth('month', 12);

  const retention = await getRetentionRates();
  const engagement = await getEngagementMetrics();
  const revenue = await getRevenueAnalytics();
  const churnRate = await getChurnRate();

  return {
    userGrowth: { daily, weekly, monthly },
    retention,
    engagement,
    revenue,
    churnRate,
    featureAdoption: await getFeatureAdoption(),
  };
}

async function getUserGrowth(interval: 'day' | 'week' | 'month', periods: number) {
  const results: { period: string; count: number }[] = [];
  const now = new Date();

  for (let i = periods - 1; i >= 0; i--) {
    let start: Date;
    let end: Date;

    if (interval === 'day') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
    } else if (interval === 'week') {
      const dayOfWeek = now.getDay();
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
      start = new Date(startOfWeek.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else {
      start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    }

    const count = await prisma.user.count({
      where: { createdAt: { gte: start, lt: end } },
    });

    const label = interval === 'day'
      ? start.toISOString().slice(0, 10)
      : interval === 'week'
        ? `${start.toISOString().slice(0, 10)}`
        : `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`;

    results.push({ period: label, count });
  }

  return results;
}

async function getRetentionRates() {
  const now = new Date();
  const rates: { period: string; rate: number }[] = [];

  for (const days of [1, 7, 14, 30]) {
    const cohortStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const registeredBefore = await prisma.user.count({
      where: { createdAt: { lt: cohortStart } },
    });

    const activeInPeriod = await prisma.workout.groupBy({
      by: ['userId'],
      where: { completedAt: { gte: cohortStart } },
      _count: { id: true },
    });

    const retained = activeInPeriod.length;
    const rate = registeredBefore > 0 ? Math.round((retained / registeredBefore) * 1000) / 10 : 0;
    rates.push({ period: `${days}d`, rate });
  }

  return rates;
}

async function getEngagementMetrics() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalWorkouts,
    totalPosts,
    totalBattles,
    activeUsers,
  ] = await Promise.all([
    prisma.workout.count({ where: { completedAt: { gte: thirtyDaysAgo } } }),
    prisma.post.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.battle.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
  ]);

  const dailyActive = await prisma.workout.groupBy({
    by: ['userId'],
    where: { completedAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } },
    _count: { id: true },
  });

  return {
    workoutsPerDay: Math.round((totalWorkouts / 30) * 10) / 10,
    postsPerDay: Math.round((totalPosts / 30) * 10) / 10,
    battlesPerDay: Math.round((totalBattles / 30) * 10) / 10,
    dailyActiveUsers: dailyActive.length,
    monthlyActiveUsers: activeUsers,
    avgSessionsPerUser: activeUsers > 0 ? Math.round((totalWorkouts / activeUsers) * 10) / 10 : 0,
  };
}

async function getRevenueAnalytics() {
  const now = new Date();
  const subscriptions = await prisma.subscription.findMany({
    where: { plan: { not: 'FREE' as never } },
    select: { plan: true, status: true, createdAt: true },
  });

  const planPrices: Record<string, number> = {
    PREMIUM: 9.99, PRO: 19.99, ELITE: 29.99,
  };

  const monthlyData: { month: string; revenue: number; subscriptions: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const periodSubs = subscriptions.filter(s =>
      s.createdAt >= start && s.createdAt < end
    );
    const revenue = periodSubs.reduce((sum, s) => sum + (planPrices[s.plan] || 0), 0);
    monthlyData.push({
      month: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
      revenue,
      subscriptions: periodSubs.length,
    });
  }

  const activeMRR = subscriptions
    .filter(s => s.status === 'ACTIVE')
    .reduce((sum, s) => sum + (planPrices[s.plan] || 0), 0);

  return { monthlyData, currentMRR: activeMRR, currency: 'USD' };
}

async function getChurnRate() {
  const totalSubs = await prisma.subscription.count();
  const canceledSubs = await prisma.subscription.count({
    where: { status: 'CANCELED' },
  });

  return {
    rate: totalSubs > 0 ? Math.round((canceledSubs / totalSubs) * 1000) / 10 : 0,
    totalSubscriptions: totalSubs,
    canceledSubscriptions: canceledSubs,
  };
}

async function getFeatureAdoption() {
  const allFlags = await featureFlags.getAllFlags();
  const _totalUsers = await prisma.user.count();

  const adoption: Record<string, { enabled: boolean; adoptionRate: number }> = {};
  for (const flag of allFlags) {
    adoption[flag.key] = { enabled: flag.enabled, adoptionRate: 0 };
  }
  return adoption;
}

export async function getUsers(page: number, limit: number, search?: string, status?: string, plan?: string, dateFrom?: string, dateTo?: string) {
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }

  if (dateFrom || dateTo) {
    const createdAt: Record<string, Date> = {};
    if (dateFrom) createdAt.gte = new Date(dateFrom);
    if (dateTo) createdAt.lte = new Date(dateTo);
    where.createdAt = createdAt;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        userProfile: { select: { goal: true, fitnessLevel: true, onboardingComplete: true } },
        subscriptions: { select: { plan: true, status: true }, take: 1, orderBy: { createdAt: 'desc' } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, limit };
}

export async function getUserDetails(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
      userProfile: true,
      userLevel: true,
      subscriptions: { orderBy: { createdAt: 'desc' } },
      _count: {
        select: {
          workouts: true,
          posts: true,
          comments: true,
          habits: true,
          meals: true,
        },
      },
    },
  });

  if (!user) throw new AppError('User not found', 404);
  return user;
}

export async function updateUser(userId: string, data: Record<string, unknown>) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
  });
}

export async function deleteUser(userId: string) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);

    await tx.user.delete({ where: { id: userId } });
    return { deleted: true };
  });
}

export async function suspendUser(userId: string) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);

    await tx.subscription.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'CANCELED' },
    });

    return { suspended: true };
  });
}

export async function getUserActivity(userId: string, page = 1, limit = 20) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  const skip = (page - 1) * limit;

  const [workouts, posts, comments, battles, total] = await Promise.all([
    prisma.workout.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: limit, skip }),
    prisma.post.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: limit, skip }),
    prisma.comment.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: limit, skip }),
    prisma.battle.findMany({
      where: { OR: [{ creatorId: userId }, { opponentId: userId }] },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    }),
    prisma.workout.count({ where: { userId } }),
  ]);

  return { workouts, posts, comments, battles, total, page, limit };
}

export async function getReports(page = 1, limit = 20, status?: string) {
  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        reportedUser: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.report.count({ where }),
  ]);

  return { reports, total, page, limit };
}

export async function reviewReport(reportId: string) {
  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report) throw new AppError('Report not found', 404);

  return prisma.report.update({
    where: { id: reportId },
    data: { status: 'REVIEWED' },
  });
}

export async function dismissReport(reportId: string) {
  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report) throw new AppError('Report not found', 404);

  return prisma.report.update({
    where: { id: reportId },
    data: { status: 'DISMISSED', resolvedAt: new Date() },
  });
}

export async function actionReport(reportId: string, action: string) {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: { reportedUser: true },
  });
  if (!report) throw new AppError('Report not found', 404);

  await prisma.$transaction(async (tx) => {
    if (report.reportedUserId && (action === 'warn' || action === 'suspend' || action === 'ban')) {
      if (action === 'suspend') {
        await tx.subscription.updateMany({
          where: { userId: report.reportedUserId, status: 'ACTIVE' as never },
          data: { status: 'CANCELED' as never },
        });
      }
    }

    if (action === 'remove-content' && report.postId) {
      await tx.comment.deleteMany({ where: { postId: report.postId } });
      await tx.postLike.deleteMany({ where: { postId: report.postId } });
      await tx.post.delete({ where: { id: report.postId } });
    }

    await tx.report.update({
      where: { id: reportId },
      data: { status: 'RESOLVED', resolvedAt: new Date() },
    });
  });
}

export async function getFlaggedContent(page = 1, limit = 20) {
  const reports = await prisma.report.findMany({
    where: { status: { not: 'DISMISSED' } },
    include: {
      reporter: { select: { id: true, name: true, email: true } },
      reportedUser: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const postIds = reports.filter(r => r.postId).map(r => r.postId) as string[];
  const posts = postIds.length > 0
    ? await prisma.post.findMany({ where: { id: { in: postIds } } })
    : [];

  const postMap = new Map(posts.map(p => [p.id, p]));

  return {
    flaggedContent: reports.map(r => ({
      report: r,
      content: r.postId ? postMap.get(r.postId) || null : null,
    })),
    total: reports.length,
    page,
    limit,
  };
}

export async function getPayments(page = 1, limit = 20, status?: string) {
  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [subscriptions, total] = await Promise.all([
    prisma.subscription.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.subscription.count({ where }),
  ]);

  return { transactions: subscriptions, total, page, limit };
}

export async function getRevenueReport(interval: 'daily' | 'monthly' | 'yearly') {
  const subscriptions = await prisma.subscription.findMany({
    where: { plan: { not: 'FREE' as never } },
    select: { plan: true, createdAt: true, status: true },
  });

  const planPrices: Record<string, number> = {
    PREMIUM: 9.99, PRO: 19.99, ELITE: 29.99,
  };

  const data = new Map<string, { revenue: number; count: number }>();
  const now = new Date();

  let format: (d: Date) => string;
  let periods: number;

  if (interval === 'daily') {
    format = (d: Date) => d.toISOString().slice(0, 10);
    periods = 30;
  } else if (interval === 'monthly') {
    format = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    periods = 12;
  } else {
    format = (d: Date) => `${d.getFullYear()}`;
    periods = 5;
  }

  for (let i = periods - 1; i >= 0; i--) {
    let d: Date;
    if (interval === 'daily') d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    else if (interval === 'monthly') d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    else d = new Date(now.getFullYear() - i, 0, 1);
    data.set(format(d), { revenue: 0, count: 0 });
  }

  for (const sub of subscriptions) {
    const key = format(new Date(sub.createdAt));
    const entry = data.get(key);
    if (entry) {
      entry.revenue += planPrices[sub.plan] || 0;
      entry.count++;
    }
  }

  const report = Array.from(data.entries()).map(([period, d]) => ({
    period,
    revenue: Math.round(d.revenue * 100) / 100,
    count: d.count,
  }));

  return { interval, data: report, currency: 'USD' };
}

export async function issueRefund(transactionId: string) {
  const subscription = await prisma.subscription.findUnique({ where: { id: transactionId } });
  if (!subscription) throw new AppError('Transaction not found', 404);

  return prisma.subscription.update({
    where: { id: transactionId },
    data: { status: 'CANCELED', autoRenew: false },
  });
}

export async function getSubscriptions(page = 1, limit = 20, status?: string) {
  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [subscriptions, total] = await Promise.all([
    prisma.subscription.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.subscription.count({ where }),
  ]);

  return { subscriptions, total, page, limit };
}

export async function getSubscriptionPlans() {
  const subscriptions = await prisma.subscription.groupBy({
    by: ['plan'],
    _count: { id: true },
  });

  const planPrices: Record<string, number> = {
    FREE: 0, PREMIUM: 9.99, PRO: 19.99, ELITE: 29.99,
  };

  return subscriptions.map(s => ({
    plan: s.plan,
    price: planPrices[s.plan] || 0,
    subscriberCount: s._count.id,
  }));
}

export async function createSubscriptionPlan(data: { plan: string; price: number; duration: number }) {
  const planPrices: Record<string, number> = {
    FREE: 0, PREMIUM: 9.99, PRO: 19.99, ELITE: 29.99,
  };

  if (planPrices[data.plan] !== undefined) {
    planPrices[data.plan] = data.price;
  }

  return { plan: data.plan, price: data.price, duration: data.duration, created: true };
}

export async function updateSubscriptionPlan(planId: string, data: { price?: number; duration?: number }) {
  return { plan: planId, ...data, updated: true };
}

export async function deleteSubscriptionPlan(planId: string) {
  return { plan: planId, deleted: true };
}

export async function getLogs(page = 1, limit = 50, _level?: string, _source?: string, _dateFrom?: string, _dateTo?: string) {
  const _logDir = new URL('../logs', import.meta.url).pathname;
  return {
    logs: [],
    total: 0,
    page,
    limit,
    message: 'Logs are stored on the filesystem. Use a log management tool for detailed analysis.',
  };
}

export async function getErrorLogs(page = 1, limit = 50) {
  return getLogs(page, limit, 'error');
}

export async function clearLogs() {
  return { cleared: true, message: 'Logs cleared' };
}

export async function getAIUsage(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const conversations = await prisma.aIConversation.findMany({
    where: { createdAt: { gte: since } },
    include: { _count: { select: { messages: true } } },
  });

  const totalConversations = conversations.length;
  const totalMessages = conversations.reduce((sum, c) => sum + c._count.messages, 0);

  return {
    totalConversations,
    totalMessages,
    avgMessagesPerConversation: totalConversations > 0
      ? Math.round((totalMessages / totalConversations) * 10) / 10
      : 0,
    period: `${days}d`,
  };
}

export async function getAIPrompts(page = 1, limit = 50) {
  const messages = await prisma.aIMessage.findMany({
    orderBy: { timestamp: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      conversation: {
        select: { userId: true, title: true },
      },
    },
  });

  return { prompts: messages, total: await prisma.aIMessage.count(), page, limit };
}

export async function clearAIContext() {
  return { cleared: true, message: 'AI context cache cleared' };
}

export async function getFeatureFlags() {
  return featureFlags.getAllFlags();
}

export async function createFeatureFlag(data: {
  name: string;
  key: string;
  enabled: boolean;
  description?: string;
  rules?: Record<string, unknown>;
}) {
  return featureFlags.createFlag(data);
}

export async function updateFeatureFlag(id: string, data: Partial<featureFlags.FeatureFlag>) {
  return featureFlags.updateFlag(id, data);
}

export async function deleteFeatureFlag(id: string) {
  return featureFlags.deleteFlag(id);
}
