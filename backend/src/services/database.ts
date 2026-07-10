import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

export const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

let dbConnected = false;

export async function connectDatabase() {
  try {
    await prisma.$connect();
    dbConnected = true;
    logger.info('MySQL database connected via Prisma');
  } catch (error) {
    dbConnected = false;
    logger.warn('Database connection failed, running in demo mode', { message: (error as Error).message });
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}

export function isDatabaseConnected() {
  return dbConnected;
}
