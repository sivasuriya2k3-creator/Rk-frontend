import api from './api';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  inquiryType?: 'consultation' | 'collaboration' | 'quote' | 'support' | 'other';
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  phone?: string;
  inquiryType?: 'consultation' | 'collaboration' | 'quote' | 'support' | 'other';
  subject: string;
  message: string;
}

export const contactService = {
  sendMessage: async (data: CreateContactRequest) => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  getAll: async (status?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);

    const response = await api.get(`/contact?${params}`);
    return response.data;
  },

  getById: async (id: string): Promise<{ success: boolean; data: ContactMessage }> => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: 'new' | 'read' | 'replied') => {
    const response = await api.put(`/contact/${id}`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },
};
