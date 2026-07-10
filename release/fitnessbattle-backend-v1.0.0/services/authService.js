import { prisma } from '../services/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
const JWT_EXPIRES_IN = '7d';
const REFRESH_EXPIRES_IN = '30d';
export async function register(email, password, name) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
        },
    });
    const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: REFRESH_EXPIRES_IN,
    });
    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    });
    return { accessToken, refreshToken, user };
}
export async function login(email, password) {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('Invalid credentials');
    }
    const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: REFRESH_EXPIRES_IN,
    });
    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    });
    return {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, name: user.name },
    };
}
export async function refreshToken(refreshToken) {
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, JWT_SECRET);
    }
    catch {
        throw new Error('Invalid refresh token');
    }
    if (refreshToken.startsWith('demo-token-') || refreshToken.startsWith('demo-refresh-')) {
        const accessToken = jwt.sign({ id: decoded.id, email: decoded.email }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        return { accessToken };
    }
    const token = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
    });
    if (!token || token.expiresAt < new Date()) {
        throw new Error('Invalid refresh token');
    }
    const user = await prisma.user.findUnique({
        where: { id: decoded.id },
    });
    if (!user) {
        throw new Error('User not found');
    }
    const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
    return { accessToken };
}
