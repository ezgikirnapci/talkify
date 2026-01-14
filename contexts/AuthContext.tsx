/**
 * AuthContext - Global authentication state management
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebaseConfig';

interface User {
    id?: number;
    email: string;
    username?: string;
    avatar_url?: string;
    language_level?: string;
    daily_goal?: number;
    streak_count?: number;
    firebase_uid?: string;
}

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = '@talkify_token';
const USER_STORAGE_KEY = '@talkify_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load saved auth state on mount
    useEffect(() => {
        const loadAuthState = async () => {
            try {
                const [savedToken, savedUser] = await Promise.all([
                    AsyncStorage.getItem(TOKEN_STORAGE_KEY),
                    AsyncStorage.getItem(USER_STORAGE_KEY),
                ]);

                if (savedToken) {
                    setToken(savedToken);
                }
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (error) {
                console.error('Failed to load auth state:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAuthState();
    }, []);

    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
            setFirebaseUser(fbUser);
            if (!fbUser) {
                // User signed out from Firebase
                setUser(null);
                setToken(null);
                AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
            }
        });

        return () => unsubscribe();
    }, []);

    // Persist token changes
    useEffect(() => {
        if (token) {
            AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
        } else {
            AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
        }
    }, [token]);

    // Persist user changes
    useEffect(() => {
        if (user) {
            AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } else {
            AsyncStorage.removeItem(USER_STORAGE_KEY);
        }
    }, [user]);

    const logout = async () => {
        try {
            // Sign out from Firebase
            await auth.signOut();
            // Clear local state
            setUser(null);
            setToken(null);
            await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value: AuthContextType = {
        user,
        firebaseUser,
        token,
        isLoading,
        isAuthenticated: !!user && !!firebaseUser,
        setUser,
        setToken,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
