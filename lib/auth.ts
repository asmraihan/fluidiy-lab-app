import * as SecureStore from 'expo-secure-store';
import { verifyToken } from './db';

export async function getAuthenticatedUser() {
  try {
    const token = await SecureStore.getItemAsync('userToken');
    if (!token) return null;
    
    const user = await verifyToken(token);
    return user;
  } catch (error) {
    return null;
  }
}