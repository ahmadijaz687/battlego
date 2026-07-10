import React, { useEffect } from 'react';
import { QueryProvider } from '../providers/QueryProvider';
import { DatabaseProvider } from '../providers/DatabaseProvider';
import { ThemeProvider } from '../theme/ThemeContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { initSentry } from '../services/sentry';
import AppNavigator from '../navigation/AppNavigator';

export default function App() {
  useEffect(() => { initSentry().catch(() => {}); }, []);

  return (
    <ErrorBoundary>
      <DatabaseProvider>
        <QueryProvider>
          <ThemeProvider>
            <AppNavigator />
          </ThemeProvider>
        </QueryProvider>
      </DatabaseProvider>
    </ErrorBoundary>
  );
}