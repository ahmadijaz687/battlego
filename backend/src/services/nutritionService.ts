import { prisma } from '../services/database.js';
import { nutritionRepository } from '../repositories/index.js';

export async function getFoods() {
  return prisma.food.findMany({ orderBy: { name: 'asc' } });
}

export async function createFood(data: {
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: string;
  barcode?: string;
}) {
  return prisma.food.create({ data: data as never });
}

export async function getMeals(userId: string) {
  return nutritionRepository.getMealsByUserId(userId);
}

export async function createMeal(userId: string, data: {
  name: string;
  time?: string;
  foods?: Array<{ foodId: string; quantity: number }>;
}) {
  return nutritionRepository.createMealWithFoods(userId, {
    userId,
    name: data.name,
    time: data.time,
    foods: data.foods || [],
  });
}

export async function getWaterLogs(userId: string) {
  return prisma.waterLog.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });
}

export async function createWaterLog(userId: string, data: { amount: number }) {
  return prisma.waterLog.create({
    data: { userId, amount: data.amount, date: new Date() },
  });
}

export async function getWeightLogs(userId: string) {
  return prisma.weightLog.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });
}

export async function createWeightLog(userId: string, data: { date: string; weight: number; unit?: string }) {
  return prisma.weightLog.create({ data: { userId, ...data } as never });
}

export async function getMeasurements(userId: string) {
  return prisma.bodyMeasurement.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });
}

export async function createMeasurement(userId: string, data: {
  date: string;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulders?: number;
  arms?: number;
  forearms?: number;
  thighs?: number;
  calves?: number;
  neck?: number;
  bodyFat?: number;
}) {
  return prisma.bodyMeasurement.create({ data: { userId, ...data } });
}

export async function getShoppingList(userId: string) {
  return prisma.shoppingListItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createShoppingItem(userId: string, data: {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}) {
  return prisma.shoppingListItem.create({
    data: { userId, ...data, completed: false },
  });
}

export async function updateMeal(mealId: string, userId: string, data: Record<string, unknown>) {
  return prisma.$transaction(async (tx) => {
    const meal = await tx.meal.findUnique({ where: { id: mealId } });
    if (!meal || meal.userId !== userId) throw new Error('Meal not found');
    return tx.meal.update({ where: { id: mealId }, data });
  });
}

export async function deleteMeal(mealId: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const meal = await tx.meal.findUnique({ where: { id: mealId } });
    if (!meal || meal.userId !== userId) throw new Error('Meal not found');
    await tx.meal.delete({ where: { id: mealId } });
    return { deleted: true };
  });
}

export async function updateWaterLog(id: string, userId: string, data: Record<string, unknown>) {
  return prisma.$transaction(async (tx) => {
    const log = await tx.waterLog.findUnique({ where: { id } });
    if (!log || log.userId !== userId) throw new Error('Water log not found');
    return tx.waterLog.update({ where: { id }, data });
  });
}

export async function deleteWaterLog(id: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const log = await tx.waterLog.findUnique({ where: { id } });
    if (!log || log.userId !== userId) throw new Error('Water log not found');
    await tx.waterLog.delete({ where: { id } });
    return { deleted: true };
  });
}

export async function updateWeightLog(id: string, userId: string, data: Record<string, unknown>) {
  return prisma.$transaction(async (tx) => {
    const log = await tx.weightLog.findUnique({ where: { id } });
    if (!log || log.userId !== userId) throw new Error('Weight log not found');
    return tx.weightLog.update({ where: { id }, data });
  });
}

export async function deleteWeightLog(id: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const log = await tx.weightLog.findUnique({ where: { id } });
    if (!log || log.userId !== userId) throw new Error('Weight log not found');
    await tx.weightLog.delete({ where: { id } });
    return { deleted: true };
  });
}

export async function updateMeasurement(id: string, userId: string, data: Record<string, unknown>) {
  return prisma.$transaction(async (tx) => {
    const m = await tx.bodyMeasurement.findUnique({ where: { id } });
    if (!m || m.userId !== userId) throw new Error('Measurement not found');
    return tx.bodyMeasurement.update({ where: { id }, data });
  });
}

export async function deleteMeasurement(id: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const m = await tx.bodyMeasurement.findUnique({ where: { id } });
    if (!m || m.userId !== userId) throw new Error('Measurement not found');
    await tx.bodyMeasurement.delete({ where: { id } });
    return { deleted: true };
  });
}

export async function updateShoppingItem(id: string, userId: string, data: Record<string, unknown>) {
  return prisma.$transaction(async (tx) => {
    const item = await tx.shoppingListItem.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new Error('Shopping item not found');
    return tx.shoppingListItem.update({ where: { id }, data });
  });
}

export async function deleteShoppingItem(id: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const item = await tx.shoppingListItem.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new Error('Shopping item not found');
    await tx.shoppingListItem.delete({ where: { id } });
    return { deleted: true };
  });
}

export async function getAnalytics(userId: string) {
  return nutritionRepository.getNutritionAnalytics(userId);
}
