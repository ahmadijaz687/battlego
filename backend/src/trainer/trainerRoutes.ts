import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { requireTrainer } from '../middlewares/trainer.js';
import * as ctrl from './trainerController.js';

const router = Router();

router.use(requireAuth, requireTrainer);

// Clients
router.get('/clients', ctrl.listClients);
router.get('/clients/:clientId', ctrl.getClientDetailsHandler);
router.post('/clients', ctrl.addClientHandler);
router.delete('/clients/:clientId', ctrl.removeClientHandler);
router.get('/clients/:clientId/progress', ctrl.getClientProgressHandler);

// Plans
router.get('/plans', ctrl.listPlans);
router.post('/plans', ctrl.createPlanHandler);
router.get('/plans/:planId', ctrl.getPlanDetailsHandler);
router.put('/plans/:planId', ctrl.updatePlanHandler);
router.delete('/plans/:planId', ctrl.deletePlanHandler);
router.post('/plans/:planId/assign', ctrl.assignPlanHandler);
router.get('/clients/:clientId/plans', ctrl.getClientPlansHandler);

// Calendar
router.get('/calendar', ctrl.getCalendarHandler);
router.post('/calendar', ctrl.createCalendarEventHandler);
router.put('/calendar/:eventId', ctrl.updateCalendarEventHandler);
router.delete('/calendar/:eventId', ctrl.deleteCalendarEventHandler);
router.get('/clients/:clientId/calendar', ctrl.getClientCalendarHandler);

// Nutrition
router.get('/clients/:clientId/nutrition', ctrl.getClientNutritionHandler);
router.post('/clients/:clientId/meals', ctrl.addClientMealHandler);
router.get('/clients/:clientId/water', ctrl.getClientWaterHandler);
router.get('/clients/:clientId/weight', ctrl.getClientWeightHandler);

// Messaging
router.get('/messages', ctrl.getConversationsHandler);
router.get('/messages/:conversationId', ctrl.getConversationMessagesHandler);
router.post('/messages/:conversationId', ctrl.sendMessageHandler);
router.post('/messages', ctrl.startConversationHandler);

// Progress
router.get('/clients/:clientId/progress/workouts', ctrl.getWorkoutProgressHandler);
router.get('/clients/:clientId/progress/measurements', ctrl.getMeasurementProgressHandler);
router.get('/clients/:clientId/progress/strength', ctrl.getStrengthProgressHandler);
router.get('/clients/:clientId/progress/nutrition', ctrl.getNutritionAdherenceHandler);
router.get('/clients/:clientId/progress/summary', ctrl.getCompleteProgressSummaryHandler);

// Reports
router.get('/reports/client-summary/:clientId', ctrl.getClientSummaryReportHandler);
router.get('/reports/monthly', ctrl.getMonthlyReportHandler);
router.get('/reports/earnings', ctrl.getEarningsReportHandler);

export default router;
