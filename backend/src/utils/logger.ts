import { captureError, captureMessage } from '../config/sentry.js';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0, info: 1, warn: 2, error: 3,
};

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'debug';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function toError(err: unknown): Error | undefined {
  if (err instanceof Error) return err;
  if (err !== undefined && err !== null) return new Error(String(err));
  return undefined;
}

const logEntry = (level: LogLevel, message: string, error?: unknown, data?: Record<string, unknown>) => {
  const err = toError(error);
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(err ? { error: { message: err.message, stack: err.stack } } : {}),
    ...(data ? { data } : {}),
  };
  const line = JSON.stringify(entry);
  switch (level) {
    case 'debug': console.debug(line); break;
    case 'info': console.info(line); break;
    case 'warn': console.warn(line); break;
    case 'error': console.error(line); break;
  }
};

export const logger = {
  debug(message: string, data?: Record<string, unknown>) {
    if (!shouldLog('debug')) return;
    logEntry('debug', message, undefined, data);
  },

  info(message: string, data?: Record<string, unknown>) {
    if (!shouldLog('info')) return;
    logEntry('info', message, undefined, data);
  },

  warn(message: string, data?: Record<string, unknown>) {
    if (!shouldLog('warn')) return;
    logEntry('warn', message, undefined, data);
    captureMessage(message, 'warning');
  },

  error(message: string, error?: unknown, data?: Record<string, unknown>) {
    if (!shouldLog('error')) return;
    logEntry('error', message, error, data);
    const err = toError(error);
    if (err) captureError(err, { message, ...data });
    else captureMessage(message, 'error');
  },
};
