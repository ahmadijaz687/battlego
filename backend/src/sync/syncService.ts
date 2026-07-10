import { prisma } from '../services/database.js';
import { applyMergeStrategy, ConflictStrategy, deltaSync } from './mergeStrategy.js';

interface SyncChange {
  domain: string;
  action: string;
  entityId: string;
  data: Record<string, unknown>;
  clientTimestamp: string;
}

interface PullResult {
  workouts: Record<string, unknown>[];
  nutrition: Record<string, unknown>[];
  mealFood: Record<string, unknown>[];
  water: Record<string, unknown>[];
  battles: Record<string, unknown>[];
  social: Record<string, unknown>[];
  health: Record<string, unknown>[];
  habits: Record<string, unknown>[];
  profiles: Record<string, unknown>[];
  deletedIds: string[];
}

interface Conflict {
  id: string;
  clientVersion: Record<string, unknown>;
  serverVersion: Record<string, unknown>;
}

interface PushResult {
  accepted: Array<{ id: string; serverVersion: Record<string, unknown> }>;
  conflicts: Conflict[];
  rejected: Array<{ id: string; reason: string }>;
}

const SUPPORTED_DOMAINS = ['workouts', 'nutrition', 'mealFood', 'water', 'battles', 'social', 'health', 'habits', 'profiles'] as const;

interface DomainModel {
  findMany(opts: { where: Record<string, unknown> }): Promise<Record<string, unknown>[]>;
  findUnique(opts: { where: { id: string } }): Promise<Record<string, unknown> | null>;
  create(opts: { data: Record<string, unknown> }): Promise<Record<string, unknown>>;
  update(opts: { where: { id: string }; data: Record<string, unknown> }): Promise<Record<string, unknown>>;
  delete(opts: { where: { id: string } }): Promise<Record<string, unknown>>;
}

interface DomainModelMap {
  model: DomainModel;
  userIdField: string;
  updatedAtField: string;
}

interface DomainDeleteModels {
  model: DomainModel;
  userIdField: string;
}

const domainModelMap: Record<string, DomainModelMap> = {
  workouts: { model: prisma.workout, userIdField: 'userId', updatedAtField: 'updatedAt' },
  nutrition: { model: prisma.meal, userIdField: 'userId', updatedAtField: 'updatedAt' },
  mealFood: { model: prisma.mealFood, userIdField: 'userId', updatedAtField: 'updatedAt' },
  water: { model: prisma.waterLog, userIdField: 'userId', updatedAtField: 'updatedAt' },
  battles: { model: prisma.battle, userIdField: 'creatorId', updatedAtField: 'updatedAt' },
  social: { model: prisma.post, userIdField: 'userId', updatedAtField: 'updatedAt' },
  health: { model: prisma.sleepLog, userIdField: 'userId', updatedAtField: 'updatedAt' },
  habits: { model: prisma.habit, userIdField: 'userId', updatedAtField: 'updatedAt' },
  profiles: { model: prisma.userProfile, userIdField: 'userId', updatedAtField: 'updatedAt' },
};

interface TxModel {
  create: (args: { data: Record<string, unknown> }) => Promise<Record<string, unknown>>;
  update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<Record<string, unknown>>;
  delete: (args: { where: { id: string } }) => Promise<Record<string, unknown>>;
  findUnique: (args: { where: { id: string } }) => Promise<Record<string, unknown> | null>;
}

function getTxModel(tx: Record<string, unknown>, domain: string): TxModel {
  const map: Record<string, TxModel> = {
    workouts: tx.workout as TxModel,
    nutrition: tx.meal as TxModel,
    mealFood: tx.mealFood as TxModel,
    water: tx.waterLog as TxModel,
    battles: tx.battle as TxModel,
    social: tx.post as TxModel,
    health: tx.sleepLog as TxModel,
    habits: tx.habit as TxModel,
    profiles: tx.userProfile as TxModel,
  };
  return map[domain];
}

const _domainDeleteModels: Record<string, DomainDeleteModels> = {
  workouts: { model: prisma.workout, userIdField: 'userId' },
  nutrition: { model: prisma.meal, userIdField: 'userId' },
  mealFood: { model: prisma.mealFood, userIdField: 'userId' },
  water: { model: prisma.waterLog, userIdField: 'userId' },
  battles: { model: prisma.battle, userIdField: 'creatorId' },
  social: { model: prisma.post, userIdField: 'userId' },
  health: { model: prisma.sleepLog, userIdField: 'userId' },
  habits: { model: prisma.habit, userIdField: 'userId' },
  profiles: { model: prisma.userProfile, userIdField: 'userId' },
};

interface _SyncRecord {
  id: string;
  entityId: string;
  domain: string;
  userId: string;
  action: string;
  data: Record<string, unknown>;
  clientTimestamp: string;
  serverTimestamp: Date;
  version: number;
}

async function queryDomainChanges(
  model: { findMany(opts: { where: Record<string, unknown> }): Promise<Record<string, unknown>[]> },
  userIdField: string,
  updatedAtField: string,
  userId: string,
  lastSync: Date
): Promise<Record<string, unknown>[]> {
  try {
    const records = await model.findMany({
      where: {
        [userIdField]: userId,
        [updatedAtField]: { gte: lastSync },
      },
    });
    return records.map((r: Record<string, unknown>) => ({ ...r, id: r.id }));
  } catch {
    return [];
  }
}

async function queryDeletedIds(
  userId: string,
  lastSync: Date
): Promise<string[]> {
  try {
    const records = await prisma.syncRecord.findMany({
      where: {
        userId,
        action: 'delete',
        serverTimestamp: { gte: lastSync },
      },
      select: { entityId: true },
    });
    return records.map(r => r.entityId);
  } catch {
    return [];
  }
}

export async function pullChanges(
  userId: string,
  lastSync: string,
  domains: string[]
): Promise<PullResult> {
  const lastSyncDate = lastSync ? new Date(lastSync) : new Date(0);
  const filteredDomains = domains.filter(d =>
    (SUPPORTED_DOMAINS as readonly string[]).includes(d)
  );
  const domainsToQuery = filteredDomains.length > 0 ? filteredDomains : SUPPORTED_DOMAINS;

  const result: PullResult = {
    workouts: [],
    nutrition: [],
    mealFood: [],
    water: [],
    battles: [],
    social: [],
    health: [],
    habits: [],
    profiles: [],
    deletedIds: [],
  };

  const queries = domainsToQuery.map(async (domain) => {
    const mapping = domainModelMap[domain];
    if (!mapping) return;

    try {
      const changes = await queryDomainChanges(
        mapping.model,
        mapping.userIdField,
        mapping.updatedAtField,
        userId,
        lastSyncDate
      );
      (result as unknown as Record<string, unknown[]>)[domain] = changes;
    } catch {
      // Domain query failed, return empty
    }
  });

  await Promise.all(queries);
  result.deletedIds = await queryDeletedIds(userId, lastSyncDate);

  return result;
}

export async function pushChanges(
  userId: string,
  changes: SyncChange[]
): Promise<PushResult> {
  const accepted: Array<{ id: string; serverVersion: Record<string, unknown> }> = [];
  const conflicts: Conflict[] = [];
  const rejected: Array<{ id: string; reason: string }> = [];

  for (const change of changes) {
    const mapping = domainModelMap[change.domain];

    if (!mapping) {
      rejected.push({ id: change.entityId, reason: `Unknown domain: ${change.domain}` });
      continue;
    }

    try {
      const existing = await mapping.model.findUnique({
        where: { id: change.entityId },
      });

      if (change.action === 'delete') {
        if (existing) {
          await prisma.$transaction(async (tx) => {
            const txModel = getTxModel(tx, change.domain);
            await txModel.delete({ where: { id: change.entityId } });
            await recordSyncAction(userId, change.entityId, change.domain, 'delete', change.data, tx);
          });
        }
        accepted.push({ id: change.entityId, serverVersion: {} });
        continue;
      }

      if (!existing) {
        const created = await prisma.$transaction(async (tx) => {
          const txModel = getTxModel(tx, change.domain);
          const record = await txModel.create({
            data: {
              id: change.entityId,
              [mapping.userIdField]: userId,
              ...change.data,
              createdAt: new Date(change.clientTimestamp),
              updatedAt: new Date(),
            },
          });
          await recordSyncAction(userId, change.entityId, change.domain, change.action, change.data, tx);
          return record;
        });
        accepted.push({ id: change.entityId, serverVersion: created as Record<string, unknown> });
        continue;
      }

      const existingUpdated = existing[mapping.updatedAtField as string]
        ? new Date(existing[mapping.updatedAtField as string] as string | number | Date).getTime()
        : 0;
      const clientUpdated = change.clientTimestamp
        ? new Date(change.clientTimestamp).getTime()
        : 0;
      const timeDiff = Math.abs(existingUpdated - clientUpdated);

      if (timeDiff > 5000) {
        const detectedConflicts = detectConflicts(
          existing as Record<string, unknown>,
          change.data
        );

        if (detectedConflicts.length > 0) {
          conflicts.push({
            id: change.entityId,
            clientVersion: change.data,
            serverVersion: existing as Record<string, unknown>,
          });
          continue;
        }
      }

      const updated = await prisma.$transaction(async (tx) => {
        const txModel = getTxModel(tx, change.domain);
        const record = await txModel.update({
          where: { id: change.entityId },
          data: {
            ...change.data,
            [mapping.updatedAtField]: new Date(),
          },
        });
        await recordSyncAction(userId, change.entityId, change.domain, change.action, change.data, tx);
        return record;
      });

      accepted.push({ id: change.entityId, serverVersion: updated as Record<string, unknown> });

    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('P2002')) {
        rejected.push({ id: change.entityId, reason: 'Duplicate entry' });
      } else {
        const message = error instanceof Error ? error.message : 'Unknown error';
        rejected.push({ id: change.entityId, reason: message });
      }
    }
  }

  return { accepted, conflicts, rejected };
}

export function detectConflicts(
  serverData: Record<string, unknown>,
  clientData: Record<string, unknown>
): string[] {
  const conflicts: string[] = [];
  const conflictFields = ['updatedAt', 'version', 'status', 'score'];

  for (const field of conflictFields) {
    const sv = serverData[field];
    const cv = clientData[field];

    if (sv !== undefined && cv !== undefined && sv !== null && cv !== null) {
      const svTime = typeof sv === 'string' || typeof sv === 'number' ? new Date(sv).getTime() : NaN;
      const cvTime = typeof cv === 'string' || typeof cv === 'number' ? new Date(cv).getTime() : NaN;

      if (!isNaN(svTime) && !isNaN(cvTime) && Math.abs(svTime - cvTime) > 5000) {
        conflicts.push(field);
      } else if (sv !== cv && (isNaN(svTime) || isNaN(cvTime))) {
        conflicts.push(field);
      }
    }
  }

  return conflicts;
}

export async function resolveConflict(
  entityId: string,
  strategy: ConflictStrategy,
  mergedData?: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const syncRecord = await prisma.syncRecord.findFirst({
    where: { entityId, action: { not: 'delete' } },
    orderBy: { serverTimestamp: 'desc' },
  });

  if (!syncRecord) {
    throw new Error(`No sync record found for entity ${entityId}`);
  }

  const mapping = domainModelMap[syncRecord.domain];
  if (!mapping) {
    throw new Error(`Unknown domain: ${syncRecord.domain}`);
  }

  const serverData = await mapping.model.findUnique({ where: { id: entityId } });
  if (!serverData) {
    throw new Error(`Entity ${entityId} not found`);
  }

  let result: Record<string, unknown>;

  switch (strategy) {
    case 'client_wins':
      result = {
        ...serverData,
        ...syncRecord.data as Record<string, unknown>,
        [mapping.updatedAtField]: new Date(),
      };
      break;

    case 'server_wins':
      result = serverData as Record<string, unknown>;
      break;

    case 'merge':
      if (mergedData) {
        result = {
          ...serverData,
          ...mergedData,
          [mapping.updatedAtField]: new Date(),
        };
      } else {
        result = applyMergeStrategy(
          syncRecord.domain,
          serverData as Record<string, unknown>,
          syncRecord.data as Record<string, unknown>
        );
      }
      break;

    case 'manual':
    default:
      throw new Error('Manual resolution requires mergedData');
  }

  await mapping.model.update({
    where: { id: entityId },
    data: result,
  });

  return result;
}

export async function genericSync(userId: string, payload: {
  domain: string;
  action: 'create' | 'update' | 'delete';
  entityId?: string;
  data: Record<string, unknown>;
  clientTimestamp: string;
}) {
  const mapping = domainModelMap[payload.domain];
  if (!mapping) throw new Error(`Unknown domain: ${payload.domain}`);

  switch (payload.action) {
    case 'create': {
      return prisma.$transaction(async (tx) => {
        const txModel = getTxModel(tx, payload.domain);
        const created = await txModel.create({
          data: {
            [mapping.userIdField]: userId,
            ...payload.data,
            createdAt: new Date(payload.clientTimestamp),
            updatedAt: new Date(),
          },
        });
        await recordSyncAction(userId, (created as Record<string, unknown>).id as string, payload.domain, 'create', payload.data, tx);
        return created;
      });
    }
    case 'update': {
      const entityId = payload.entityId;
      if (!entityId) throw new Error('entityId required for update');
      return prisma.$transaction(async (tx) => {
        const txModel = getTxModel(tx, payload.domain);
        const updated = await txModel.update({
          where: { id: entityId },
          data: { ...payload.data, [mapping.updatedAtField]: new Date() },
        });
        await recordSyncAction(userId, entityId, payload.domain, 'update', payload.data, tx);
        return updated;
      });
    }
    case 'delete': {
      const entityId = payload.entityId;
      if (!entityId) throw new Error('entityId required for delete');
      return prisma.$transaction(async (tx) => {
        const txModel = getTxModel(tx, payload.domain);
        await txModel.delete({ where: { id: entityId } });
        await recordSyncAction(userId, entityId, payload.domain, 'delete', payload.data, tx);
        return { deleted: true };
      });
    }
    default:
      throw new Error(`Unsupported action: ${payload.action}`);
  }
}

export async function computeDeltaSync<T extends Record<string, unknown>>(
  serverData: T[],
  clientData: T[],
  idKey: keyof T = 'id' as keyof T
): Promise<{ created: T[]; updated: T[]; deletedIds: string[] }> {
  const result = deltaSync(serverData, clientData, idKey as string);
  return {
    created: result.created as T[],
    updated: result.updated as T[],
    deletedIds: result.deleted as string[],
  };
}

type SyncRecordClient = {
  syncRecord: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create: (args: any) => Promise<unknown>;
  };
};

async function recordSyncAction(
  userId: string,
  entityId: string,
  domain: string,
  action: string,
  data: Record<string, unknown>,
  tx?: SyncRecordClient
): Promise<void> {
  try {
    const client = (tx || prisma) as SyncRecordClient;
    await client.syncRecord.create({
      data: {
        userId,
        entityId,
        domain,
        action,
        data: data as never,
        clientTimestamp: (data.clientTimestamp as string) || new Date().toISOString(),
        serverTimestamp: new Date(),
        version: 1,
      },
    });
  } catch {
    // Log failure but don't block sync
  }
}
