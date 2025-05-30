import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { fetchAPI } from '@/lib/fetch';

export function useAuth() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          const userData = await fetchAPI('/api/user/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(userData);
        }
      } catch (error) {
        console.error('[Auth] Error loading user:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return { user, loading };
}