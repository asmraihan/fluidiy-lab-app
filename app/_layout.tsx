import { useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function RootLayout() {
  const isFrameworkReady = useFrameworkReady();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      if (!isFrameworkReady || !mounted) return;

      console.log('[Layout] Framework ready, checking auth...');
      try {
        const token = await SecureStore.getItemAsync('userToken');
        console.log('[Layout] Token exists:', !!token);
        if (mounted) {
          setIsAuthenticated(!!token);
        }
      } catch (error) {
        console.error('[Layout] Auth error:', error);
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Unknown error');
          setIsAuthenticated(false);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [isFrameworkReady]);

  if (!isFrameworkReady || isAuthenticated === null) {
    return null; // Let the splash screen handle the loading state
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      {!isAuthenticated && <Redirect href="/onboarding" />}
    </>
  );
}