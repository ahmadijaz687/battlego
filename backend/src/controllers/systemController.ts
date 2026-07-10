import { Request, Response } from 'express';
import { prisma } from '../services/database.js';
import { successResponse } from '../utils/response.js';

export async function getSystemStatusHandler(_req: Request, res: Response) {
  const uptime = process.uptime();
  const memory = process.memoryUsage();

  res.json(successResponse({
    status: 'ok',
    uptime: Math.floor(uptime),
    memory: {
      rss: Math.round(memory.rss / 1024 / 1024),
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
    },
    timestamp: new Date().toISOString(),
  }));
}

export async function healthCheckHandler(_req: Request, res: Response) {
  let database = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    database = 'connected';
  } catch {
    database = 'disconnected';
  }

  res.json(successResponse({
    status: database === 'connected' ? 'healthy' : 'degraded',
    database,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }));
}

export async function getAppVersionHandler(_req: Request, res: Response) {
  const config = await prisma.systemConfig.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  res.json(successResponse({
    version: config?.version ?? '1.0.0',
    apiVersion: config?.apiVersion ?? '1.0',
    minimumSupportedVersion: config?.minimumSupportedVersion ?? '1.0.0',
  }));
}

export async function getSystemConfigHandler(_req: Request, res: Response) {
  const config = await prisma.systemConfig.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  res.json(successResponse(config ?? {
    version: '1.0.0',
    apiVersion: '1.0',
    minimumSupportedVersion: '1.0.0',
    maintenanceMode: false,
    announcement: null,
  }));
}

export async function getFeatureFlagsHandler(_req: Request, res: Response) {
  const features = await prisma.featureFlag.findMany({
    where: { enabled: true },
    select: { feature: true, enabled: true, description: true, minimumVersion: true },
    orderBy: { feature: 'asc' },
  });

  res.json(successResponse(features));
}
