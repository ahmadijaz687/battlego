import { getFoods, createFood, getMeals, createMeal, getWaterLogs, createWaterLog, getWeightLogs, createWeightLog, getMeasurements, createMeasurement, getShoppingList, createShoppingItem, getAnalytics, } from '../services/nutritionService.js';
export const getFoodsHandler = async (_req, res) => {
    try {
        const foods = await getFoods();
        res.json(foods);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch foods' });
    }
};
export const createFoodHandler = async (req, res) => {
    try {
        const food = await createFood(req.body);
        res.status(201).json(food);
    }
    catch {
        res.status(500).json({ error: 'Failed to create food' });
    }
};
export const getMealsHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const meals = await getMeals(userId);
        res.json(meals);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch meals' });
    }
};
export const createMealHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const meal = await createMeal(userId, req.body);
        res.status(201).json(meal);
    }
    catch {
        res.status(500).json({ error: 'Failed to create meal' });
    }
};
export const getWaterLogsHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const logs = await getWaterLogs(userId);
        res.json(logs);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch water logs' });
    }
};
export const createWaterLogHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const log = await createWaterLog(userId, req.body);
        res.status(201).json(log);
    }
    catch {
        res.status(500).json({ error: 'Failed to log water intake' });
    }
};
export const getWeightLogsHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const logs = await getWeightLogs(userId);
        res.json(logs);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch weight logs' });
    }
};
export const createWeightLogHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const log = await createWeightLog(userId, req.body);
        res.status(201).json(log);
    }
    catch {
        res.status(500).json({ error: 'Failed to log weight' });
    }
};
export const getMeasurementsHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const measurements = await getMeasurements(userId);
        res.json(measurements);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch measurements' });
    }
};
export const createMeasurementHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const measurement = await createMeasurement(userId, req.body);
        res.status(201).json(measurement);
    }
    catch {
        res.status(500).json({ error: 'Failed to log measurements' });
    }
};
export const getShoppingListHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const items = await getShoppingList(userId);
        res.json(items);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch shopping list' });
    }
};
export const createShoppingItemHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const item = await createShoppingItem(userId, req.body);
        res.status(201).json(item);
    }
    catch {
        res.status(500).json({ error: 'Failed to add shopping item' });
    }
};
export const getAnalyticsHandler = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const analytics = await getAnalytics();
        res.json(analytics);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};
