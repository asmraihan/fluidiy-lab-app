import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'fluidiy-lab-app',
  slug: 'fluidiy-lab-app',
  extra: {
    EXPO_PUBLIC_DATABASE_URL: process.env.EXPO_PUBLIC_DATABASE_URL,
    EXPO_PUBLIC_JWT_SECRET: process.env.EXPO_PUBLIC_JWT_SECRET,
  },
});