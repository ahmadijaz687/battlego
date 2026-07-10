import { Request, Response } from 'express';
import * as adminService from './adminService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

const getParam = (req: Request, name: string): string =>
  (Array.isArray(req.params[name]) ? req.params[name][0] : req.params[name]) as string;

const parsePagination = (req: Request) => ({
  page: Math.max(1, parseInt(req.query.page as string, 10) || 1),
  limit: Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20)),
});

// Dashboard
export async function getDashboardHandler(_req: Request, res: Response) {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(successResponse(stats));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch dashboard stats'));
  }
}

// Analytics
export async function getAnalyticsHandler(_req: Request, res: Response) {
  try {
    const analytics = await adminService.getAnalytics();
    res.json(successResponse(analytics));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch analytics'));
  }
}

// Moderation - Reports
export async function getReportsHandler(req: Request, res: Response) {
  try {
    const { page, limit } = parsePagination(req);
    const status = req.query.status as string | undefined;
    const result = await adminService.getReports(page, limit, status);
    res.json(paginatedResponse(result.reports, result.total, result.page, result.limit));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch reports'));
  }
}

export async function reviewReportHandler(req: Request, res: Response) {
  try {
    const report = await adminService.reviewReport(getParam(req, 'id'));
    res.json(successResponse(report, 'Report reviewed'));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to review report';
    res.status(404).json(errorResponse(message));
  }
}

export async function dismissReportHandler(req: Request, res: Response) {
  try {
    const report = await adminService.dismissReport(getParam(req, 'id'));
    res.json(successResponse(report, 'Report dismissed'));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to dismiss report';
    res.status(404).json(errorResponse(message));
  }
}

export async function actionReportHandler(req: Request, res: Response) {
  try {
    const { action } = req.body;
    if (!action) {
      res.status(400).json(errorResponse('Action is required'));
      return;
    }
    const report = await adminService.actionReport(getParam(req, 'id'), action);
    res.json(successResponse(report, `Report ${action} executed`));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to action report';
    res.status(404).json(errorResponse(message));
  }
}

export async function getFlaggedContentHandler(req: Request, res: Response) {
  try {
    const { page, limit } = parsePagination(req);
    const result = await adminService.getFlaggedContent(page, limit);
    res.json(paginatedResponse(result.flaggedContent, result.total, result.page, result.limit));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch flagged content'));
  }
}

export async function getUsersHandler(req: Request, res: Response) {
  try {
    const { page, limit } = parsePagination(req);
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;
    const plan = req.query.plan as string | undefined;
    const dateFrom = req.query.dateFrom as string | undefined;
    const dateTo = req.query.dateTo as string | undefined;
    const result = await adminService.getUsers(page, limit, search, status, plan, dateFrom, dateTo);
    res.json(paginatedResponse(result.users, result.total, result.page, result.limit));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch users'));
  }
}

export async function getUserDetailsHandler(req: Request, res: Response) {
  try {
    const user = await adminService.getUserDetails(getParam(req, 'id'));
    res.json(successResponse(user));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch user';
    res.status(404).json(errorResponse(message));
  }
}

export async function updateUserHandler(req: Request, res: Response) {
  try {
    const user = await adminService.updateUser(getParam(req, 'id'), req.body);
    res.json(successResponse(user, 'User updated'));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update user';
    res.status(404).json(errorResponse(message));
  }
}

export async function deleteUserHandler(req: Request, res: Response) {
  try {
    const result = await adminService.deleteUser(getParam(req, 'id'));
    res.json(successResponse(result, 'User deleted'));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete user';
    res.status(404).json(errorResponse(message));
  }
}

export async function suspendUserHandler(req: Request, res: Response) {
  try {
    const result = await adminService.suspendUser(getParam(req, 'id'));
    res.json(successResponse(result, 'User suspended'));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to suspend user';
    res.status(404).json(errorResponse(message));
  }
}

export async function getUserActivityHandler(req: Request, res: Response) {
  try {
    const { page, limit } = parsePagination(req);
    const result = await adminService.getUserActivity(getParam(req, 'id'), page, limit);
    res.json(successResponse(result));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch user activity';
    res.status(404).json(errorResponse(message));
  }
}

export async function getPaymentsHandler(req: Request, res: Response) {
  try {
    const { page, limit } = parsePagination(req);
    const status = req.query.status as string | undefined;
    const result = await adminService.getPayments(page, limit, status);
    res.json(paginatedResponse(result.transactions, result.total, result.page, result.limit));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch payments'));
  }
}

export async function getRevenueHandler(req: Request, res: Response) {
  try {
    const interval = (req.query.interval as 'daily' | 'monthly' | 'yearly') || 'monthly';
    const report = await adminService.getRevenueReport(interval);
    res.json(successResponse(report));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch revenue report'));
  }
}

export async function issueRefundHandler(req: Request, res: Response) {
  try {
    const result = await adminService.issueRefund(getParam(req, 'transactionId'));
    res.json(successResponse(result, 'Refund issued'));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to issue refund';
    res.status(404).json(errorResponse(message));
  }
}

export async function getSubscriptionsHandler(req: Request, res: Response) {
  try {
    const { page, limit } = parsePagination(req);
    const status = req.query.status as string | undefined;
    const result = await adminService.getSubscriptions(page, limit, status);
    res.json(paginatedResponse(result.subscriptions, result.total, result.page, result.limit));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch subscriptions'));
  }
}

export async function getSubscriptionPlansHandler(_req: Request, res: Response) {
  try {
    const plans = await adminService.getSubscriptionPlans();
    res.json(successResponse(plans));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch subscription plans'));
  }
}

export async function createSubscriptionPlanHandler(req: Request, res: Response) {
  try {
    const plan = await adminService.createSubscriptionPlan(req.body);
    res.json(successResponse(plan, 'Subscription plan created'));
  } catch {
    res.status(500).json(errorResponse('Failed to create subscription plan'));
  }
}

export async function updateSubscriptionPlanHandler(req: Request, res: Response) {
  try {
    const plan = await adminService.updateSubscriptionPlan(getParam(req, 'id'), req.body);
    res.json(successResponse(plan, 'Subscription plan updated'));
  } catch {
    res.status(500).json(errorResponse('Failed to update subscription plan'));
  }
}

export async function deleteSubscriptionPlanHandler(req: Request, res: Response) {
  try {
    const plan = await adminService.deleteSubscriptionPlan(getParam(req, 'id'));
    res.json(successResponse(plan, 'Subscription plan deleted'));
  } catch {
    res.status(500).json(errorResponse('Failed to delete subscription plan'));
  }
}

export async function getFeatureFlagsHandler(_req: Request, res: Response) {
  try {
    const flags = await adminService.getFeatureFlags();
    res.json(successResponse(flags));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch feature flags'));
  }
}

export async function createFeatureFlagHandler(req: Request, res: Response) {
  try {
    const { name, key, enabled, description, rules } = req.body;
    if (!name || !key) {
      res.status(400).json(errorResponse('Name and key are required'));
      return;
    }
    const flag = await adminService.createFeatureFlag({ name, key, enabled, description, rules });
    res.json(successResponse(flag, 'Feature flag created'));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create feature flag';
    res.status(400).json(errorResponse(message));
  }
}

export async function updateFeatureFlagHandler(req: Request, res: Response) {
  try {
    const flag = await adminService.updateFeatureFlag(getParam(req, 'id'), req.body);
    res.json(successResponse(flag, 'Feature flag updated'));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update feature flag';
    res.status(404).json(errorResponse(message));
  }
}

export async function deleteFeatureFlagHandler(req: Request, res: Response) {
  try {
    await adminService.deleteFeatureFlag(getParam(req, 'id'));
    res.json(successResponse(null, 'Feature flag deleted'));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete feature flag';
    res.status(404).json(errorResponse(message));
  }
}

export async function getLogsHandler(req: Request, res: Response) {
  try {
    const { page, limit } = parsePagination(req);
    const level = req.query.level as string | undefined;
    const source = req.query.source as string | undefined;
    const dateFrom = req.query.dateFrom as string | undefined;
    const dateTo = req.query.dateTo as string | undefined;
    const result = await adminService.getLogs(page, limit, level, source, dateFrom, dateTo);
    res.json(paginatedResponse(result.logs, result.total, result.page, result.limit));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch logs'));
  }
}

export async function getErrorLogsHandler(req: Request, res: Response) {
  try {
    const { page, limit } = parsePagination(req);
    const result = await adminService.getErrorLogs(page, limit);
    res.json(paginatedResponse(result.logs, result.total, result.page, result.limit));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch error logs'));
  }
}

export async function clearLogsHandler(_req: Request, res: Response) {
  try {
    const result = await adminService.clearLogs();
    res.json(successResponse(result, 'Logs cleared'));
  } catch {
    res.status(500).json(errorResponse('Failed to clear logs'));
  }
}

export async function getAIUsageHandler(req: Request, res: Response) {
  try {
    const days = parseInt(req.query.days as string, 10) || 30;
    const usage = await adminService.getAIUsage(days);
    res.json(successResponse(usage));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch AI usage'));
  }
}

export async function getAIPromptsHandler(req: Request, res: Response) {
  try {
    const { page, limit } = parsePagination(req);
    const result = await adminService.getAIPrompts(page, limit);
    res.json(paginatedResponse(result.prompts, result.total, result.page, result.limit));
  } catch {
    res.status(500).json(errorResponse('Failed to fetch AI prompts'));
  }
}

export async function clearAIContextHandler(_req: Request, res: Response) {
  try {
    const result = await adminService.clearAIContext();
    res.json(successResponse(result, 'AI context cache cleared'));
  } catch {
    res.status(500).json(errorResponse('Failed to clear AI context'));
  }
}
