import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

interface User {
    id: string;
    email: string;
    token: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check for existing token on app start
        const loadUser = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                const userData = await SecureStore.getItemAsync('userData');

                if (token && userData) {
                    setUser({ ...JSON.parse(userData), token });
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };

        loadUser();
    }, []);

    const logout = useCallback(async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Clear all secure storage items
                            await Promise.all([
                                SecureStore.deleteItemAsync('userToken'),
                                SecureStore.deleteItemAsync('userData')
                            ]);

                            // Clear user state
                            setUser(null);

                            // Navigate to signin screen
                            router.replace('/signin');
                        } catch (error) {
                            console.error('Error during logout:', error);
                            Alert.alert(
                                "Error",
                                "Failed to logout. Please try again.",
                                [{ text: "OK" }]
                            );
                        }
                    }
                }
            ]
        );
    }, [router]);

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}