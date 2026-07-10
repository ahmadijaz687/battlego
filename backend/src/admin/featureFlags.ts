import { prisma as _prisma } from '../services/database.js';

export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  enabled: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  rules?: Record<string, unknown>;
}

const defaultFlags: Record<string, boolean> = {
  'ai-coach': true,
  'battles': true,
  'premium': true,
  'social-features': true,
  'workout-sharing': true,
  'nutrition-planning': true,
  'leaderboards': true,
  'trainer-marketplace': true,
  'community-stories': true,
  'advanced-analytics': false,
  'offline-mode': true,
  'video-workouts': false,
};

const memoryFlags = new Map<string, { name: string; key: string; enabled: boolean; description: string; createdAt: Date; updatedAt: Date; rules?: Record<string, unknown> }>();

for (const [key, enabled] of Object.entries(defaultFlags)) {
  const name = key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  memoryFlags.set(key, { name, key, enabled, description: '', createdAt: new Date(), updatedAt: new Date() });
}

export async function isFeatureEnabled(key: string): Promise<boolean> {
  if (memoryFlags.has(key)) return memoryFlags.get(key)!.enabled;
  return defaultFlags[key] ?? false;
}

export async function getAllFlags(): Promise<FeatureFlag[]> {
  return Array.from(memoryFlags.entries()).map(([id, f]) => ({
    id,
    ...f,
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export async function setFlag(key: string, enabled: boolean): Promise<void> {
  if (memoryFlags.has(key)) {
    const f = memoryFlags.get(key)!;
    f.enabled = enabled;
    f.updatedAt = new Date();
  } else {
    const name = key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    memoryFlags.set(key, { name, key, enabled, description: '', createdAt: new Date(), updatedAt: new Date() });
  }
}

export async function createFlag(data: {
  name: string;
  key: string;
  enabled: boolean;
  description?: string;
  rules?: Record<string, unknown>;
}): Promise<FeatureFlag> {
  const now = new Date();
  memoryFlags.set(data.key, {
    name: data.name,
    key: data.key,
    enabled: data.enabled,
    description: data.description || '',
    createdAt: now,
    updatedAt: now,
    rules: data.rules,
  });
  return { id: data.key, ...data, description: data.description || '', createdAt: now, updatedAt: now };
}

export async function updateFlag(id: string, data: Partial<FeatureFlag>): Promise<FeatureFlag> {
  const existing = memoryFlags.get(id);
  if (!existing) throw new Error(`Feature flag '${id}' not found`);

  const updated = { ...existing, ...data, updatedAt: new Date() };
  memoryFlags.set(id, updated);
  return { id, ...updated };
}

export async function deleteFlag(id: string): Promise<void> {
  if (!memoryFlags.has(id)) throw new Error(`Feature flag '${id}' not found`);
  memoryFlags.delete(id);
}
