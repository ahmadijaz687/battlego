import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test', override: true });

const dbUrl = process.env.DATABASE_URL!;
const rootUrl = dbUrl.replace(/\/[^/]+$/, '/mysql');
const dbName = dbUrl.split('/').pop()!;

export default async function globalTeardown() {
  const prisma = new PrismaClient({ datasources: { db: { url: rootUrl } } });

  try {
    await prisma.$connect();
    await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS \`${dbName}\``);
  } finally {
    await prisma.$disconnect();
  }
}
