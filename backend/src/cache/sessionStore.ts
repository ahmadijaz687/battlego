import session from 'express-session';
import { isRedisAvailable, getRedisClient as _getRedisClient } from './RedisClient.js';
import { RedisStore } from 'connect-redis';

export async function createSessionStore() {
  if (!isRedisAvailable()) {
    return new session.MemoryStore();
  }
  const redis = await _getRedisClient();
  if (redis) {
    return new RedisStore({ client: redis });
  }
  return new session.MemoryStore();
}

export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'fitness-battle-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
};
