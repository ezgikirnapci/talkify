/**
 * Chat Service - Backend API integration for AI chat history
 */
import { API_ENDPOINTS, getAuthHeaders } from '../config/apiConfig';

interface ChatMessage {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

interface Conversation {
    id: number;
    title: string;
    created_at: string;
    message_count: number;
}

/**
 * Get all conversations for the user
 */
export const getConversations = async (token: string): Promise<Conversation[]> => {
    try {
        const response = await fetch(API_ENDPOINTS.CONVERSATIONS, {
            method: 'GET',
            headers: getAuthHeaders(token),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Sohbetler alınamadı');
        }

        return data.data;
    } catch (error) {
        console.error('getConversations error:', error);
        throw error;
    }
};

/**
 * Create a new conversation
 */
export const createConversation = async (
    token: string,
    title: string = 'New English Practice'
): Promise<Conversation> => {
    try {
        const response = await fetch(API_ENDPOINTS.CONVERSATIONS, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify({ title }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Sohbet oluşturulamadı');
        }

        return data.data;
    } catch (error) {
        console.error('createConversation error:', error);
        throw error;
    }
};

/**
 * Get messages for a conversation
 */
export const getMessages = async (
    token: string,
    conversationId: number
): Promise<ChatMessage[]> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.CONVERSATIONS}/${conversationId}/messages`, {
            method: 'GET',
            headers: getAuthHeaders(token),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Mesajlar alınamadı');
        }

        return data.data;
    } catch (error) {
        console.error('getMessages error:', error);
        throw error;
    }
};

/**
 * Add a message to a conversation
 */
export const addMessage = async (
    token: string,
    conversationId: number,
    role: 'user' | 'assistant',
    content: string
): Promise<ChatMessage> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.CONVERSATIONS}/${conversationId}/messages`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify({ role, content }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Mesaj gönderilemedi');
        }

        return data.data;
    } catch (error) {
        console.error('addMessage error:', error);
        throw error;
    }
};
