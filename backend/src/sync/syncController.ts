import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { successResponse, errorResponse } from '../utils/response.js';
import {
  pullChanges,
  pushChanges,
  resolveConflict,
  genericSync,
} from './syncService.js';

export async function pullHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json(errorResponse('Unauthorized'));
      return;
    }

    const { lastSync, domains } = req.body as {
      lastSync?: string;
      domains?: string[];
    };

    const result = await pullChanges(userId, lastSync || '', domains || []);
    res.json(successResponse(result));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync pull failed';
    res.status(500).json(errorResponse(message));
  }
}

export async function pushHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json(errorResponse('Unauthorized'));
      return;
    }

    const { changes } = req.body as {
      changes: Array<{
        domain: string;
        action: string;
        entityId: string;
        data: Record<string, unknown>;
        clientTimestamp: string;
      }>;
    };

    if (!changes || !Array.isArray(changes)) {
      res.status(400).json(errorResponse('Invalid changes payload'));
      return;
    }

    const result = await pushChanges(userId, changes);
    res.json(successResponse(result));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync push failed';
    res.status(500).json(errorResponse(message));
  }
}

export async function genericSyncHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json(errorResponse('Unauthorized'));
      return;
    }

    const { domain, action, entityId, data, clientTimestamp } = req.body as {
      domain: string;
      action: 'create' | 'update' | 'delete';
      entityId?: string;
      data: Record<string, unknown>;
      clientTimestamp: string;
    };

    if (!domain || !action) {
      res.status(400).json(errorResponse('domain and action are required'));
      return;
    }

    const result = await genericSync(userId, { domain, action, entityId, data, clientTimestamp });
    res.json(successResponse(result, `${domain} ${action}d`));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync failed';
    res.status(500).json(errorResponse(message));
  }
}

export async function resolveHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json(errorResponse('Unauthorized'));
      return;
    }

    const { resolutions } = req.body as {
      resolutions: Array<{
        entityId: string;
        strategy: 'client_wins' | 'server_wins' | 'merge';
        mergedData?: Record<string, unknown>;
      }>;
    };

    if (!resolutions || !Array.isArray(resolutions)) {
      res.status(400).json(errorResponse('Invalid resolutions payload'));
      return;
    }

    const results = await Promise.allSettled(
      resolutions.map(async (resolution) => {
        const resolved = await resolveConflict(
          resolution.entityId,
          resolution.strategy,
          resolution.mergedData
        );
        return { entityId: resolution.entityId, strategy: resolution.strategy, data: resolved };
      })
    );

    const resolved = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r.status === 'fulfilled' ? (r as PromiseFulfilledResult<Record<string, unknown>>).value : null))
      .filter((r): r is Record<string, unknown> => r !== null);

    const failed = results
      .filter((r) => r.status === 'rejected')
      .map((r) => ({
        entityId: (r as PromiseRejectedResult).reason?.message || 'Unknown error',
        reason: (r as PromiseRejectedResult).reason?.message || 'Resolution failed',
      }));

    res.json(successResponse({ resolved, failed }));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Conflict resolution failed';
    res.status(500).json(errorResponse(message));
  }
}
