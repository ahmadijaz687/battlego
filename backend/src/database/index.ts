import { connectDatabase as dbConnect, disconnectDatabase as dbDisconnect, prisma, isDatabaseConnected as _isDatabaseConnected } from '../services/database.js';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

export async function connectDatabase(): Promise<void> {
  await dbConnect();
}

export async function disconnectDatabase(): Promise<void> {
  await dbDisconnect();
}

export async function healthCheck(): Promise<{
  connected: boolean;
  responseTime: number;
}> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true, responseTime: Date.now() - start };
  } catch {
    return { connected: false, responseTime: Date.now() - start };
  }
}

export async function runMigrations(): Promise<void> {
  try {
    execSync('npx prisma migrate deploy', {
      cwd: projectRoot,
      stdio: 'inherit',
    });
    logger.info('[Database] Migrations applied successfully');
  } catch (error) {
    logger.error('[Database] Migration failed:', error);
    throw error;
  }
}

export async function runSeed(): Promise<void> {
  try {
    execSync('npx tsx src/seed/index.ts', {
      cwd: projectRoot,
      stdio: 'inherit',
    });
    logger.info('[Database] Seed completed successfully');
  } catch (error) {
    logger.error('[Database] Seed failed:', error);
    throw error;
  }
}

export { prisma, isDatabaseConnected } from '../services/database.js';
