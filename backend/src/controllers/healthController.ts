import { Request, Response } from 'express';
import * as healthService from '../services/healthService.js';
import { successResponse } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

export async function getSleepLogsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
  const logs = await healthService.getSleepLogs(userId, days);
  res.json(successResponse(logs));
}

export async function logSleepHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const log = await healthService.logSleep(userId, req.body);
  res.json(successResponse(log, 'Sleep logged'));
}

export async function getHRVLogsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
  const logs = await healthService.getHRVLogs(userId, days);
  res.json(successResponse(logs));
}

export async function logHRVHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const log = await healthService.logHRV(userId, req.body);
  res.json(successResponse(log, 'HRV logged'));
}

export async function getMoodLogsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
  const logs = await healthService.getMoodLogs(userId, days);
  res.json(successResponse(logs));
}

export async function logMoodHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const log = await healthService.logMood(userId, req.body);
  res.json(successResponse(log, 'Mood logged'));
}

export async function getReadinessHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const readiness = await healthService.getReadiness(userId);
  res.json(successResponse(readiness));
}

export async function getHealthSummaryHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;
  const summary = await healthService.getHealthSummary(userId, days);
  res.json(successResponse(summary));
}

export async function syncHealthDataHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const result = await healthService.syncHealthData(userId, req.body.readings);
  res.status(201).json(successResponse(result, 'Health data synced'));
}

export async function getHealthDataSummaryHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;
  const summary = await healthService.getHealthDataSummary(userId, days);
  res.json(successResponse(summary));
}
