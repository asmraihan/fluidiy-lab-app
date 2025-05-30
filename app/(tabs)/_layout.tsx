import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Platform } from 'react-native';
import { Camera, History, Home, Info } from 'lucide-react-native';
import { AnalysisProvider } from '@/context/AnalysisContext';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AnalysisProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#0078D7',
          tabBarInactiveTintColor: '#6B7280',
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 85 : 60,
            paddingBottom: Platform.OS === 'ios' ? 25 : 10,
            paddingTop: 10,
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0078D7',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontFamily: 'Inter-Bold',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            headerTitle: 'Urinalysis Analyzer',
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: 'Capture',
            tabBarIcon: ({ color, size }) => <Camera size={size} color={color} />,
            headerTitle: 'Capture Test Strip',
          }}
        />
        <Tabs.Screen
          name="results"
          options={{
            title: 'Results',
            tabBarIcon: ({ color, size }) => <History size={size} color={color} />,
            headerTitle: 'Analysis Results',
          }}
        />
        <Tabs.Screen
          name="information"
          options={{
            title: 'Info',
            tabBarIcon: ({ color, size }) => <Info size={size} color={color} />,
            headerTitle: 'Urinalysis Information',
          }}
        />
      </Tabs>
    </AnalysisProvider>
  );
}