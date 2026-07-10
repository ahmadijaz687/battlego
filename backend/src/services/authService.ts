import { prisma } from '../services/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { AppError } from '../utils/AppError.js';

import { config } from '../config/index.js';
import { verifyFirebaseIdToken } from './firebaseAuth.js';

const JWT_EXPIRES_IN = config.auth.jwtExpiresIn as unknown as SignOptions['expiresIn'];
const REFRESH_EXPIRES_IN = config.auth.refreshExpiresIn as unknown as SignOptions['expiresIn'];
const JWT_SECRET = config.auth.jwtSecret;

function expiryFromToken(token: string): Date {
  const decoded = jwt.decode(token) as { exp?: number } | null;
  if (decoded?.exp) {
    return new Date(decoded.exp * 1000);
  }
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

export async function register(email: string, password: string, name: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError('User already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [user] = await prisma.$transaction([
    prisma.user.create({
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
    }),
  ]);

  const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
  const familyId = randomUUID();

  await prisma.$transaction([
    prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        familyId,
        expiresAt: expiryFromToken(refreshToken),
      },
    }),
  ]);

  return { accessToken, refreshToken, user };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
  const familyId = randomUUID();

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      familyId,
      expiresAt: expiryFromToken(refreshToken),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name },
  };
}

export async function refreshToken(refreshToken: string) {
  let decoded: { id: string; email: string };

  try {
    decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string; email: string; iat?: number; exp?: number };
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }

  const token = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!token) {
    throw new AppError('Invalid refresh token', 401);
  }

  if (token.revoked) {
    // Reuse of an already-rotated token: assume theft. Revoke the whole family.
    await prisma.refreshToken.updateMany({
      where: { familyId: token.familyId, revoked: false },
      data: { revoked: true },
    });
    throw new AppError('Refresh token reuse detected', 401);
  }

  if (token.expiresAt < new Date()) {
    throw new AppError('Invalid refresh token', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const newAccessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  const newRefreshToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });

  // Rotate: revoke the used token and issue a new one in the same family.
  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { revoked: true },
    }),
    prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: newRefreshToken,
        familyId: token.familyId,
        expiresAt: expiryFromToken(newRefreshToken),
      },
    }),
  ]);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logoutUser(userId: string, refreshToken?: string) {
  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { userId, token: refreshToken },
      data: { revoked: true },
    });
  } else {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }
  return { loggedOut: true };
}

export interface IssueTarget {
  id: string;
  email: string;
  name?: string | null;
}

export async function issueTokensForUser(user: IssueTarget) {
  const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
  const familyId = randomUUID();

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      familyId,
      expiresAt: expiryFromToken(refreshToken),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name ?? '' },
  };
}

export async function socialLogin(provider: string, idToken: string) {
  if (!['google', 'apple', 'x', 'meta'].includes(provider)) {
    throw new AppError('Unsupported social provider', 400);
  }

  const decoded = await verifyFirebaseIdToken(idToken);
  if (!decoded.email) {
    throw new AppError('Provider did not return an email address', 400);
  }

  let user = await prisma.user.findUnique({ where: { email: decoded.email } });
  if (!user) {
    const hashedPassword = await bcrypt.hash(randomUUID(), 10);
    user = await prisma.user.create({
      data: {
        email: decoded.email,
        password: hashedPassword,
        name: decoded.name || decoded.email.split('@')[0],
      },
    });
  }

  return issueTokensForUser(user);
}
