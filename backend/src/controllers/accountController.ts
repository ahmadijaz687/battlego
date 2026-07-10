import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import { prisma } from '../services/database.js';
import { AppError } from '../utils/AppError.js';
import { successResponse } from '../utils/response.js';
import { sendEmail, buildResetLink, buildVerificationLink } from '../services/email.js';
import type { AuthenticatedRequest } from '../middlewares/auth.js';

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export const forgotPasswordHandler = async (req: Request, res: Response) => {
  const { email } = req.body;

  // Always return success to avoid leaking which emails exist.
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = randomUUID();
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      },
    });

    const sent = await sendEmail({
      to: email,
      subject: 'Reset your Fitness Battle password',
      text: `Reset your password using this link: ${buildResetLink(token)}`,
      html: `<p>Reset your Fitness Battle password:</p><p><a href="${buildResetLink(token)}">${buildResetLink(token)}</a></p>`,
    });

    // In production the token is emailed; only return it in DEV when SMTP is not configured.
    return res.json(
      successResponse(
        sent ? {} : { token },
        sent
          ? 'If the email exists, a reset link has been sent.'
          : 'If the email exists, a reset link has been issued (DEV token returned).',
      ),
    );
  }

  return res.json(
    successResponse({ token: null }, 'If the email exists, a reset link has been issued.')
  );
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record) {
    throw new AppError('Invalid reset token', 400);
  }
  if (record.used) {
    throw new AppError('Reset token already used', 400);
  }
  if (record.expiresAt < new Date()) {
    throw new AppError('Reset token expired', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { password: hashedPassword } }),
    prisma.passwordResetToken.update({ where: { token }, data: { used: true } }),
  ]);

  res.json(successResponse(null, 'Password updated successfully'));
};

export const requestVerificationHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!.id;

  const token = randomUUID();
  await prisma.emailVerificationToken.create({
    data: {
      userId,
      token,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const sent = user?.email
    ? await sendEmail({
        to: user.email,
        subject: 'Verify your Fitness Battle email',
        text: `Verify your email using this link: ${buildVerificationLink(token)}`,
        html: `<p>Verify your Fitness Battle email:</p><p><a href="${buildVerificationLink(token)}">${buildVerificationLink(token)}</a></p>`,
      })
    : false;

  res.json(
    successResponse(
      sent ? {} : { token },
      sent ? 'Verification email sent.' : 'Verification token issued (DEV token returned).',
    ),
  );
};

export const verifyEmailHandler = async (req: Request, res: Response) => {
  const { token } = req.body;

  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });
  if (!record) {
    throw new AppError('Invalid verification token', 400);
  }
  if (record.used) {
    throw new AppError('Verification token already used', 400);
  }
  if (record.expiresAt < new Date()) {
    throw new AppError('Verification token expired', 400);
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { emailVerified: true } }),
    prisma.emailVerificationToken.update({ where: { token }, data: { used: true } }),
  ]);

  res.json(successResponse(null, 'Email verified successfully'));
};
