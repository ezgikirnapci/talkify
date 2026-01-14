/**
 * Gamification Service - Backend API integration for streaks and achievements
 */
import { API_ENDPOINTS, getAuthHeaders } from '../config/apiConfig';

interface Achievement {
    id: number;
    name: string;
    description: string;
    icon_url?: string;
}

interface UserAchievement {
    id: number;
    achievement: Achievement;
    earned_at: string;
}

interface StreakInfo {
    streak_count: number;
    last_activity_date: string | null;
}

/**
 * Get user's current streak
 */
export const getStreak = async (token: string): Promise<StreakInfo> => {
    try {
        const response = await fetch(API_ENDPOINTS.STREAK, {
            method: 'GET',
            headers: getAuthHeaders(token),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Streak bilgisi alınamadı');
        }

        return data.data;
    } catch (error) {
        console.error('getStreak error:', error);
        throw error;
    }
};

/**
 * Log user activity and update streak
 */
export const logActivity = async (token: string): Promise<{ streak_count: number }> => {
    try {
        const response = await fetch(API_ENDPOINTS.ACTIVITY, {
            method: 'POST',
            headers: getAuthHeaders(token),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Aktivite kaydedilemedi');
        }

        return data.data;
    } catch (error) {
        console.error('logActivity error:', error);
        throw error;
    }
};

/**
 * Get all available achievements
 */
export const getAllAchievements = async (token: string): Promise<Achievement[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.ACHIEVEMENTS, {
            method: 'GET',
            headers: getAuthHeaders(token),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Başarımlar alınamadı');
        }

        return data.data;
    } catch (error) {
        console.error('getAllAchievements error:', error);
        throw error;
    }
};

/**
 * Get user's earned achievements
 */
export const getUserAchievements = async (token: string): Promise<UserAchievement[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.MY_ACHIEVEMENTS, {
            method: 'GET',
            headers: getAuthHeaders(token),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Kullanıcı başarımları alınamadı');
        }

        return data.data;
    } catch (error) {
        console.error('getUserAchievements error:', error);
        throw error;
    }
};
