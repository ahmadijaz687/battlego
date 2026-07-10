import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
});
let dbConnected = false;
export async function connectDatabase() {
    try {
        await prisma.$connect();
        dbConnected = true;
        console.log('MySQL database connected via Prisma');
    }
    catch (error) {
        dbConnected = false;
        console.warn('Database connection failed, running in demo mode:', error.message);
    }
}
export async function disconnectDatabase() {
    await prisma.$disconnect();
}
export function isDatabaseConnected() {
    return dbConnected;
}
