import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getDatabase } from '../database';
import { colors, spacing } from '../theme';

interface DatabaseContextValue {
  dbReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextValue>({ dbReady: false });

export function useDatabaseReady(): boolean {
  return useContext(DatabaseContext).dbReady;
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    try {
      getDatabase();
      setDbReady(true);
    } catch (err) {
      console.error('Database initialization failed:', err);
    }
  }, []);

  if (!dbReady) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(232, 38, 46, 0.18)', 'transparent', 'transparent']}
          style={styles.gradient}
          locations={[0, 0.5, 1]}
        />
        <View style={styles.content}>
          <View style={styles.logoWrap}>
            <View style={styles.logoTile}>
              <Text style={styles.logoText}>FB</Text>
            </View>
          </View>
          <Text style={styles.title}>FITNESS BATTLE</Text>
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        </View>
      </View>
    );
  }

  return (
    <DatabaseContext.Provider value={{ dbReady }}>
      {children}
    </DatabaseContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  gradient: {
    position: 'absolute',
    top: -200,
    left: -100,
    right: -100,
    height: 500,
  },
  content: {
    alignItems: 'center',
  },
  logoWrap: {
    marginBottom: spacing.xl,
  },
  logoTile: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 4,
  },
  loader: {
    marginTop: spacing.xl,
  },
});
