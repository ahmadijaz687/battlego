import { logger } from '../utils/logger.js';

const requiredEnvVars = [
  'PORT',
  'HOST',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'REFRESH_EXPIRES_IN',
  'CORS_ORIGIN',
];

export function validateEnvironment() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length < 32) {
    logger.warn('JWT_SECRET should be at least 32 characters for security');
  }

  const port = parseInt(process.env.PORT || '5000');
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid port number (1-65535)');
  }

  logger.info('Environment validation passed');
  return true;
}

export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value || defaultValue || '';
}