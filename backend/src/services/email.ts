import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

let transporter: nodemailer.Transporter | null = null;
let transporterResolved = false;

function getTransporter(): nodemailer.Transporter | null {
  if (transporterResolved) return transporter;
  transporterResolved = true;

  const host = process.env.SMTP_HOST;
  if (!host) return null;

  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return transporter;
}

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Sends an email via SMTP. If SMTP is not configured, logs the message
 * (DEV fallback) so local flows still work, and returns false.
 */
export async function sendEmail(opts: EmailOptions): Promise<boolean> {
  const transport = getTransporter();
  const from = process.env.SMTP_FROM || 'Fitness Battle <noreply@fitnessbattle.com>';

  if (!transport) {
    logger.info('[email] SMTP not configured; DEV fallback log', {
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
    });
    return false;
  }

  try {
    await transport.sendMail({
      from,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
    return true;
  } catch (err) {
    logger.warn('[email] send failed', {
      to: opts.to,
      error: err instanceof Error ? err.message : String(err),
    });
    return false;
  }
}

export function buildResetLink(token: string): string {
  const base = process.env.WEB_URL || 'http://localhost:3000';
  return `${base}/reset-password?token=${encodeURIComponent(token)}`;
}

export function buildVerificationLink(token: string): string {
  const base = process.env.WEB_URL || 'http://localhost:3000';
  return `${base}/verify-email?token=${encodeURIComponent(token)}`;
}
