import api from './api';

export const projectService = {
  // Get all projects
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/projects?${params}`);
    return response.data;
  },

  // Get single project
  getById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create project
  create: async (projectData: any) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  // Update project
  update: async (id: string, projectData: any) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await api.get('/projects/stats');
    return response.data;
  },

  // Add milestone
  addMilestone: async (id: string, milestoneData: any) => {
    const response = await api.post(`/projects/${id}/milestones`, milestoneData);
    return response.data;
  },

  // Add note
  addNote: async (id: string, noteData: any) => {
    const response = await api.post(`/projects/${id}/notes`, noteData);
    return response.data;
  }
};
