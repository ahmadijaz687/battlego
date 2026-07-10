const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN || '';

let Sentry: any = null;

async function ensureSentry() {
  if (!Sentry) {
    try {
      Sentry = await import('@sentry/react-native');
    } catch {
      Sentry = null;
    }
  }
}

export async function initSentry() {
  if (!SENTRY_DSN) return;
  await ensureSentry();
  if (!Sentry) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.25,
    profilesSampleRate: 0.1,
    environment: process.env.EXPO_PUBLIC_ENV || 'development',
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    attachScreenshot: true,
    attachViewHierarchy: true,
    beforeSend(event: any) {
      return event;
    },
  });
}

export async function captureException(error: Error, context?: Record<string, unknown>) {
  await ensureSentry();
  if (!Sentry) return;
  Sentry.withScope((scope: any) => {
    if (context) scope.setExtras(context);
    Sentry.captureException(error);
  });
}

export async function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  await ensureSentry();
  if (!Sentry) return;
  Sentry.captureMessage(message, level);
}

export async function setUser(userId: string, email?: string, username?: string) {
  await ensureSentry();
  if (!Sentry) return;
  Sentry.setUser({ id: userId, email, username });
}

export async function clearUser() {
  await ensureSentry();
  if (!Sentry) return;
  Sentry.setUser(null);
}

export async function addBreadcrumb(message: string, category?: string, data?: Record<string, unknown>) {
  await ensureSentry();
  if (!Sentry) return;
  Sentry.addBreadcrumb({ message, category, data, level: 'info' });
}
