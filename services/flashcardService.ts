/**
 * Flashcard Service - Backend API integration for words/flashcards
 */
import { API_ENDPOINTS, getAuthHeaders } from '../config/apiConfig';

interface Word {
    id: number;
    word: string;
    meaning: string;
    category?: string;
    level: string;
    example_sentence?: string;
    example_translation?: string;
    pronunciation?: string;
}

interface WordProgress {
    id: number;
    word_id: number;
    learned: boolean;
    review_count: number;
    correct_count: number;
    last_reviewed?: string;
}

interface DailyWord {
    id: number;
    date: string;
    word: Word;
}

/**
 * Get list of words with optional filters
 */
export const getWords = async (
    token: string | null,
    level?: string,
    category?: string,
    page: number = 1,
    perPage: number = 50
): Promise<{ words: Word[]; pagination: any }> => {
    try {
        const params = new URLSearchParams();
        if (level) params.append('level', level);
        if (category) params.append('category', category);
        params.append('page', page.toString());
        params.append('per_page', perPage.toString());

        const response = await fetch(`${API_ENDPOINTS.WORDS}?${params.toString()}`, {
            method: 'GET',
            headers: getAuthHeaders(token),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Kelimeler alınamadı');
        }

        return data.data;
    } catch (error) {
        console.error('getWords error:', error);
        throw error;
    }
};

/**
 * Get daily word
 */
export const getDailyWord = async (token: string | null): Promise<{ word: Word; date: string }> => {
    try {
        const response = await fetch(API_ENDPOINTS.DAILY_WORD, {
            method: 'GET',
            headers: getAuthHeaders(token),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Günün kelimesi alınamadı');
        }

        return data.data;
    } catch (error) {
        console.error('getDailyWord error:', error);
        throw error;
    }
};

/**
 * Get user's word progress
 */
export const getUserWordProgress = async (
    token: string,
    page: number = 1,
    perPage: number = 50
): Promise<{ progress: WordProgress[]; pagination: any }> => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: perPage.toString(),
        });

        const response = await fetch(`${API_ENDPOINTS.WORD_PROGRESS}?${params.toString()}`, {
            method: 'GET',
            headers: getAuthHeaders(token),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'İlerleme bilgisi alınamadı');
        }

        return data.data;
    } catch (error) {
        console.error('getUserWordProgress error:', error);
        throw error;
    }
};

/**
 * Mark a word as learned
 */
export const markWordLearned = async (
    token: string,
    wordId: number,
    learned: boolean = true
): Promise<WordProgress> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.WORD_PROGRESS}/${wordId}`, {
            method: 'PUT',
            headers: getAuthHeaders(token),
            body: JSON.stringify({ learned }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Kelime durumu güncellenemedi');
        }

        return data.data;
    } catch (error) {
        console.error('markWordLearned error:', error);
        throw error;
    }
};

/**
 * Update word review progress
 */
export const updateWordReview = async (
    token: string,
    wordId: number,
    correct: boolean
): Promise<WordProgress> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.WORD_PROGRESS}/${wordId}/review`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify({ correct }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'İnceleme kaydedilemedi');
        }

        return data.data;
    } catch (error) {
        console.error('updateWordReview error:', error);
        throw error;
    }
};

/**
 * Get user stats (total words learned, etc.)
 */
export const getUserStats = async (token: string): Promise<{
    total_words_learned: number;
    total_reviews: number;
    accuracy_rate: number;
}> => {
    try {
        const response = await fetch(API_ENDPOINTS.USER_STATS, {
            method: 'GET',
            headers: getAuthHeaders(token),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'İstatistikler alınamadı');
        }

        return data.data;
    } catch (error) {
        console.error('getUserStats error:', error);
        throw error;
    }
};
