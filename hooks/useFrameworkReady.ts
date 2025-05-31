import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

export function useFrameworkReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('[Framework] Initializing...');
        await SplashScreen.preventAutoHideAsync();
        
        // Add your framework initialization logic here
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('[Framework] Ready');
        setIsReady(true);
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('[Framework] Error:', error);
        setIsReady(true); // Set ready even on error to prevent infinite loading
      }
    }

    prepare();
  }, []);

  return isReady;
}
