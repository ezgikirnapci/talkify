/**
 * Offline Mode Utility
 * Handles network state detection and offline data caching
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Cache keys
const CACHE_KEYS = {
    DAILY_WORD: '@talkify_daily_word',
    WORDS: '@talkify_words',
    QUIZ_DATA: '@talkify_quiz_data',
    USER_PROGRESS: '@talkify_user_progress',
};

/**
 * Check if device is online
 */
export const isOnline = async (): Promise<boolean> => {
    try {
        const state = await NetInfo.fetch();
        return state.isConnected ?? false;
    } catch {
        return true; // Assume online if check fails
    }
};

/**
 * Cache data to AsyncStorage
 */
export const cacheData = async (key: string, data: any): Promise<void> => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify({
            data,
            timestamp: Date.now(),
        }));
    } catch (error) {
        console.log('Cache write error:', error);
    }
};

/**
 * Get cached data from AsyncStorage
 * @param maxAgeMs - Maximum age of cache in milliseconds (default 24 hours)
 */
export const getCachedData = async <T>(
    key: string,
    maxAgeMs: number = 24 * 60 * 60 * 1000
): Promise<T | null> => {
    try {
        const cached = await AsyncStorage.getItem(key);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;

        // Return cached data if not expired
        if (age < maxAgeMs) {
            return data as T;
        }
        return null;
    } catch (error) {
        console.log('Cache read error:', error);
        return null;
    }
};

/**
 * Clear all cached data
 */
export const clearCache = async (): Promise<void> => {
    try {
        const keys = Object.values(CACHE_KEYS);
        await AsyncStorage.multiRemove(keys);
    } catch (error) {
        console.log('Cache clear error:', error);
    }
};

/**
 * Fetch with offline fallback
 * First tries network, falls back to cache if offline or request fails
 */
export const fetchWithOfflineFallback = async <T>(
    fetchFn: () => Promise<T>,
    cacheKey: string,
    defaultValue: T
): Promise<{ data: T; isOffline: boolean }> => {
    // Check if online
    const online = await isOnline();

    if (online) {
        try {
            const data = await fetchFn();
            // Cache successful response
            await cacheData(cacheKey, data);
            return { data, isOffline: false };
        } catch (error) {
            console.log('Fetch failed, trying cache:', error);
        }
    }

    // Try to get from cache
    const cachedData = await getCachedData<T>(cacheKey);
    if (cachedData) {
        return { data: cachedData, isOffline: true };
    }

    // Return default value if nothing available
    return { data: defaultValue, isOffline: !online };
};

export { CACHE_KEYS };
