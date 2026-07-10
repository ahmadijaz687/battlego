import type { EventType } from '@prisma/client';
import { prisma } from '../services/database.js';
import { AppError } from '../utils/AppError.js';

export async function getClients(trainerId: string) {
  return prisma.client.findMany({
    where: { coachId: trainerId },
    include: {
      client: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getClientDetails(clientId: string) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      client: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      plans: true,
    },
  });
  if (!client) throw new AppError('Client not found', 404);

  const workoutCount = await prisma.workout.count({
    where: { userId: client.clientId },
  });
  const latestWeight = await prisma.weightLog.findFirst({
    where: { userId: client.clientId },
    orderBy: { date: 'desc' },
  });

  return { ...client, stats: { workoutCount, latestWeight } };
}

export async function addClient(trainerId: string, clientUserId: string) {
  const user = await prisma.user.findUnique({ where: { id: clientUserId } });
  if (!user) throw new AppError('User not found', 404);

  const existing = await prisma.client.findUnique({
    where: { coachId_clientId: { coachId: trainerId, clientId: clientUserId } },
  });
  if (existing) throw new AppError('Client already added', 409);

  return prisma.client.create({
    data: { coachId: trainerId, clientId: clientUserId },
    include: {
      client: { select: { id: true, name: true, email: true, avatar: true } },
    },
  });
}

export async function removeClient(trainerId: string, clientId: string) {
  const client = await prisma.client.findFirst({
    where: { id: clientId, coachId: trainerId },
  });
  if (!client) throw new AppError('Client not found', 404);

  return prisma.client.delete({ where: { id: clientId } });
}

export async function getClientProgress(clientId: string) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: { client: { select: { id: true, name: true } } },
  });
  if (!client) throw new AppError('Client not found', 404);

  const recentWorkouts = await prisma.workout.findMany({
    where: { userId: client.clientId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const recentMeals = await prisma.meal.findMany({
    where: { userId: client.clientId },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { foods: { include: { food: true } } },
  });

  const recentWeight = await prisma.weightLog.findMany({
    where: { userId: client.clientId },
    orderBy: { date: 'desc' },
    take: 10,
  });

  return { client: client.client, workouts: recentWorkouts, meals: recentMeals, weight: recentWeight };
}

export async function getPlans(trainerId: string) {
  return prisma.clientPlan.findMany({
    where: {
      client: { coachId: trainerId },
    },
    include: {
      client: {
        select: {
          client: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createPlan(trainerId: string, data: {
  clientId: string;
  type: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
}) {
  const client = await prisma.client.findFirst({
    where: { id: data.clientId, coachId: trainerId },
  });
  if (!client) throw new AppError('Client not found', 404);

  return prisma.clientPlan.create({
    data: {
      clientId: data.clientId,
      type: data.type,
      title: data.title,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  });
}

export async function getPlanDetails(planId: string) {
  const plan = await prisma.clientPlan.findUnique({
    where: { id: planId },
    include: {
      client: {
        select: {
          client: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });
  if (!plan) throw new AppError('Plan not found', 404);
  return plan;
}

export async function updatePlan(planId: string, trainerId: string, data: {
  title?: string;
  description?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}) {
  const plan = await prisma.clientPlan.findFirst({
    where: { id: planId, client: { coachId: trainerId } },
  });
  if (!plan) throw new AppError('Plan not found', 404);

  return prisma.clientPlan.update({
    where: { id: planId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.type && { type: data.type }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
}

export async function deletePlan(planId: string, trainerId: string) {
  const plan = await prisma.clientPlan.findFirst({
    where: { id: planId, client: { coachId: trainerId } },
  });
  if (!plan) throw new AppError('Plan not found', 404);

  return prisma.clientPlan.delete({ where: { id: planId } });
}

export async function assignPlan(trainerId: string, planId: string, clientIds: string[]) {
  const existingPlan = await prisma.clientPlan.findFirst({
    where: { id: planId, client: { coachId: trainerId } },
  });
  if (!existingPlan) throw new AppError('Plan not found', 404);

  const results = [];
  for (const clientId of clientIds) {
    const client = await prisma.client.findFirst({
      where: { id: clientId, coachId: trainerId },
    });
    if (!client) continue;

    const newPlan = await prisma.clientPlan.create({
      data: {
        clientId,
        type: existingPlan.type,
        title: existingPlan.title,
        description: existingPlan.description,
        startDate: existingPlan.startDate,
        endDate: existingPlan.endDate,
      },
    });
    results.push(newPlan);
  }

  return results;
}

export async function getClientPlans(clientId: string) {
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) throw new AppError('Client not found', 404);

  return prisma.clientPlan.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCalendar(coachId: string, trainerUserId: string, dateFrom?: string, dateTo?: string) {
  const clientRecords = await prisma.client.findMany({
    where: { coachId },
    select: { clientId: true },
  });
  const userIds = [trainerUserId, ...clientRecords.map((c: { clientId: string }) => c.clientId)];

  const where: Record<string, unknown> = { userId: { in: userIds } };
  if (dateFrom || dateTo) {
    where.startTime = {};
    if (dateFrom) (where.startTime as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) (where.startTime as Record<string, unknown>).lte = new Date(dateTo);
  }

  return prisma.calendarEvent.findMany({
    where,
    orderBy: { startTime: 'asc' },
  });
}

export async function createCalendarEvent(userId: string, data: {
  title: string;
  description?: string;
  eventType: string;
  startTime: string;
  endTime?: string;
  allDay?: boolean;
  color?: string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.calendarEvent.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      eventType: data.eventType as EventType,
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : null,
      allDay: data.allDay ?? false,
      color: data.color,
      metadata: (data.metadata ?? {}) as never,
    },
  });
}

export async function updateCalendarEvent(eventId: string, userId: string, data: {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  color?: string;
}) {
  const event = await prisma.calendarEvent.findFirst({
    where: { id: eventId, userId },
  });
  if (!event) throw new AppError('Event not found', 404);

  return prisma.calendarEvent.update({
    where: { id: eventId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.startTime && { startTime: new Date(data.startTime) }),
      ...(data.endTime !== undefined && { endTime: data.endTime ? new Date(data.endTime) : null }),
      ...(data.allDay !== undefined && { allDay: data.allDay }),
      ...(data.color && { color: data.color }),
    },
  });
}

export async function deleteCalendarEvent(eventId: string, userId: string) {
  const event = await prisma.calendarEvent.findFirst({
    where: { id: eventId, userId },
  });
  if (!event) throw new AppError('Event not found', 404);

  return prisma.calendarEvent.delete({ where: { id: eventId } });
}

export async function getClientCalendar(clientId: string) {
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) throw new AppError('Client not found', 404);

  return prisma.calendarEvent.findMany({
    where: { userId: client.clientId },
    orderBy: { startTime: 'asc' },
  });
}

export async function getClientNutrition(clientId: string) {
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) throw new AppError('Client not found', 404);

  return prisma.meal.findMany({
    where: { userId: client.clientId },
    orderBy: { createdAt: 'desc' },
    include: { foods: { include: { food: true } } },
  });
}

export async function addClientMeal(clientId: string, data: {
  name: string;
  time?: string;
  foods?: { foodId: string; quantity: number }[];
}) {
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) throw new AppError('Client not found', 404);

  return prisma.meal.create({
    data: {
      userId: client.clientId,
      name: data.name,
      time: data.time,
      foods: data.foods ? {
        create: data.foods.map((f) => ({
          foodId: f.foodId,
          quantity: f.quantity,
        })),
      } : undefined,
    },
    include: { foods: { include: { food: true } } },
  });
}

export async function getClientWater(clientId: string) {
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) throw new AppError('Client not found', 404);

  return prisma.waterLog.findMany({
    where: { userId: client.clientId },
    orderBy: { date: 'desc' },
  });
}

export async function getClientWeight(clientId: string) {
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) throw new AppError('Client not found', 404);

  return prisma.weightLog.findMany({
    where: { userId: client.clientId },
    orderBy: { date: 'desc' },
  });
}

export async function getConversations(userId: string) {
  return prisma.conversation.findMany({
    where: {
      participantIds: { array_contains: userId },
    },
    orderBy: { lastMessageAt: 'desc' },
    include: { members: true },
  });
}

export async function getConversationMessages(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { sentAt: 'asc' },
    include: { sender: { select: { id: true, name: true, avatar: true } } },
  });
}

export async function sendMessage(conversationId: string, senderId: string, content: string) {
  return prisma.$transaction(async (tx) => {
    const sender = await tx.user.findUnique({
      where: { id: senderId },
      select: { name: true },
    });
    if (!sender) throw new AppError('Sender not found', 404);

    const message = await tx.message.create({
      data: {
        conversationId,
        senderId,
        senderName: sender.name,
        content,
        type: 'text',
      },
    });

    await tx.conversation.update({
      where: { id: conversationId },
      data: { lastMessage: content, lastMessageAt: new Date() },
    });

    return message;
  });
}

export async function startConversation(senderId: string, clientUserId: string, content: string) {
  return prisma.$transaction(async (tx) => {
    const participants = await tx.user.findMany({
      where: { id: { in: [senderId, clientUserId] } },
      select: { id: true, name: true },
    });
    if (participants.length !== 2) throw new AppError('Invalid participants', 400);

    const participantIds = participants.map((u: { id: string; name: string }) => u.id);
    const participantNames = participants.map((u: { id: string; name: string }) => u.name);
    const sender = participants.find((u: { id: string; name: string }) => u.id === senderId)!;

    const conversation = await tx.conversation.create({
      data: {
        participantIds,
        participantNames,
        lastMessage: content,
        lastMessageAt: new Date(),
        members: {
          create: participants.map((u: { id: string; name: string }) => ({
            userId: u.id,
            userName: u.name,
          })),
        },
      },
    });

    await tx.message.create({
      data: {
        conversationId: conversation.id,
        senderId,
        senderName: sender.name,
        content,
        type: 'text',
      },
    });

    return conversation;
  });
}

export async function getWorkoutProgress(clientId: string, dateFrom?: string, dateTo?: string) {
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) throw new AppError('Client not found', 404);

  const where: Record<string, unknown> = { userId: client.clientId };
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) (where.createdAt as Record<string, unknown>).lte = new Date(dateTo);
  }

  return prisma.workout.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    include: {
      sections: {
        include: {
          exercises: {
            include: { sets: true },
          },
        },
      },
    },
  });
}

export async function getMeasurementProgress(clientId: string) {
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) throw new AppError('Client not found', 404);

  return prisma.bodyMeasurement.findMany({
    where: { userId: client.clientId },
    orderBy: { date: 'asc' },
  });
}

export async function getStrengthProgress(clientId: string) {
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) throw new AppError('Client not found', 404);

  return prisma.personalRecord.findMany({
    where: { userId: client.clientId },
    orderBy: { date: 'desc' },
  });
}

export async function getNutritionAdherence(clientId: string) {
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) throw new AppError('Client not found', 404);

  const meals = await prisma.meal.findMany({
    where: { userId: client.clientId },
    orderBy: { createdAt: 'desc' },
    include: { foods: { include: { food: true } } },
  });

  const totalCalories = meals.reduce((sum, meal) => {
    return sum + meal.foods.reduce((s, f) => s + f.food.calories * f.quantity, 0);
  }, 0);

  return { meals, totalCalories, mealCount: meals.length };
}

export async function getCompleteProgressSummary(clientId: string) {
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) throw new AppError('Client not found', 404);

  const [workouts, measurements, strength, nutrition, weight] = await Promise.all([
    prisma.workout.findMany({ where: { userId: client.clientId }, orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.bodyMeasurement.findMany({ where: { userId: client.clientId }, orderBy: { date: 'desc' }, take: 10 }),
    prisma.personalRecord.findMany({ where: { userId: client.clientId }, orderBy: { date: 'desc' }, take: 20 }),
    prisma.meal.findMany({
      where: { userId: client.clientId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { foods: { include: { food: true } } },
    }),
    prisma.weightLog.findMany({ where: { userId: client.clientId }, orderBy: { date: 'desc' }, take: 20 }),
  ]);

  return { workouts, measurements, strength, nutrition, weight };
}

export async function generateClientSummary(clientId: string) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      client: { select: { id: true, name: true, email: true, avatar: true } },
      plans: { where: { isActive: true } },
    },
  });
  if (!client) throw new AppError('Client not found', 404);

  const [workouts, weightLogs, _bodyMeasurements, personalRecords] = await Promise.all([
    prisma.workout.findMany({ where: { userId: client.clientId }, orderBy: { createdAt: 'desc' } }),
    prisma.weightLog.findMany({ where: { userId: client.clientId }, orderBy: { date: 'desc' } }),
    prisma.bodyMeasurement.findMany({ where: { userId: client.clientId }, orderBy: { date: 'desc' } }),
    prisma.personalRecord.findMany({ where: { userId: client.clientId }, orderBy: { date: 'desc' } }),
  ]);

  const totalWorkouts = workouts.length;
  const completedWorkouts = workouts.filter((w) => w.completedAt).length;
  const completionRate = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;
  const weightChange = weightLogs.length >= 2
    ? weightLogs[0].weight - weightLogs[weightLogs.length - 1].weight
    : null;

  return {
    client: client.client,
    plans: client.plans,
    stats: {
      totalWorkouts,
      completedWorkouts,
      completionRate,
      weightChange,
      currentWeight: weightLogs[0]?.weight ?? null,
      startWeight: weightLogs[weightLogs.length - 1]?.weight ?? null,
      personalRecordCount: personalRecords.length,
    },
  };
}

export async function generateMonthlyReport(trainerId: string, year?: number, month?: number) {
  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth() + 1;
  const startDate = new Date(y, m - 1, 1);
  const endDate = new Date(y, m, 0, 23, 59, 59, 999);

  const clients = await prisma.client.findMany({
    where: { coachId: trainerId },
    include: { client: { select: { id: true, name: true } } },
  });

  const clientStats = await Promise.all(
    clients.map(async (c) => {
      const workoutCount = await prisma.workout.count({
        where: { userId: c.clientId, createdAt: { gte: startDate, lte: endDate } },
      });
      return { clientName: c.client.name, clientId: c.id, workoutCount };
    })
  );

  const totalWorkouts = clientStats.reduce((sum, c) => sum + c.workoutCount, 0);
  const activeClients = clientStats.filter((c) => c.workoutCount > 0).length;

  return {
    period: { year: y, month: m },
    totalClients: clients.length,
    activeClients,
    totalWorkouts,
    clientStats,
  };
}

export async function generateEarningsReport(trainerId: string) {
  const coach = await prisma.coachProfile.findUnique({ where: { id: trainerId } });
  if (!coach) throw new AppError('Trainer profile not found', 404);

  const sessions = coach.sessionCount;

  return {
    estimatedEarnings: sessions * 0,
    sessionCount: sessions,
    currency: 'USD',
    note: 'Earnings tracking requires payment integration',
  };
}
