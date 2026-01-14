/**
 * API Configuration for Talkify
 * Centralized API URL management
 */
import { Platform } from 'react-native';

// Backend API base URL
// For web: use localhost
// For mobile: use local network IP
const getBaseUrl = () => {
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }

    // Web browsers can use localhost directly
    if (Platform.OS === 'web') {
        return 'http://localhost:5000/api';
    }

    // Mobile devices need the local network IP
    // Update this IP if your local network changes
    return 'http://10.10.12.148:5000/api';
};

export const API_BASE_URL = getBaseUrl();

// Individual API endpoints
export const API_ENDPOINTS = {
    // Auth
    AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
    AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
    AUTH_PROFILE: `${API_BASE_URL}/auth/profile`,

    // Words / Flashcards
    WORDS: `${API_BASE_URL}/words`,
    DAILY_WORD: `${API_BASE_URL}/words/daily`,
    WORD_PROGRESS: `${API_BASE_URL}/progress/words`,

    // Quiz
    QUIZZES: `${API_BASE_URL}/quiz`,
    QUIZ_SUBMIT: `${API_BASE_URL}/quiz/submit`,
    QUIZ_HISTORY: `${API_BASE_URL}/quiz/history`,
    QUIZ_STATS: `${API_BASE_URL}/quiz/stats`,

    // Chat
    CONVERSATIONS: `${API_BASE_URL}/chat/conversations`,

    // Gamification
    STREAK: `${API_BASE_URL}/gamification/streak`,
    ACTIVITY: `${API_BASE_URL}/gamification/activity`,
    ACHIEVEMENTS: `${API_BASE_URL}/gamification/achievements`,
    MY_ACHIEVEMENTS: `${API_BASE_URL}/gamification/my-achievements`,

    // Progress
    USER_STATS: `${API_BASE_URL}/progress/stats`,
    LEARNING_SESSION: `${API_BASE_URL}/progress/session`,
};

// Request timeout in milliseconds
export const API_TIMEOUT = 10000;

// Headers helper
export const getAuthHeaders = (token: string | null) => ({
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
});
