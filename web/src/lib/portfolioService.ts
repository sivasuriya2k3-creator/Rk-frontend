import api from './api';

export interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  link?: string;
  technologies: string[];
  featured: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioRequest {
  title: string;
  description: string;
  category: string;
  image: string;
  link?: string;
  technologies?: string[];
  featured?: boolean;
}

export const portfolioService = {
  getAll: async (category?: string, featured?: boolean) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (featured !== undefined) params.append('featured', String(featured));

    const response = await api.get(`/portfolio?${params}`);
    return response.data;
  },

  getById: async (id: string): Promise<{ success: boolean; data: PortfolioItem }> => {
    const response = await api.get(`/portfolio/${id}`);
    return response.data;
  },

  create: async (data: CreatePortfolioRequest) => {
    const response = await api.post('/portfolio', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreatePortfolioRequest>) => {
    const response = await api.put(`/portfolio/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/portfolio/${id}`);
    return response.data;
  },
};
