import api from './api';

export interface Animation3D {
  _id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  videoUrl?: string;
  software: string[];
  featured: boolean;
  style: 'abstract' | 'realistic' | 'motion-graphics' | 'character' | 'product' | 'other';
  createdAt: string;
}

export const animation3DService = {
  async getAll(): Promise<Animation3D[]> {
    const response = await api.get('/3d-animations');
    return response.data;
  },

  async getById(id: string): Promise<Animation3D> {
    const response = await api.get(`/3d-animations/${id}`);
    return response.data;
  },

  async create(data: Omit<Animation3D, '_id' | 'createdAt'>): Promise<Animation3D> {
    const response = await api.post('/3d-animations', data);
    return response.data;
  },

  async update(id: string, data: Partial<Animation3D>): Promise<Animation3D> {
    const response = await api.put(`/3d-animations/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/3d-animations/${id}`);
  }
};
