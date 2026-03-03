import api from './api';

export interface WebProject {
  _id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  projectUrl?: string;
  technologies: string[];
  featured: boolean;
  category: 'e-commerce' | 'corporate' | 'portfolio' | 'saas' | 'landing-page' | 'other';
  createdAt: string;
}

export const webProjectService = {
  async getAll(): Promise<WebProject[]> {
    const response = await api.get('/web-projects');
    return response.data;
  },

  async getById(id: string): Promise<WebProject> {
    const response = await api.get(`/web-projects/${id}`);
    return response.data;
  },

  async create(data: Omit<WebProject, '_id' | 'createdAt'>): Promise<WebProject> {
    const response = await api.post('/web-projects', data);
    return response.data;
  },

  async update(id: string, data: Partial<WebProject>): Promise<WebProject> {
    const response = await api.put(`/web-projects/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/web-projects/${id}`);
  }
};
