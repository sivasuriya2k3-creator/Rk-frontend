const getApiBaseUrl = () => {
  const envApiUrl = import.meta.env.VITE_API_URL;
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:5002/api`;
    }
  }
  
  return envApiUrl || 'https://rk-backend.vercel.app';
};

const API_BASE_URL = getApiBaseUrl();

export interface ChatMessage {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  category: 'general' | 'support' | 'sales' | 'feedback' | 'other';
  resolved: boolean;
  adminNotes: string;
  sessionId: string;
}

interface SendMessageResponse {
  userMessage: ChatMessage;
  botMessage: ChatMessage;
  botResponse: string;
  suggestedLink?: string;
  suggestedLinkText?: string;
}

interface ChatHistory {
  messages: ChatMessage[];
  total: number;
  pages: number;
}

class ChatbotService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` })
    };
  }

  async sendMessage(
    userId: string,
    userName: string,
    userEmail: string,
    message: string,
    sessionId: string,
    category: string = 'general'
  ): Promise<SendMessageResponse> {
    try {
      if (!userId || !userName || !userEmail || !message || !sessionId) {
        throw new Error('Missing required fields for message');
      }

      const response = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          userId,
          userName,
          userEmail,
          message,
          sessionId,
          category
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to send message: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/history/${userId}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch chat history: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/session/${sessionId}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch session messages: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching session messages:', error);
      throw error;
    }
  }

  // Admin methods
  async getAllMessages(page: number = 1, limit: number = 20): Promise<ChatHistory> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chat/admin/all?page=${page}&limit=${limit}`,
        {
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching all messages:', error);
      throw error;
    }
  }

  async getChatStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/admin/stats`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch chat stats: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching chat stats:', error);
      throw error;
    }
  }

  async markAsRead(messageId: string): Promise<ChatMessage> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/admin/${messageId}/read`, {
        method: 'PATCH',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to mark as read: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  }

  async markAsResolved(
    sessionId: string,
    resolved: boolean,
    adminNotes: string = ''
  ): Promise<ChatMessage[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chat/admin/session/${sessionId}/resolve`,
        {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify({ resolved, adminNotes })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to mark as resolved: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking as resolved:', error);
      throw error;
    }
  }

  async toggleStar(messageId: string, isStarred: boolean): Promise<ChatMessage> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/admin/${messageId}/star`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ isStarred })
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle star: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling star:', error);
      throw error;
    }
  }
}

export default new ChatbotService();
