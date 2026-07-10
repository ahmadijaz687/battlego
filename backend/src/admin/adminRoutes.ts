import { Router } from 'express';
import { requireAdmin } from '../middlewares/admin.js';
import {
  getDashboardHandler,
  getAnalyticsHandler,
  getReportsHandler,
  reviewReportHandler,
  dismissReportHandler,
  actionReportHandler,
  getFlaggedContentHandler,
  getUsersHandler,
  getUserDetailsHandler,
  updateUserHandler,
  deleteUserHandler,
  suspendUserHandler,
  getUserActivityHandler,
  getPaymentsHandler,
  getRevenueHandler,
  issueRefundHandler,
  getSubscriptionsHandler,
  getSubscriptionPlansHandler,
  createSubscriptionPlanHandler,
  updateSubscriptionPlanHandler,
  deleteSubscriptionPlanHandler,
  getFeatureFlagsHandler,
  createFeatureFlagHandler,
  updateFeatureFlagHandler,
  deleteFeatureFlagHandler,
  getLogsHandler,
  getErrorLogsHandler,
  clearLogsHandler,
  getAIUsageHandler,
  getAIPromptsHandler,
  clearAIContextHandler,
} from './adminController.js';

const router = Router();

router.use(requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardHandler);

// Analytics
router.get('/analytics', getAnalyticsHandler);

// Moderation
router.get('/moderation/reports', getReportsHandler);
router.put('/moderation/reports/:id/review', reviewReportHandler);
router.delete('/moderation/reports/:id', dismissReportHandler);
router.post('/moderation/reports/:id/action', actionReportHandler);
router.get('/moderation/flagged-content', getFlaggedContentHandler);

// Users
router.get('/users', getUsersHandler);
router.get('/users/:id', getUserDetailsHandler);
router.put('/users/:id', updateUserHandler);
router.delete('/users/:id', deleteUserHandler);
router.post('/users/:id/suspend', suspendUserHandler);
router.get('/users/:id/activity', getUserActivityHandler);

// Payments
router.get('/payments', getPaymentsHandler);
router.get('/payments/revenue', getRevenueHandler);
router.post('/payments/refund/:transactionId', issueRefundHandler);

// Subscriptions
router.get('/subscriptions', getSubscriptionsHandler);
router.get('/subscriptions/plans', getSubscriptionPlansHandler);
router.post('/subscriptions/plans', createSubscriptionPlanHandler);
router.put('/subscriptions/plans/:id', updateSubscriptionPlanHandler);
router.delete('/subscriptions/plans/:id', deleteSubscriptionPlanHandler);

// Feature Flags
router.get('/feature-flags', getFeatureFlagsHandler);
router.post('/feature-flags', createFeatureFlagHandler);
router.put('/feature-flags/:id', updateFeatureFlagHandler);
router.delete('/feature-flags/:id', deleteFeatureFlagHandler);

// Logs
router.get('/logs', getLogsHandler);
router.get('/logs/errors', getErrorLogsHandler);
router.delete('/logs', clearLogsHandler);

// AI
router.get('/ai/usage', getAIUsageHandler);
router.get('/ai/prompts', getAIPromptsHandler);
router.post('/ai/clear-context', clearAIContextHandler);

export { router as adminRoutes };
