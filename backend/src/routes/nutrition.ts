import { Router } from 'express';
import {
  getFoodsHandler,
  createFoodHandler,
  getMealsHandler,
  createMealHandler,
  updateMealHandler,
  deleteMealHandler,
  getWaterLogsHandler,
  createWaterLogHandler,
  updateWaterLogHandler,
  deleteWaterLogHandler,
  getWeightLogsHandler,
  createWeightLogHandler,
  updateWeightLogHandler,
  deleteWeightLogHandler,
  getMeasurementsHandler,
  createMeasurementHandler,
  updateMeasurementHandler,
  deleteMeasurementHandler,
  getShoppingListHandler,
  createShoppingItemHandler,
  updateShoppingItemHandler,
  deleteShoppingItemHandler,
  getAnalyticsHandler,
} from '../controllers/nutritionController.js';
import { requireAuth } from '../middlewares/auth.js';
import { validate, createFoodSchema, createMealSchema, updateMealSchema, createWaterLogSchema, createWeightLogSchema, createMeasurementSchema, createShoppingItemSchema, updateShoppingItemSchema } from '../middlewares/validation.js';

const router = Router();

router.get('/foods', getFoodsHandler);
router.post('/foods', validate(createFoodSchema), createFoodHandler);

router.get('/meals', requireAuth, getMealsHandler);
router.post('/meals', requireAuth, validate(createMealSchema), createMealHandler);
router.put('/meals/:mealId', requireAuth, validate(updateMealSchema), updateMealHandler);
router.delete('/meals/:mealId', requireAuth, deleteMealHandler);

router.get('/water/logs', requireAuth, getWaterLogsHandler);
router.post('/water/logs', requireAuth, validate(createWaterLogSchema), createWaterLogHandler);
router.put('/water/logs/:logId', requireAuth, updateWaterLogHandler);
router.delete('/water/logs/:logId', requireAuth, deleteWaterLogHandler);

router.get('/weight/logs', requireAuth, getWeightLogsHandler);
router.post('/weight/logs', requireAuth, validate(createWeightLogSchema), createWeightLogHandler);
router.put('/weight/logs/:logId', requireAuth, updateWeightLogHandler);
router.delete('/weight/logs/:logId', requireAuth, deleteWeightLogHandler);

router.get('/measurements', requireAuth, getMeasurementsHandler);
router.post('/measurements', requireAuth, validate(createMeasurementSchema), createMeasurementHandler);
router.put('/measurements/:measurementId', requireAuth, updateMeasurementHandler);
router.delete('/measurements/:measurementId', requireAuth, deleteMeasurementHandler);

router.get('/shopping-list', requireAuth, getShoppingListHandler);
router.post('/shopping-list', requireAuth, validate(createShoppingItemSchema), createShoppingItemHandler);
router.put('/shopping-list/:itemId', requireAuth, validate(updateShoppingItemSchema), updateShoppingItemHandler);
router.delete('/shopping-list/:itemId', requireAuth, deleteShoppingItemHandler);

router.get('/analytics', requireAuth, getAnalyticsHandler);

export default router;
