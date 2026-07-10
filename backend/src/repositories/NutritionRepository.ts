import { prisma } from '../services/database.js';
import { BaseRepository } from './BaseRepository.js';

export interface CreateMealData {
  userId: string;
  name: string;
  time?: string;
  foods: Array<{ foodId: string; quantity: number }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class NutritionRepository extends BaseRepository<any, any, any> {
  constructor() {
    super(prisma.meal, 'meal');
  }

  async getMealsByUserId(userId: string, limit = 30) {
    return prisma.meal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        foods: {
          include: { food: true },
        },
      },
    });
  }

  async createMealWithFoods(userId: string, data: CreateMealData) {
    return prisma.meal.create({
      data: {
        userId,
        name: data.name,
        time: data.time,
        foods: {
          create: data.foods.map((f) => ({
            foodId: f.foodId,
            quantity: f.quantity,
          })),
        },
      },
      include: {
        foods: {
          include: { food: true },
        },
      },
    });
  }

  async getDailyCalories(userId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const meals = await prisma.meal.findMany({
      where: {
        userId,
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
      include: {
        foods: { include: { food: true } },
      },
    });

    return meals.reduce((total, meal) => {
      return total + meal.foods.reduce((sum, f) => sum + f.food.calories * f.quantity, 0);
    }, 0);
  }

  async getNutritionAnalytics(userId: string) {
    const meals = await this.getMealsByUserId(userId, 30);

    const totalCals = meals.reduce((sum, m) =>
      sum + m.foods.reduce((s, f) => s + f.food.calories * f.quantity, 0), 0);

    const totalProtein = meals.reduce((sum, m) =>
      sum + m.foods.reduce((s, f) => s + f.food.protein * f.quantity, 0), 0);

    return {
      dailyCalories: meals.length > 0 ? [{
        date: meals[0].createdAt.toISOString().split('T')[0],
        calories: totalCals,
      }] : [],
      averageCalories: meals.length > 0 ? Math.round(totalCals / meals.length) : 0,
      averageProtein: meals.length > 0 ? Math.round(totalProtein / meals.length) : 0,
      nutritionScore: meals.length > 0 ? Math.min(100, Math.round((totalCals / 2000) * 100)) : 85,
    };
  }
}

export const nutritionRepository = new NutritionRepository();
