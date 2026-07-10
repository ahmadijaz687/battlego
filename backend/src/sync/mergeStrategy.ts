export type ConflictStrategy = 'client_wins' | 'server_wins' | 'merge' | 'manual';

function mergeObjects(base: Record<string, unknown>, client: Record<string, unknown>, server: Record<string, unknown>): Record<string, unknown> {
  const result = { ...base };
  const allKeys = new Set([...Object.keys(client), ...Object.keys(server)]);

  for (const key of allKeys) {
    const cv = client[key];
    const sv = server[key];

    if (cv === undefined) {
      result[key] = sv;
    } else if (sv === undefined) {
      result[key] = cv;
    } else if (typeof cv !== typeof sv) {
      result[key] = sv;
    } else if (typeof cv === 'object' && cv !== null && sv !== null && !Array.isArray(cv) && !Array.isArray(sv)) {
      result[key] = mergeObjects(base[key] as Record<string, unknown> || {}, cv as Record<string, unknown>, sv as Record<string, unknown>);
    } else {
      result[key] = sv;
    }
  }

  return result;
}

export function mergeWorkoutData(serverData: Record<string, unknown>, clientData: Record<string, unknown>): Record<string, unknown> {
  const serverSets = (serverData.sets as Array<Record<string, unknown>>) || [];
  const clientSets = (clientData.sets as Array<Record<string, unknown>>) || [];
  const clientSetIds = new Set(clientSets.map(s => s.id as string));

  const mergedSets = [
    ...serverSets.filter(s => !clientSetIds.has(s.id as string)),
    ...clientSets,
  ];

  return {
    ...serverData,
    ...clientData,
    sets: mergedSets,
    updatedAt: new Date().toISOString(),
  };
}

export function mergeNutritionData(serverData: Record<string, unknown>, clientData: Record<string, unknown>): Record<string, unknown> {
  const serverEntries = (serverData.entries as Array<Record<string, unknown>>) || [];
  const clientEntries = (clientData.entries as Array<Record<string, unknown>>) || [];
  const existingClientTimestamps = new Set(clientEntries.map(e => e.clientTimestamp as string));

  const mergedEntries = [
    ...serverEntries.filter(e => !existingClientTimestamps.has(e.clientTimestamp as string)),
    ...clientEntries,
  ];

  return {
    ...serverData,
    ...clientData,
    entries: mergedEntries,
    updatedAt: new Date().toISOString(),
  };
}

export function mergeSocialData(serverData: Record<string, unknown>, clientData: Record<string, unknown>): Record<string, unknown> {
  return {
    ...serverData,
    ...clientData,
    likes: (clientData.likes as number) ?? (serverData.likes as number),
    updatedAt: new Date().toISOString(),
  };
}

export function mergeHealthData(serverData: Record<string, unknown>, clientData: Record<string, unknown>): Record<string, unknown> {
  const serverValues = (serverData.values as number[]) || [];
  const clientValues = (clientData.values as number[]) || [];
  const allValues = [...serverValues, ...clientValues];

  const average = allValues.length > 0
    ? allValues.reduce((a, b) => a + b, 0) / allValues.length
    : 0;

  return {
    ...serverData,
    ...clientData,
    value: Math.round(average * 100) / 100,
    values: allValues,
    updatedAt: new Date().toISOString(),
  };
}

export function mergeHabitData(serverData: Record<string, unknown>, clientData: Record<string, unknown>): Record<string, unknown> {
  const serverLogs = (serverData.logs as Array<Record<string, unknown>>) || [];
  const clientLogs = (clientData.logs as Array<Record<string, unknown>>) || [];
  const clientLogDates = new Set(clientLogs.map(l => l.date as string));

  const mergedLogs = [
    ...serverLogs.filter(l => !clientLogDates.has(l.date as string)),
    ...clientLogs,
  ];

  return {
    ...serverData,
    ...clientData,
    logs: mergedLogs,
    updatedAt: new Date().toISOString(),
  };
}

export function mergeWaterData(serverData: Record<string, unknown>, clientData: Record<string, unknown>): Record<string, unknown> {
  const serverUpdated = new Date((serverData.updatedAt as string) || 0).getTime();
  const clientUpdated = new Date((clientData.updatedAt as string) || 0).getTime();

  const winner = clientUpdated > serverUpdated ? clientData : serverData;
  return {
    ...serverData,
    ...winner,
    updatedAt: new Date().toISOString(),
  };
}

export function mergeMealFoodData(serverData: Record<string, unknown>, clientData: Record<string, unknown>): Record<string, unknown> {
  return {
    ...serverData,
    ...clientData,
    updatedAt: new Date().toISOString(),
  };
}

const domainMergeStrategies: Record<string, (server: Record<string, unknown>, client: Record<string, unknown>) => Record<string, unknown>> = {
  workouts: mergeWorkoutData,
  nutrition: mergeNutritionData,
  mealFood: mergeMealFoodData,
  water: mergeWaterData,
  social: mergeSocialData,
  health: mergeHealthData,
  habits: mergeHabitData,
};

export function applyMergeStrategy(
  domain: string,
  serverData: Record<string, unknown>,
  clientData: Record<string, unknown>
): Record<string, unknown> {
  const merger = domainMergeStrategies[domain];
  if (merger) {
    return merger(serverData, clientData);
  }
  return mergeObjects({} as Record<string, unknown>, clientData, serverData);
}

export function deltaSync<T extends Record<string, unknown>>(
  serverData: T[],
  clientData: T[],
  idKey: keyof T = 'id' as keyof T
): { created: T[]; updated: T[]; deleted: string[] } {
  const serverMap = new Map<string, T>();
  const clientMap = new Map<string, T>();

  for (const item of serverData) {
    serverMap.set(String(item[idKey]), item);
  }
  for (const item of clientData) {
    clientMap.set(String(item[idKey]), item);
  }

  const created: T[] = [];
  const updated: T[] = [];
  const deleted: string[] = [];

  for (const [id, serverItem] of serverMap) {
    if (!clientMap.has(id)) {
      created.push(serverItem);
    } else {
      const clientItem = clientMap.get(id)!;
      const serverUpdated = new Date((serverItem.updatedAt as string) || 0).getTime();
      const clientUpdated = new Date((clientItem.updatedAt as string) || 0).getTime();
      if (serverUpdated > clientUpdated) {
        updated.push(serverItem);
      }
    }
  }

  for (const [id] of clientMap) {
    if (!serverMap.has(id)) {
      deleted.push(id);
    }
  }

  return { created, updated, deleted };
}
