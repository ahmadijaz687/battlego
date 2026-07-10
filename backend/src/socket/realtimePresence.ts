import { appCache } from '../cache/index.js';

const PRESENCE_PREFIX = 'presence:user:';
const USER_ROOMS_PREFIX = 'presence:rooms:';
const ACTIVITY_PREFIX = 'presence:activity:';

export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline';
export type ActivityType = 'idle' | 'in_workout' | 'in_battle' | 'in_chat' | 'in_community' | 'in_leaderboard' | 'in_workout_session';

export interface PresenceData {
  userId: string;
  username?: string;
  status: PresenceStatus;
  activity: ActivityType;
  lastSeen: number;
  socketId?: string;
}

export async function getPresence(userId: string): Promise<PresenceData | null> {
  return appCache.get<PresenceData>(`${PRESENCE_PREFIX}${userId}`);
}

export async function updatePresence(
  userId: string,
  status: PresenceStatus,
  activity: ActivityType = 'idle',
  username?: string,
  socketId?: string
): Promise<void> {
  const data: PresenceData = {
    userId,
    username,
    status,
    activity,
    lastSeen: Date.now(),
    socketId,
  };
  await appCache.set(`${PRESENCE_PREFIX}${userId}`, data, { ttl: 0 });
}

export async function updateActivity(userId: string, activity: ActivityType): Promise<void> {
  const presence = await getPresence(userId);
  if (presence) {
    presence.activity = activity;
    presence.lastSeen = Date.now();
    await appCache.set(`${PRESENCE_PREFIX}${userId}`, presence, { ttl: 0 });
  }
}

export async function removePresence(userId: string): Promise<void> {
  await appCache.delete(`${PRESENCE_PREFIX}${userId}`);
  await appCache.delete(`${USER_ROOMS_PREFIX}${userId}`);
  await appCache.delete(`${ACTIVITY_PREFIX}${userId}`);
}

export async function getOnlineUsers(userIds: string[]): Promise<Map<string, PresenceData>> {
  const results = new Map<string, PresenceData>();
  for (const id of userIds) {
    const presence = await getPresence(id);
    if (presence && presence.status !== 'offline') {
      results.set(id, presence);
    }
  }
  return results;
}

export async function getAllOnlineUserIds(): Promise<string[]> {
  return [];
}

export async function addUserRoom(userId: string, room: string): Promise<void> {
  const key = `${USER_ROOMS_PREFIX}${userId}`;
  const rooms = await appCache.get<string[]>(key) || [];
  if (!rooms.includes(room)) {
    rooms.push(room);
    await appCache.set(key, rooms, { ttl: 0 });
  }
}

export async function removeUserRoom(userId: string, room: string): Promise<void> {
  const key = `${USER_ROOMS_PREFIX}${userId}`;
  const rooms = await appCache.get<string[]>(key) || [];
  const filtered = rooms.filter((r) => r !== room);
  await appCache.set(key, filtered, { ttl: 0 });
}

export async function getUserRooms(userId: string): Promise<string[]> {
  return await appCache.get<string[]>(`${USER_ROOMS_PREFIX}${userId}`) || [];
}

export async function setAwayForInactive(timeoutMs = 300000): Promise<void> {
  const now = Date.now();
  const allPresence = await appCache.get<Record<string, PresenceData>>('presence:all') || {};
  for (const [userId, data] of Object.entries(allPresence)) {
    if (data.status === 'online' && now - data.lastSeen > timeoutMs) {
      await updatePresence(userId, 'away', data.activity);
    }
  }
}
