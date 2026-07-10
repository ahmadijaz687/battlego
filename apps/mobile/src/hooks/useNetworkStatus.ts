import { useState, useEffect } from 'react';

export function useNetworkStatus(): { isConnected: boolean } {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        await fetch('https://clients3.google.com/generate_204', {
          method: 'HEAD',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!cancelled) setIsConnected(true);
      } catch {
        if (!cancelled) setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { isConnected };
}
