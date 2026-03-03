import api from './api';

export interface UIUXProject {
  _id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  prototypeUrl?: string;
  tools: string[];
  featured: boolean;
  platform: 'web' | 'mobile' | 'desktop' | 'tablet' | 'cross-platform' | 'other';
  createdAt: string;
}

export const uiuxProjectService = {
  async getAll(): Promise<UIUXProject[]> {
    const response = await api.get('/uiux-projects');
    return response.data;
  },

  async getById(id: string): Promise<UIUXProject> {
    const response = await api.get(`/uiux-projects/${id}`);
    return response.data;
  },

  async create(data: Omit<UIUXProject, '_id' | 'createdAt'>): Promise<UIUXProject> {
    const response = await api.post('/uiux-projects', data);
    return response.data;
  },

  async update(id: string, data: Partial<UIUXProject>): Promise<UIUXProject> {
    const response = await api.put(`/uiux-projects/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/uiux-projects/${id}`);
  }
};
