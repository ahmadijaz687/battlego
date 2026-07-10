import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test', override: true });

const dbUrl = process.env.DATABASE_URL!;
const rootUrl = dbUrl.replace(/\/[^/]+$/, '/mysql');
const dbName = dbUrl.split('/').pop()!;

export default async function globalSetup() {
  const rootPrisma = new PrismaClient({ datasources: { db: { url: rootUrl } } });

  try {
    await rootPrisma.$connect();

    const dbs = await rootPrisma.$queryRawUnsafe<Array<{ Database: string }>>(
      'SHOW DATABASES',
    );
    if (dbs.some((r) => r.Database === dbName)) {
      await rootPrisma.$executeRawUnsafe(`DROP DATABASE \`${dbName}\``);
    }

    await rootPrisma.$executeRawUnsafe(`CREATE DATABASE \`${dbName}\``);
  } finally {
    await rootPrisma.$disconnect();
  }

  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: dbUrl },
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  execSync('npx tsx src/seed/index.ts', {
    env: { ...process.env, DATABASE_URL: dbUrl },
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  process.env.DATABASE_URL = dbUrl;
}
