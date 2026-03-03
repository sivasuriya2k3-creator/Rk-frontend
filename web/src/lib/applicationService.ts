import api from './api';

const API_BASE_URL = '/applications';

export const applicationService = {
  async submitApplication(data: any) {
    // Check if data is FormData (for file uploads)
    if (data instanceof FormData) {
      const response = await api.post(`${API_BASE_URL}/apply`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    }
    // Otherwise, send as JSON
    const response = await api.post(`${API_BASE_URL}/apply`, data);
    return response.data;
  },

  async submitPositionApplication(data: any) {
    if (data instanceof FormData) {
      const response = await api.post(`${API_BASE_URL}/apply-position`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    }
    const response = await api.post(`${API_BASE_URL}/apply-position`, data);
    return response.data;
  },

  async getAllApplications() {
    const response = await api.get(API_BASE_URL);
    return response.data;
  },

  async getApplicationById(id: string) {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  async acceptApplication(id: string, adminNotes: string, salary?: number, joiningDate?: string) {
    const response = await api.put(`${API_BASE_URL}/${id}/accept`, { adminNotes, salary, joiningDate });
    return response.data;
  },

  async rejectApplication(id: string, adminNotes: string) {
    const response = await api.put(`${API_BASE_URL}/${id}/reject`, { adminNotes });
    return response.data;
  },

  async deleteApplication(id: string) {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  }
};
