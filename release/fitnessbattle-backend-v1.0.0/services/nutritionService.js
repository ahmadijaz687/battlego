/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../services/database.js';
export async function getFoods() {
    return prisma.food.findMany({ orderBy: { name: 'asc' } });
}
export async function createFood(data) {
    return prisma.food.create({
        data: {
            name: data.name,
            brand: data.brand,
            calories: data.calories,
            protein: data.protein,
            carbs: data.carbs,
            fat: data.fat,
            servingSize: data.servingSize,
            barcode: data.barcode,
        },
    });
}
export async function getMeals(userId) {
    return prisma.meal.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}
export async function createMeal(userId, data) {
    return prisma.meal.create({
        data: {
            userId,
            name: data.name,
            time: data.time,
            foods: {
                create: (data.foods || []).map((food) => ({
                    foodId: food.foodId,
                    quantity: food.quantity,
                })),
            },
        },
    });
}
export async function getWaterLogs(userId) {
    return prisma.waterLog.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
    });
}
export async function createWaterLog(userId, data) {
    return prisma.waterLog.create({
        data: {
            userId,
            amount: data.amount,
            date: new Date(),
        },
    });
}
export async function getWeightLogs(userId) {
    return prisma.weightLog.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
    });
}
export async function createWeightLog(userId, data) {
    return prisma.weightLog.create({
        data: {
            userId,
            date: data.date,
            weight: data.weight,
            unit: data.unit,
        },
    });
}
export async function getMeasurements(userId) {
    return prisma.bodyMeasurement.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
    });
}
export async function createMeasurement(userId, data) {
    return prisma.bodyMeasurement.create({
        data: {
            userId,
            date: data.date,
            chest: data.chest,
            waist: data.waist,
            hips: data.hips,
            shoulders: data.shoulders,
            arms: data.arms,
            forearms: data.forearms,
            thighs: data.thighs,
            calves: data.calves,
            neck: data.neck,
            bodyFat: data.bodyFat,
        },
    });
}
export async function getShoppingList(userId) {
    return prisma.shoppingListItem.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}
export async function createShoppingItem(userId, data) {
    return prisma.shoppingListItem.create({
        data: {
            userId,
            name: data.name,
            quantity: data.quantity,
            unit: data.unit,
            category: data.category,
            completed: false,
        },
    });
}
export async function getAnalytics() {
    return {
        dailyCalories: [],
        weeklyCalories: [],
        monthlyCalories: [],
        proteinTrend: [],
        carbsTrend: [],
        fatTrend: [],
        waterTrend: [],
        nutritionScore: 85,
        goalCompletion: 75,
    };
}
