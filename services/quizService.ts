/**
 * Quiz Service - Backend API integration for quizzes
 */
import { API_ENDPOINTS, getAuthHeaders } from '../config/apiConfig';

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correct_answer?: number;
    explanation?: string;
}

interface Quiz {
    id: number;
    title: string;
    description?: string;
    level: string;
    category?: string;
    question_count: number;
    questions?: QuizQuestion[];
}

interface QuizResult {
    id: number;
    quiz_id?: number;
    test_type: string;
    score: number;
    total_questions: number;
    percentage: number;
    completed_at: string;
}

interface QuizStats {
    total_quizzes: number;
    average_score: number;
    best_score: number;
    total_questions_answered: number;
    total_correct?: number;
}

/**
 * Get list of quizzes with optional filters
 */
export const getQuizzes = async (
    token: string,
    level?: string,
    category?: string,
    page: number = 1,
    perPage: number = 20
): Promise<{ quizzes: Quiz[]; pagination: any }> => {
    try {
        const params = new URLSearchParams();
        if (level) params.append('level', level);
        if (category) params.append('category', category);
        params.append('page', page.toString());
        params.append('per_page', perPage.toString());

        const response = await fetch(`${API_ENDPOINTS.QUIZZES}?${params.toString()}`, {
            method: 'GET',
            headers: getAuthHeaders(token),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Quiz listesi alınamadı');
        }

        return data.data;
    } catch (error) {
        console.error('getQuizzes error:', error);
        throw error;
    }
};

/**
 * Get a single quiz with questions
 */
export const getQuiz = async (token: string, quizId: number): Promise<Quiz> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.QUIZZES}/${quizId}`, {
            method: 'GET',
            headers: getAuthHeaders(token),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Quiz bulunamadı');
        }

        return data.data.quiz;
    } catch (error) {
        console.error('getQuiz error:', error);
        throw error;
    }
};

/**
 * Get quiz questions in exam mode (without answers)
 */
export const getQuizQuestions = async (
    token: string,
    quizId: number,
    examMode: boolean = false
): Promise<{ quiz_id: number; title: string; questions: QuizQuestion[] }> => {
    try {
        const params = examMode ? '?exam_mode=true' : '';
        const response = await fetch(`${API_ENDPOINTS.QUIZZES}/${quizId}/questions${params}`, {
            method: 'GET',
            headers: getAuthHeaders(token),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Quiz soruları alınamadı');
        }

        return data.data;
    } catch (error) {
        console.error('getQuizQuestions error:', error);
        throw error;
    }
};

/**
 * Submit quiz result
 */
export const submitQuizResult = async (
    token: string,
    quizId: number | null,
    score: number,
    totalQuestions: number,
    testType: string = 'quiz'
): Promise<QuizResult> => {
    try {
        const response = await fetch(API_ENDPOINTS.QUIZ_SUBMIT, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify({
                quiz_id: quizId,
                score,
                total_questions: totalQuestions,
                test_type: testType,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Quiz sonucu kaydedilemedi');
        }

        return data.data.result;
    } catch (error) {
        console.error('submitQuizResult error:', error);
        throw error;
    }
};

/**
 * Get user's quiz history
 */
export const getQuizHistory = async (
    token: string,
    page: number = 1,
    perPage: number = 20
): Promise<{ history: QuizResult[]; pagination: any }> => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: perPage.toString(),
        });

        const response = await fetch(`${API_ENDPOINTS.QUIZ_HISTORY}?${params.toString()}`, {
            method: 'GET',
            headers: getAuthHeaders(token),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Quiz geçmişi alınamadı');
        }

        return data.data;
    } catch (error) {
        console.error('getQuizHistory error:', error);
        throw error;
    }
};

/**
 * Get user's quiz statistics
 */
export const getQuizStats = async (token: string): Promise<QuizStats> => {
    try {
        const response = await fetch(API_ENDPOINTS.QUIZ_STATS, {
            method: 'GET',
            headers: getAuthHeaders(token),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Quiz istatistikleri alınamadı');
        }

        return data.data.stats;
    } catch (error) {
        console.error('getQuizStats error:', error);
        throw error;
    }
};
